"use client";

const Divider = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200/80" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 sm:px-4 text-[12px] sm:text-[13px] text-gray-400 bg-white/80 backdrop-blur-sm">أو</span>
      </div>
    </div>
  );
};

export default Divider;