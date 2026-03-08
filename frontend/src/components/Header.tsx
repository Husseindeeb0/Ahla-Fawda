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
    <header className="bg-white/95 border-b border-gray-100 py-3 md:py-4 px-4 md:px-6 flex flex-row-reverse justify-between items-center sticky top-0 z-40 shadow-sm backdrop-blur-md">
      {/* Brand/Logo - RTL optimized */}
      <div className="flex items-center gap-2 md:gap-3">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            أحلى فوضى
          </h1>
          <div className="bg-red-600 text-white p-1.5 md:p-2 rounded-lg shadow-md transform hover:-rotate-3 transition-transform">
            <FaUsers size={20} className="md:w-6 md:h-6" />
          </div>
        </Link>
      </div>

      {/* Navigation and Auth - Responsive Spacing */}
      <div className="flex items-center gap-3 md:gap-6">
        <nav className="hidden sm:flex gap-4 md:gap-6 text-gray-600 font-bold">
          <Link to="/" className="hover:text-red-600 transition-colors">
            الرئيسية
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 border-l border-gray-100 pl-3 md:pl-6 h-8 justify-end">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-2 md:gap-4 animate-in fade-in zoom-in-95 duration-300">
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-all p-1.5 md:p-2 rounded-lg hover:bg-red-50"
                title="تسجيل الخروج"
              >
                <FaSignOutAlt size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 px-2 md:px-4 py-1.5 md:py-2 rounded-xl border border-gray-100 max-w-[120px] md:max-w-none">
                {user.role === "admin" && (
                  <span className="hidden xs:inline-block bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-md font-black uppercase">
                    Admin
                  </span>
                )}
                <span className="hidden md:inline-block font-bold text-gray-800 text-sm truncate">
                  {user.name}
                </span>
                <FaUserCircle className="text-gray-400 text-lg md:text-xl" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <Link
                to="/login"
                className="text-gray-600 hover:text-red-600 font-bold px-2 text-sm md:text-base transition-colors"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                className="bg-red-600 text-white font-black px-4 md:px-6 py-2 md:py-2.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all transform active:scale-95 text-xs md:text-sm whitespace-nowrap"
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
