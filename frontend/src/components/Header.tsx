import React from "react";
import { FaUsers, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useLogoutMutation } from "../state/services/authApi";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    window.location.reload(); // Refresh to clear all states
  };

  return (
    <header className="bg-white/95 border-b border-gray-100 py-4 px-6 flex flex-row-reverse justify-between items-center sticky top-0 z-50 shadow-sm backdrop-blur-md">
      {/* Brand/Logo - Now on the right for RTL */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            أحلى فوضى
          </h1>
          <div className="bg-red-600 text-white p-2 rounded-lg shadow-md transform hover:-rotate-3 transition-transform">
            <FaUsers size={24} />
          </div>
        </Link>
      </div>

      {/* Navigation and Auth - Now on the left side */}
      <div className="flex items-center gap-6">
        <nav className="flex gap-6 text-gray-600 font-bold">
          <Link to="/" className="hover:text-red-600 transition-colors">
            الرئيسية
          </Link>
        </nav>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-6 h-8 justify-end">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-all p-2 rounded-lg hover:bg-red-50"
                title="تسجيل الخروج"
              >
                <FaSignOutAlt size={18} />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                {user.role === "admin" && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-md font-black uppercase">
                    Admin
                  </span>
                )}
                <span className="font-bold text-gray-800 text-sm">
                  {user.name}
                </span>
                <FaUserCircle className="text-gray-400 text-xl" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <Link
                to="/login"
                className="text-gray-600 hover:text-red-600 font-bold px-2 transition-colors"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                className="bg-red-600 text-white font-black px-6 py-2.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all transform active:scale-95"
              >
                احجز الآن
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
