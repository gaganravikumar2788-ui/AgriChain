import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User, MapPin, CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { verifyIndianMobile, verifyIndianPincode, cleanIndianMobile } from '../utils/indianVerification';

export default function ConsumerRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: 'Bengaluru',
    pincode: '',
    state: 'Karnataka'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatic Indian Verification (No OTP needed)
  const mobileVerification = verifyIndianMobile(formData.mobile);
  const pincodeVerification = verifyIndianPincode(formData.pincode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce Indian Identity Requirement
    if (!mobileVerification.isValid) {
      alert("Registration Error: AgriChain Direct-from-Farm is restricted to Indian domestic consumers. Please enter a valid 10-digit Indian Mobile number (+91).");
      return;
    }

    if (formData.pincode && !pincodeVerification.isValid) {
      alert("Please enter a valid 6-digit Indian PIN code for delivery routing.");
      return;
    }

    setIsSubmitting(true);
    const userId = `consumer_${cleanIndianMobile(formData.mobile)}_${Date.now()}`;

    try {
      if (db) {
        try {
          await setDoc(doc(db, 'users', userId), {
            role: 'CONSUMER',
            name: formData.name,
            email: formData.email,
            mobile: mobileVerification.formatted,
            city: formData.city,
            pincode: formData.pincode,
            state: formData.state,
            nationality: 'Indian',
            verifiedIndian: true,
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn("Firestore save fallback:", dbErr);
        }
      }

      localStorage.setItem('consumerName', formData.name);
      localStorage.setItem('consumerMobile', mobileVerification.formatted);
      localStorage.setItem('agrichain_user', JSON.stringify({
        id: userId,
        role: 'CONSUMER',
        name: formData.name,
        mobile: mobileVerification.formatted,
        city: formData.city,
        verifiedIndian: true
      }));

      alert(`🇮🇳 Indian Consumer Identity Automatically Verified!\nWelcome to AgriChain Direct-to-Consumer, ${formData.name}.`);
      navigate('/farmer/market');
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-purple-500/30">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 text-3xl mb-2 shadow-sm">
          🛒
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Consumer Registration
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-purple-50 border border-purple-300 text-purple-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Automated Indian Resident Verification (No OTP Required)</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Consumer Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900"
              placeholder="e.g. Priya Sharma"
            />
          </div>
        </div>

        {/* Indian Mobile Number with Automatic Verification */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Indian Mobile Number (+91) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <span className="text-base mr-1">🇮🇳</span>
              <Phone size={16} />
            </div>
            <input
              type="tel"
              name="mobile"
              required
              maxLength={14}
              value={formData.mobile}
              onChange={handleChange}
              className={`pl-16 w-full p-3 border-2 rounded-xl focus:outline-none font-medium transition ${
                mobileVerification.isValid
                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-bold'
                  : formData.mobile.length > 0
                  ? 'border-amber-400 bg-amber-50/20 text-gray-900'
                  : 'border-gray-200 text-gray-900 focus:border-purple-500'
              }`}
              placeholder="9876543210 or +91 98765 43210"
            />
          </div>

          {/* Automatic Indian Verification Status */}
          {mobileVerification.isValid ? (
            <div className="mt-2 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{mobileVerification.message} • Automatically Approved</span>
            </div>
          ) : formData.mobile.length > 0 ? (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{mobileVerification.message}</span>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 mt-1">
              Indian mobile numbers are automatically verified without OTP delays.
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Email Address (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900"
              placeholder="priya.sharma@example.com"
            />
          </div>
        </div>

        {/* City & PIN Code with Automatic Postal Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Delivery City *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="pl-10 w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900"
                placeholder="e.g. Bengaluru / Mysuru"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Indian PIN Code *
            </label>
            <input
              type="text"
              name="pincode"
              required
              maxLength={6}
              value={formData.pincode}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-xl font-mono font-bold focus:outline-none transition ${
                pincodeVerification.isValid
                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900'
                  : formData.pincode.length > 0
                  ? 'border-amber-400 text-gray-900'
                  : 'border-gray-200 text-gray-900 focus:border-purple-500'
              }`}
              placeholder="e.g. 560001"
            />
            {formData.pincode && (
              <span className={`text-[11px] font-bold block mt-1 ${pincodeVerification.isValid ? 'text-emerald-700' : 'text-amber-700'}`}>
                {pincodeVerification.message}
              </span>
            )}
          </div>
        </div>

        {/* State Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            State *
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold text-gray-800 bg-white"
          >
            <option value="Karnataka">Karnataka (ಕರ್ನಾಟಕ)</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Kerala">Kerala</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Other India">Other Domestic Indian State</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !mobileVerification.isValid}
          className="w-full mt-2 bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-purple-700/25 transition active:scale-98 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Verifying & Registering...</span>
          ) : (
            <>
              <span>Register as Consumer (Auto-Verified 🇮🇳)</span>
              <CheckCircle2 size={18} />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
