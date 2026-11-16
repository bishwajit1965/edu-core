import { Outlet } from "react-router-dom";

const StudentAuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-150px)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* LEFT: INSTITUTION BRANDING */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#12304A] p-8 text-white sm:p-12">
          {/* Decorative background */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-40 border-white/5" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border-50 border-teal-400/10" />

          <div className="relative z-10">
            {/* Replace with institution logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-[#12304A]">
                E
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  Your Institution
                </h1>
                <p className="text-xs text-slate-300">School & College</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-16">
            <span className="mb-5 inline-block rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal-200">
              Student Portal
            </span>

            <h2 className="max-w-lg text-4xl font-bold leading-tight sm:text-5xl">
              Your learning journey,
              <span className="text-teal-300"> all in one place.</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Access your academic profile, class routine, examination
              schedules, results and important institutional notices through
              your personal student portal.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-sm text-slate-300">
              A connected academic experience.
            </p>
            <p className="mt-2 text-xs text-slate-400">Powered by EduCore</p>
          </div>
        </section>

        {/* RIGHT: LOGIN / OTP FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
                Welcome
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-800">
                Student Access
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in securely to access your personal academic information.
              </p>
            </div>

            <Outlet />

            <div className="mt-10 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-400">
                For login assistance, please contact your institution's office.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentAuthLayout;
