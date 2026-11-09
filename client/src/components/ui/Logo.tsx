const Logo = ({ primaryColor }: { primaryColor: string }) => {
  return (
    <div
      className={
        "lg:h-14 lg:w-14 h-12 w-12 rounded-full flex items-center justify-center lg:p-2.5 p-2 ring-4 ring-white/30 shadow-lg"
      }
      style={{ backgroundColor: primaryColor }}
    >
      <div className="text-base-100 relative">
        <h2 className="lg:text-2xl text-xl font-black tracking-tight text-white leading-none font-stretch-extra-expanded lg:border-b-4 border-b-2 pb-0.5 flex items-center justify-center">
          EC{" "}
        </h2>
        <span className="lg:h-1.5 lg:w-1.5 h-1.25 w-1.25 rounded-full bg-white absolute lg:top-2.5 top-2.75 lg:right-1 right-2"></span>
        <p className="lg:text-[8px] text-[9px]">EDUCORE</p>
      </div>
    </div>
  );
};

export default Logo;
