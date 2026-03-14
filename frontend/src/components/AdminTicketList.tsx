import React, { useState } from "react";
import {
  useGetAllTicketsQuery,
  useAdminRemoveTicketMutation,
} from "../state/services/queueApi";
import { FaSearch, FaTrashAlt, FaUserClock, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminTicketList: React.FC = () => {
  const { data: tickets, isLoading, error } = useGetAllTicketsQuery();
  const [removeTicket, { isLoading: isRemoving }] =
    useAdminRemoveTicketMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRemove = async (ticketId: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه التذكرة؟")) {
      try {
        await removeTicket(ticketId).unwrap();
      } catch (err) {
        console.error("Failed to remove ticket:", err);
      }
    }
  };

  const filteredTickets = tickets?.filter((ticket) => {
    const isObject = ticket.userId && typeof ticket.userId === "object";
    const userEmail = isObject ? (ticket.userId as { email?: string }).email || "" : "";
    const userName = isObject ? (ticket.userId as { name?: string }).name || "" : "";
    const customerName = ticket.customerName || "";
    const searchLower = searchTerm.toLowerCase();

    return (
      userEmail.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      ticket.number.toString().includes(searchTerm)
    );
  });

  if (isLoading)
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Loading tickets...
      </div>
    );
  if (error) return null;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col h-[600px] overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <FaUserClock className="text-red-600" />
          قائمة الحجوزات النشطة
        </h3>

        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عبر البريد أو الرقم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-transparent py-3 pl-11 pr-4 rounded-2xl text-sm outline-none focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/5 transition-all"
          />
        </div>
      </div>

      <div className="grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTickets?.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium">
              لا توجد نتائج تطابق بحثك
            </div>
          ) : (
            filteredTickets?.map((ticket) => (
              <motion.div
                key={ticket._id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-3xl border flex items-center justify-between transition-all group ${
                  ticket.status === "called"
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-white border-gray-100 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                      ticket.status === "called"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {ticket.number}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 truncate max-w-[150px]">
                      {ticket.createdByAdmin
                        ? ticket.customerName || "إصدار يدوي"
                        : typeof ticket.userId === "object"
                          ? ticket.userId?.name
                          : "مستخدم نظام"}
                    </div>
                    <div className="text-xs text-gray-500 font-bold flex items-center gap-1">
                      {ticket.createdByAdmin ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] uppercase">
                          By Admin
                        </span>
                      ) : (
                        <>
                          <FaEnvelope className="text-[10px]" />
                          <span className="truncate max-w-[120px]">
                            {typeof ticket.userId === "object"
                              ? ticket.userId?.email
                              : "---"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(ticket._id)}
                  disabled={isRemoving}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                  title="حذف التذكرة"
                >
                  <FaTrashAlt />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          إجمالي الحجوزات: {filteredTickets?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default AdminTicketList;
