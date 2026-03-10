import React, { useState } from "react";
import {
  useIncrementNumberMutation,
  useDecrementNumberMutation,
  useToggleBookingsMutation,
  useResetQueueMutation,
  useGetQueueStatusQuery,
} from "../state/services/queueApi";
import { useAuth } from "../hooks/useAuth";
import {
  FaPlus,
  FaMinus,
  FaPowerOff,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
  FaCog,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: status } = useGetQueueStatusQuery();

  const [increment, { isLoading: isIncrementing }] =
    useIncrementNumberMutation();
  const [decrement, { isLoading: isDecrementing }] =
    useDecrementNumberMutation();
  const [toggleBookings, { isLoading: isToggling }] =
    useToggleBookingsMutation();
  const [resetQueue, { isLoading: isResetting }] = useResetQueueMutation();

  const handleIncrement = async () => {
    try {
      setLocalError(null);
      await increment().unwrap();
    } catch (err: any) {
      setLocalError(err.data?.message || "فشلت عملية الزيادة");
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  const handleDecrement = async () => {
    try {
      setLocalError(null);
      await decrement().unwrap();
    } catch (err: any) {
      setLocalError(err.data?.message || "فشلت عملية النقصان");
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <>
      {/* Error Message Tooltip */}
      <AnimatePresence>
        {localError && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-50 bg-red-600 text-white py-2 px-4 rounded-xl shadow-xl font-bold text-sm"
          >
            {localError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white py-3 px-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <FaCog
          className={`transition-transform duration-500 ${isOpen ? "rotate-90" : "rotate-0"} text-lg`}
        />
        <span className="font-bold text-sm whitespace-nowrap">
          {isOpen ? "إغلاق" : "لوحة التحكم"}
        </span>
        {isOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </button>

      {/* Admin Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-40 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 w-[calc(100%-3rem)] sm:w-80 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-black text-gray-900 text-lg">إدارة الدور</h3>
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                Admin Mode
              </div>
            </div>

            <div className="space-y-4">
              {/* Counter Controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleIncrement}
                  disabled={isIncrementing}
                  className="bg-green-600 text-white font-bold py-4 px-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50 shadow-lg shadow-green-100"
                >
                  <FaPlus size={20} />
                  <span>التالي</span>
                </button>
                <button
                  onClick={handleDecrement}
                  disabled={
                    isDecrementing || !status || status.currentNumber === 0
                  }
                  className="bg-gray-100 text-gray-800 font-bold py-4 px-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  <FaMinus size={20} />
                  <span>السابق</span>
                </button>
              </div>

              {/* Status Toggle */}
              <button
                onClick={() => toggleBookings()}
                disabled={isToggling}
                className={`w-full font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-sm ${
                  status?.isBookingsOpen
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100"
                }`}
              >
                <FaPowerOff />
                {status?.isBookingsOpen ? "إيقاف الحجوزات" : "فتح الحجوزات"}
              </button>

              {/* Danger Zone */}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "هل أنت متأكد من تصفير الدور وحذف جميع الحجوزات؟",
                      )
                    ) {
                      resetQueue();
                    }
                  }}
                  disabled={isResetting}
                  className="w-full bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  <FaTrash size={14} />
                  <span className="text-sm">تصفير كافة البيانات</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminControls;
