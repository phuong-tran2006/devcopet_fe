const TimerRing = ({ timeLeft = 30 }: { timeLeft?: number }) => {
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <div className="absolute inset-0 rounded-full border-[3px] dark:border-[#29b6f6] border-primary opacity-30 dark:shadow-[0_0_15px_rgba(41,182,246,0.3)] shadow-md transition-colors duration-300"></div>
      <div className="absolute inset-0 rounded-full border-[3px] dark:border-[#29b6f6] border-primary border-t-transparent animate-spin transition-colors duration-300"></div>
      <div className="w-10 h-10 dark:bg-[#0d161d] bg-surface rounded-full flex items-center justify-center z-10 relative shadow-inner transition-colors duration-300">
        <span className="text-[16px] font-black dark:text-[#29b6f6] text-primary dark:drop-shadow-[0_0_5px_rgba(41,182,246,0.8)] transition-colors duration-300">
          {timeLeft}
        </span>
      </div>
      <div className="absolute inset-0 dark:bg-[#29b6f6] bg-primary rounded-full blur-[12px] opacity-10 pointer-events-none transition-colors duration-300"></div>
    </div>
  );
};

export default TimerRing;
