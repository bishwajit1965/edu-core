const Footer = () => {
  const date = new Date();
  return (
    <div className="lg:text-sm text-xs bg-gray-800 text-base-200">
      <div className="lg:flex grid lg:grid-col-12 grid-cols-1 items-center justify-between bg-gray-700 text-base-200 lg:px-16 px-4 lg:py-4 py-2">
        <div className="lg:col-span-3 col-span-12">ONE</div>
        <div className="lg:col-span-3 col-span-12">ONE</div>
        <div className="lg:col-span-3 col-span-12">ONE</div>
        <div className="lg:col-span-3 col-span-12">ONE</div>
      </div>
      <div className="flex items-center justify-center lg:text-sm text-xs bg-gray-800 lg:px-16 px-4 lg:py-4 py-2">
        <p className="lg:text-normal text-xs">
          &copy; {date.getFullYear()} All rights reserved to Mother Project
        </p>
      </div>
    </div>
  );
};

export default Footer;
