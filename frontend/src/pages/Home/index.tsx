import React from "react";
import Header from "../../components/Header";
import QueueStatus from "../../components/QueueStatus";
import TicketAction from "../../components/TicketAction";
import AdminControls from "../../components/AdminControls";
import AdminTicketIssuer from "../../components/AdminTicketIssuer";
import AdminTicketList from "../../components/AdminTicketList";
import { useAuth } from "../../hooks/useAuth";

const Queue: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="py-12 pb-32">
        <div
          className={`container mx-auto px-4 ${
            user?.role === "admin"
              ? "lg:grid lg:grid-cols-12 lg:gap-8 text-right"
              : "text-center"
          }`}
          dir={user?.role === "admin" ? "rtl" : "ltr"}
        >
          {/* Main Column */}
          <div className={user?.role === "admin" ? "lg:col-span-8" : "w-full"}>
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                نظام حجز الأدوار الإلكتروني
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12 font-medium">
                احجز دورك من منزلك وراقب الرقم الحالي في الوقت الفعلي. نوفر عليك
                عناء الانتظار الطويل في المركز.
              </p>
            </div>

            <QueueStatus />
            <TicketAction />
          </div>

          {/* Admin Sidebar */}
          {user?.role === "admin" && (
            <div className="lg:col-span-4 mt-12 lg:mt-0 animate-in fade-in slide-in-from-right-10 duration-700">
              <AdminTicketList />
            </div>
          )}
        </div>
      </main>

      {user?.role === "admin" && (
        <>
          <AdminControls />
          <AdminTicketIssuer />
        </>
      )}

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-50 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default Queue;
