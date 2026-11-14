const Logo = ({ primaryColor }: { primaryColor: string }) => {
  return (
    <div
      className={
        "lg:h-16 lg:w-16 h-14 w-14 rounded-full flex items-center justify-center lg:p-2.5 p-2 ring-4 ring-white/30 shadow-lg"
      }
      style={{ backgroundColor: primaryColor }}
    >
      <div className="text-base-100">
        <h2 className="lg:text-3xl text-2xl font-black tracking-tight text-white leading-none font-stretch-extra-expanded lg:border-b-4 border-b-2 pb-0.5 flex items-center justify-center">
          EC
        </h2>
        <p className="lg:text-[10px] text-[9px] font-stretch-expanded">
          EDUCORE
        </p>
      </div>
    </div>
  );
};

export default Logo;
