import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../state/services/authApi";
import { FaUser, FaEnvelope, FaLock, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData).unwrap();
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-red-600 text-white p-4 rounded-3xl shadow-xl mb-4 rotate-3">
            <FaUsers size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-500 font-medium">
            ابدأ بحجز دورك بسهولة ومتابعته لحظة بلحظة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50/50 outline-none transition-all font-bold text-gray-800"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="relative group">
            <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50/50 outline-none transition-all font-bold text-gray-800"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="password"
              placeholder="كلمة المرور"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50/50 outline-none transition-all font-bold text-gray-800"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              عذراً، حدث خطأ أثناء إنشاء الحساب. تأكد من صحة البيانات.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-bold">
          تملك حساباً بالفعل؟{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
