import React from "react";
import { useGetQueueStatusQuery } from "../state/services/queueApi";
import { FaClock, FaUserTag, FaCircle } from "react-icons/fa";

const QueueStatus: React.FC = () => {
  const { data, isLoading, error } = useGetQueueStatusQuery(undefined, {
    pollingInterval: 3000, // Poll every 3 seconds for real-time feel
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold animate-pulse">
          جاري تحديث البيانات...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-10 bg-red-50 rounded-3xl border border-red-100 max-w-md mx-auto">
        <p className="text-red-600 font-bold mb-2">
          عذراً، تعذر الاتصال بالخادم
        </p>
        <p className="text-red-400 text-sm">
          يرجى التأكد من اتصالك بالإنترنت والمحاولة لاحقاً
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FaCircle
          className={`text-[10px] animate-pulse ${data?.isBookingsOpen ? "text-green-500" : "text-orange-500"}`}
        />
        <span
          className={`text-sm font-black uppercase tracking-widest ${data?.isBookingsOpen ? "text-green-600" : "text-orange-600"}`}
        >
          {data?.isBookingsOpen
            ? "الحجوزات مفتوحة الآن"
            : "الحجوزات مغلقة مؤقتاً"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-green-50 text-green-600 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <FaUserTag size={32} />
          </div>
          <span className="text-gray-400 font-black text-sm uppercase tracking-wider mb-1">
            الرقم الحالي قيد الخدمة
          </span>
          <span className="text-7xl font-black text-green-600 tabular-nums drop-shadow-sm">
            {data?.currentNumber || 0}
          </span>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-blue-50 text-blue-600 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <FaClock size={32} />
          </div>
          <span className="text-gray-400 font-black text-sm uppercase tracking-wider mb-1">
            آخر تذكرة تم صرفها
          </span>
          <span className="text-7xl font-black text-blue-600 tabular-nums drop-shadow-sm">
            {data?.lastIssuedNumber || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
