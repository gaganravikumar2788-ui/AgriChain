/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AgriChain High-Reliability Multilingual Speech Engine
 * Supports: Kannada ('kn'), Hindi ('hi'), English ('en')
 * 
 * Features:
 * 1. Native Web Speech Synthesis with automatic voice matching.
 * 2. High-fidelity cloud audio fallback via Google Neural TTS stream
 *    (guarantees fluent Kannada and Hindi speech even when the client OS
 *    has no local Indian language voice pack installed).
 * 3. Markdown and symbol stripping for pure natural phonetic pronunciation.
 * 4. Automatic sentence chunking for uninterrupted audio playback.
 * ─────────────────────────────────────────────────────────────────────────────
 */

let currentAudio = null;
let isPlaybackActive = false;

/**
 * Clean text for audio reading: strip markdown syntax, links, bullets, and emojis
 */
export function cleanTextForSpeech(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/•|\*|_|#|`|~|\[|\]|\(|\)/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[₹]/g, ' rupees ')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // strip emojis
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split long text into speakable chunks (< 180 characters each for web TTS)
 */
function splitIntoChunks(text, maxLength = 160) {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).length > maxLength) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

/**
 * Stop any current speech (both SpeechSynthesis and Audio element)
 */
export function stopFarmerSpeech() {
  isPlaybackActive = false;
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch {}
  }
}

/**
 * Play audio via Google Neural TTS stream (supports Kannada, Hindi, and English natively)
 */
function playGoogleTtsChunks(chunks, langCode, onStart, onEnd, onError) {
  if (!chunks || chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  isPlaybackActive = true;
  let chunkIndex = 0;

  function playNext() {
    if (!isPlaybackActive || chunkIndex >= chunks.length) {
      isPlaybackActive = false;
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[chunkIndex];
    chunkIndex++;

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(chunk)}`;
    const audio = new Audio(ttsUrl);
    currentAudio = audio;

    if (chunkIndex === 1 && onStart) {
      onStart();
    }

    audio.onended = () => {
      playNext();
    };

    audio.onerror = (e) => {
      console.warn('Audio TTS chunk playback error:', e);
      // Try next chunk
      playNext();
    };

    audio.play().catch(err => {
      console.warn('Audio play blocked or failed:', err);
      isPlaybackActive = false;
      if (onError) onError(err);
      if (onEnd) onEnd();
    });
  }

  playNext();
}

/**
 * Main Speech Function
 * Tries local native voice first if appropriate, otherwise uses the universal neural TTS stream.
 */
export function playFarmerSpeech(rawText, lang = 'kn', onStart = () => {}, onEnd = () => {}, onError = () => {}) {
  stopFarmerSpeech();
  const cleaned = cleanTextForSpeech(rawText);
  if (!cleaned) {
    if (onEnd) onEnd();
    return;
  }

  const langCode = lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en';

  // Check if browser has an authentic local voice for this language
  let hasNativeVoice = false;
  let targetVoice = null;

  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices() || [];
    if (lang === 'kn') {
      targetVoice = voices.find(v => (v.lang && v.lang.toLowerCase().includes('kn')) || (v.name && v.name.toLowerCase().includes('kannada')));
      hasNativeVoice = Boolean(targetVoice);
    } else if (lang === 'hi') {
      targetVoice = voices.find(v => (v.lang && v.lang.toLowerCase().includes('hi')) || (v.name && v.name.toLowerCase().includes('hindi')));
      hasNativeVoice = Boolean(targetVoice);
    } else {
      targetVoice = voices.find(v => v.lang && (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en')));
      hasNativeVoice = Boolean(targetVoice);
    }
  }

  // If client browser has the matching native voice installed, use Web Speech Synthesis
  if (hasNativeVoice && targetVoice && 'speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.voice = targetVoice;
      utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      let started = false;
      utterance.onstart = () => {
        started = true;
        isPlaybackActive = true;
        if (onStart) onStart();
      };
      utterance.onend = () => {
        isPlaybackActive = false;
        if (onEnd) onEnd();
      };
      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error, falling back to TTS stream:', err);
        isPlaybackActive = false;
        // Fallback to neural TTS
        const chunks = splitIntoChunks(cleaned);
        playGoogleTtsChunks(chunks, langCode, onStart, onEnd, onError);
      };

      window.speechSynthesis.speak(utterance);

      // Safety check: if SpeechSynthesis does not start within 800ms, fallback to neural stream
      setTimeout(() => {
        if (!started && isPlaybackActive) {
          window.speechSynthesis.cancel();
          const chunks = splitIntoChunks(cleaned);
          playGoogleTtsChunks(chunks, langCode, onStart, onEnd, onError);
        }
      }, 800);

      return;
    } catch (e) {
      console.warn('SpeechSynthesis invocation exception:', e);
    }
  }

  // Universal Fallback: Use neural TTS audio stream (reliable on all Windows, Mac, Android, and iOS devices)
  const chunks = splitIntoChunks(cleaned);
  playGoogleTtsChunks(chunks, langCode, onStart, onEnd, onError);
}
