import React, { useState } from "react";
import {
  useAdminCreateTicketMutation,
  useGetQueueStatusQuery,
} from "../state/services/queueApi";
import { useAuth } from "../hooks/useAuth";
import {
  FaUserPlus,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaTicketAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminTicketIssuer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const { data: status } = useGetQueueStatusQuery();
  const [adminCreateTicket, { isLoading: isCreatingTicket }] =
    useAdminCreateTicketMutation();

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError(null);
      await adminCreateTicket({
        customerName: customerName.trim() || undefined,
      }).unwrap();
      setCustomerName("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setIsOpen(false);
    } catch (err: any) {
      setLocalError(err.data?.message || "فشل إنشاء التذكرة");
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <>
      {/* Success/Error Alerts */}
      <AnimatePresence>
        {localError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-40 right-6 z-50 bg-red-600 text-white py-2 px-4 rounded-xl shadow-xl font-bold text-sm"
          >
            {localError}
          </motion.div>
        )}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-40 right-6 z-50 bg-emerald-600 text-white py-2 px-4 rounded-xl shadow-xl font-bold text-sm flex items-center gap-2"
          >
            <FaCheckCircle />
            <span>تم إصدار التذكرة بنجاح</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button for Ticket Issuance */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white py-3 px-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <FaUserPlus className="text-lg" />
        <span className="font-bold text-sm whitespace-nowrap">إصدار تذكرة</span>
        {isOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </button>

      {/* Issuance Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 w-[calc(100%-3rem)] sm:w-80"
          >
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <FaTicketAlt />
                </div>
                <h3 className="font-black text-gray-900 text-lg">
                  تذكرة فورية
                </h3>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                Walk-in
              </div>
            </div>

            <form onSubmit={handleIssueTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block px-1">
                  اسم الزبون (اختياري)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثلاً: أحمد فؤاد..."
                  className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingTicket || !status?.isBookingsOpen}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100 mt-2"
              >
                {isCreatingTicket ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>تأكيد الإصدار</span>
                  </>
                )}
              </button>

              {!status?.isBookingsOpen && (
                <p className="text-[10px] text-center text-orange-600 font-bold bg-orange-50 p-2 rounded-lg">
                  لا يمكن الإصدار حالياً لأن الحجوزات مغلقة
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminTicketIssuer;
