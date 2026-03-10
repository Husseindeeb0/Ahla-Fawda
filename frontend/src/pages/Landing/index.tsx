import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaTicketAlt,
  FaClock,
  FaChartLine,
  FaDesktop,
  FaCheckCircle,
  FaAngleRight,
  FaAngleLeft,
  FaGlobe,
  FaMobileAlt,
  FaSmile,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";

const Landing: React.FC = () => {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const { user } = useAuth();

  const content = {
    en: {
      dir: "ltr",
      welcome: "Welcome to Ahla Fawda",
      subtitle: "Electronic Queue Management System",
      description:
        "Save time, skip the line. Book your turn from home and watch the real-time queue status from anywhere.",
      cta: user ? "Enter Queue Dashboard" : "Get Started Now",
      howItWorks: "How to Use Ahla Fawda?",
      steps: [
        {
          icon: <FaUserPlus />,
          title: "1. Signup / Login",
          text: "Create an account or login to identify your ticket in our system.",
          link: user ? "/home" : "/signup",
          buttonText: user ? "Go to Dashboard" : "Sign Up / Login",
        },
        {
          icon: <FaTicketAlt />,
          title: "2. Book Your Ticket",
          text: "Once logged in, click 'Book Now' to receive your unique queue number.",
          link: "/home",
          buttonText: "Book Now",
        },
        {
          icon: <FaClock />,
          title: "3. Monitor in Real-time",
          text: "Keep an eye on the current number. We'll show you how many people are still in line.",
          link: "/home",
          buttonText: "Watch Queue",
        },
      ],
      numbersMeaning: "What do the numbers mean?",
      currentNumTitle: "Current Number",
      currentNumText:
        "The number currently being served at our desk. If this is your number, it's your turn!",
      lastNumTitle: "Last Issued Number",
      lastNumText: "The total number of tickets given to customers today.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "What if I missed my turn?",
          a: "If you missed your turn, you must visit the center and ask the organizer there to delete your previous booking. Once deleted, you will be able to book a new number through the system.",
        },
      ],
      benefitsTitle: "Why Choose Ahla Fawda?",
      benefits: [
        {
          icon: <FaClock />,
          title: "Save Time",
          text: "No more waiting in long lines. Book your turn and monitor from anywhere.",
        },
        {
          icon: <FaMobileAlt />,
          title: "Convenience",
          text: "Access the system from any device, anytime. Your queue is always at your fingertips.",
        },
        {
          icon: <FaSmile />,
          title: "Better Experience",
          text: "Reduce stress and improve your visit with a clear, organized queue system.",
        },
      ],
      footer: "Built with passion for a better organization experience.",
    },
    ar: {
      dir: "rtl",
      welcome: "أهلاً بكم في أحلى فوضى",
      subtitle: "نظام إدارة الحجوزات والأدوار الإلكتروني",
      description:
        "وفر وقتك، وتخطى عناء الانتظار. احجز دورك من منزلك وراقب حالة الدور مباشرة من أي مكان.",
      cta: user ? "ادخل إلى لوحة التحكم" : "ابدأ الآن",
      howItWorks: "كيف تستخدم نظام أحلى فوضى؟",
      steps: [
        {
          icon: <FaUserPlus />,
          title: "١. التسجيل أو الدخول",
          text: "أنشئ حساباً جديداً أو سجل دخولك لتتمكن من حجز تذكرتك.",
          link: user ? "/home" : "/signup",
          buttonText: user ? "ادخل للوحة التحكم" : "سجل أو ادخل",
        },
        {
          icon: <FaTicketAlt />,
          title: "٢. احجز دورك",
          text: "بعد تسجيل الدخول، اضغط على 'احجز الآن' لتحصل على رقمك الخاص.",
          link: "/home",
          buttonText: "احجز الآن",
        },
        {
          icon: <FaClock />,
          title: "٣. راقب الدور مباشرة",
          text: "تابع الرقم الحالي على الشاشة. سنخبرك كم شخصاً لا يزال قبلك.",
          link: "/home",
          buttonText: "راقب الدور",
        },
      ],
      numbersMeaning: "ماذا تعني الأرقام في الشاشة؟",
      currentNumTitle: "الرقم الحالي قيد الخدمة",
      currentNumText:
        "هذا هو الرقم الذي يتم خدمته حالياً في المركز. إذا كان هذا رقمك، فقد وصل دورك!",
      lastNumTitle: "آخر تذكرة تم صرفها",
      lastNumText:
        "إجمالي عدد التذاكر التي تم حجزها من قبل الزبائن لهذا اليوم.",
      faqTitle: "الأسئلة الشائعة",
      faqs: [
        {
          q: "ماذا لو فاتني دوري؟",
          a: "إذا فاتك دورك، يجب عليك التوجه إلى المركز وطلب من المنظم هناك حذف حجزك السابق، لكي تتمكن من حجز رقم دور جديد عبر النظام.",
        },
      ],
      benefitsTitle: "لماذا تختار أحلى فوضى؟",
      benefits: [
        {
          icon: <FaClock />,
          title: "وفر وقتك",
          text: "لا مزيد من الانتظار في طوابير طويلة. احجز دورك وراقبه من منزلك.",
        },
        {
          icon: <FaMobileAlt />,
          title: "سهولة الاستخدام",
          text: "ادخل إلى النظام من أي جهاز وفي أي وقت.",
        },
        {
          icon: <FaSmile />,
          title: "تجربة مريحة",
          text: "تمتع بزيارة منظمة وخالية من التوتر والارتباك.",
        },
      ],
      footer: "تم البناء بشغف لتنظيم تجربة أفضل للجميع.",
    },
  };

  const t = content[lang];

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col ${t.dir === "rtl" ? "font-sans rtl" : "font-sans ltr"}`}
      dir={t.dir}
    >
      <Header />

      {/* Language Toggle */}
      <div className="fixed top-20 right-6 md:right-12 z-40 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-1">
        <button
          onClick={() => setLang("en")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${lang === "en" ? "bg-red-600 text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-gray-100"}`}
        >
          English
        </button>
        <button
          onClick={() => setLang("ar")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${lang === "ar" ? "bg-red-600 text-white shadow-lg shadow-red-200" : "text-gray-500 hover:bg-gray-100"}`}
        >
          العربية
        </button>
      </div>

      <main className="grow pt-10 md:pt-20 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Hero Section */}
          <section className="text-center mb-24 md:mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block p-4 mb-8 bg-red-100 rounded-3xl text-red-600 animate-pulse"
            >
              <FaDesktop className="text-4xl md:text-5xl" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight"
            >
              {t.welcome}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black text-red-600 mb-8 opacity-80"
            >
              {t.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/home"
                className="inline-flex items-center gap-4 bg-red-600 text-white px-10 py-5 rounded-4xl text-xl font-black shadow-2xl shadow-red-200 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all group"
              >
                <span>{t.cta}</span>
                {t.dir === "ltr" ? (
                  <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                ) : (
                  <FaAngleLeft className="group-hover:-translate-x-1 transition-transform" />
                )}
              </Link>
            </motion.div>
          </section>

          {/* How it Works */}
          <section className="mb-32">
            <h3 className="text-3xl md:text-4xl font-black text-center mb-16 text-gray-900">
              {t.howItWorks}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center group hover:shadow-2xl transition-all duration-500"
                >
                  <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 text-3xl">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-black mb-4 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 text-center font-bold leading-relaxed mb-8">
                    {step.text}
                  </p>
                  <Link
                    to={step.link}
                    className="mt-auto bg-gray-900 text-white font-black py-4 px-8 rounded-2xl text-sm transition-all hover:bg-red-600 hover:scale-105 active:scale-95 shadow-lg shadow-gray-100 flex items-center gap-2"
                  >
                    <span>{step.buttonText}</span>
                    {t.dir === "ltr" ? <FaAngleRight /> : <FaAngleLeft />}
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-32">
            <h3 className="text-3xl md:text-4xl font-black text-center mb-16 text-gray-900">
              {t.faqTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {t.faqs.map((faq: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <h4 className="font-black text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    {faq.q}
                  </h4>
                  <p className="text-gray-500 font-bold leading-relaxed pr-4 border-l-2 border-red-50 ml-2">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Dictionary Section */}
          <section className="max-w-5xl mx-auto">
            <div className="bg-gray-900 text-white p-10 md:p-16 rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
              {/* Decoration blobs */}
              <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black mb-12 flex items-center gap-4">
                  <FaGlobe className="text-red-500" />
                  {t.numbersMeaning}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 p-3 rounded-2xl">
                        <FaCheckCircle className="text-2xl" />
                      </div>
                      <h4 className="text-2xl font-black text-emerald-400">
                        {t.currentNumTitle}
                      </h4>
                    </div>
                    <p className="text-gray-400 font-bold leading-relaxed text-lg">
                      {t.currentNumText}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 p-3 rounded-2xl">
                        <FaChartLine className="text-2xl" />
                      </div>
                      <h4 className="text-2xl font-black text-blue-400">
                        {t.lastNumTitle}
                      </h4>
                    </div>
                    <p className="text-gray-400 font-bold leading-relaxed text-lg">
                      {t.lastNumText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 font-black text-sm uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Ahla Fawda | {t.footer}
          </p>
        </div>
      </footer>

      {/* Decorative ornaments */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-red-50/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[35%] h-[35%] bg-blue-50/50 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default Landing;
