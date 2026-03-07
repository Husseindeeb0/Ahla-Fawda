import React from "react";
import {
  useGetMyTicketQuery,
  useTakeNumberMutation,
  useGetQueueStatusQuery,
} from "../state/services/queueApi";
import { useAuth } from "../hooks/useAuth";
import { FaTicketAlt, FaCheckCircle, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TicketAction: React.FC = () => {
  const { user } = useAuth();
  const { data: myTicket } = useGetMyTicketQuery();
  const { data: status } = useGetQueueStatusQuery();
  const [takeNumber, { isLoading }] = useTakeNumberMutation();

  const handleTakeNumber = async () => {
    if (user && !user.savedNumber) {
      await takeNumber();
    }
  };

  const waitCount =
    myTicket && status ? myTicket.number - status.currentNumber : 0;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <FaLock className="text-gray-400 text-4xl mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          يرجى تسجيل الدخول للحصول على رقم
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          يجب أن تملك حساباً لتتمكن من حجز دورك ومتابعته
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-all"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/signup"
            className="bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12 px-4 w-full">
      {!myTicket ? (
        <div className="w-full flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTakeNumber}
            disabled={isLoading || !status?.isBookingsOpen}
            className={`text-white text-2xl font-bold py-6 px-12 rounded-2xl shadow-2xl transition-all flex items-center gap-4 ${
              status?.isBookingsOpen
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FaTicketAlt />
            {status?.isBookingsOpen
              ? "احجز دورك الآن"
              : "الحجوزات مغلقة حالياً"}
          </motion.button>
          {!status?.isBookingsOpen && (
            <p className="mt-4 text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg">
              عذراً، عمليات الحجز متوقفة حالياً بقرار من الإدارة.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-linear-to-br from-red-600 to-red-800 text-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md relative overflow-hidden transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="flex flex-col items-center text-center relative z-10">
            <span className="text-red-200 font-bold uppercase tracking-widest text-sm mb-2 opacity-80">
              رقمك المخصص
            </span>
            <span className="text-9xl font-black mb-4 tabular-nums drop-shadow-lg">
              {myTicket.number}
            </span>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 w-full flex items-center justify-center gap-3 border border-white/10">
              <FaCheckCircle className="text-green-300 drop-shadow-sm" />
              <span className="font-bold text-lg">
                {waitCount > 0
                  ? `بقي ${waitCount} أشخاص قبلك`
                  : waitCount === 0
                    ? "لقد وصل دورك! تفضل بالدخول"
                    : "تمت خدمتك بنجاح"}
              </span>
            </div>

            <p className="mt-6 text-red-100 text-sm opacity-80 leading-relaxed max-w-[80%]">
              {waitCount >= 0
                ? "يرجى التواجد في المركز ومراقبة الشاشة باستمرار لتجنب فوات دورك."
                : "شكراً لانتظارك! نتمنى أن تكون خدمتنا قد نالت إعجابك."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketAction;
