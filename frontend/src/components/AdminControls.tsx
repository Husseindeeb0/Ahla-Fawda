import {
  useIncrementNumberMutation,
  useDecrementNumberMutation,
  useToggleBookingsMutation,
  useResetQueueMutation,
  useGetQueueStatusQuery,
} from "../state/services/queueApi";
import { useAuth } from "../hooks/useAuth";
import { FaPlus, FaMinus, FaPowerOff, FaTrash } from "react-icons/fa";

const AdminControls: React.FC = () => {
  const { user } = useAuth();
  const { data: status } = useGetQueueStatusQuery();
  const [increment, { isLoading: isIncrementing }] =
    useIncrementNumberMutation();
  const [decrement, { isLoading: isDecrementing }] =
    useDecrementNumberMutation();
  const [toggleBookings, { isLoading: isToggling }] =
    useToggleBookingsMutation();
  const [resetQueue, { isLoading: isResetting }] = useResetQueueMutation();

  if (user?.role !== "admin") return null;

  return (
    <div className="fixed bottom-6 left-6 bg-white p-6 rounded-2xl shadow-2xl border border-red-100 z-50 animate-in fade-in slide-in-from-bottom-5 w-72">
      <h3 className="font-bold text-gray-800 mb-4 text-center">
        لوحة تحكم المسؤول
      </h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => increment()}
            disabled={isIncrementing}
            className="bg-green-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <FaPlus />
            التالي
          </button>
          <button
            onClick={() => decrement()}
            disabled={isDecrementing || !status || status.currentNumber === 0}
            className="bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <FaMinus />
            السابق
          </button>
        </div>

        <button
          onClick={() => toggleBookings()}
          disabled={isToggling}
          className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
            status?.isBookingsOpen
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-green-100 hover:bg-green-200 text-green-800"
          }`}
        >
          <FaPowerOff />
          {status?.isBookingsOpen ? "إيقاف الحجوزات" : "فتح الحجوزات"}
        </button>

        <button
          onClick={() => {
            if (
              window.confirm("هل أنت متأكد من تصفير الدور وحذف جميع الحجوزات؟")
            ) {
              resetQueue();
            }
          }}
          disabled={isResetting}
          className="w-full bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50"
        >
          <FaTrash />
          تصفير الدور
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
