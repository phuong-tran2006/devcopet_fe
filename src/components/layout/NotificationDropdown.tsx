import { useState, useRef, useEffect } from "react";
import { Bell, ArrowUp, BookOpen, Medal } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  arrow_upward: <ArrowUp className="w-6 h-6" />,
  menu_book: <BookOpen className="w-6 h-6" />,
  military_tech: <Medal className="w-6 h-6" />,
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Pet Level Up!",
      description: "Flagellate just reached Level 15. New abilities unlocked.",
      time: "2m ago",
      icon: "arrow_upward",
      type: "level_up",
      unread: true,
    },
    {
      id: 2,
      title: "New Lesson Available",
      description: "Arrays & Objects in Python is now open.",
      time: "45m ago",
      icon: "menu_book",
      type: "lesson",
      unread: false,
    },
    {
      id: 3,
      title: "Quest Completed",
      description: "You've earned 500 XP for completing the Daily Challenge.",
      time: "2h ago",
      icon: "military_tech",
      type: "quest",
      unread: false,
    },
  ]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full border border-outline/20 flex items-center justify-center transition-all text-on-surface relative ${
          isOpen ? "bg-on-surface/10" : "hover:bg-on-surface/10"
        }`}
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        {/* Unread Badge */}
        {notifications.some((n) => n.unread) && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#4ade80]"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-[52px] right-[-80px] w-[320px] bg-surface-container-high/95 backdrop-blur-xl border border-on-surface/10 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-on-surface/10 flex justify-between items-center">
          <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
            Notifications
          </h3>
          <button
            onClick={() => setNotifications([])}
            className="text-primary-fixed-dim text-[11px] font-bold tracking-widest uppercase hover:text-primary-fixed transition-colors"
          >
            MARK ALL AS READ
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant text-sm">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-on-surface/5 border border-on-surface/10 rounded-2xl p-4 flex gap-4 relative cursor-pointer hover:bg-on-surface/10 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === "level_up"
                      ? "bg-[#b3a6d9]/20 text-[#b3a6d9]"
                      : "bg-primary-fixed-dim/20 text-primary-fixed-dim"
                  }`}
                >
                  {iconMap[notif.icon] || <Bell className="w-6 h-6" />}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 pr-4">
                  <span className="text-[15px] font-bold text-on-surface mb-1">
                    {notif.title}
                  </span>
                  <span className="text-[13px] font-['Open_Sans'] italic text-on-surface-variant leading-relaxed">
                    {notif.description}
                  </span>
                  <span className="text-[11px] text-on-surface-variant/50 mt-2">
                    {notif.time}
                  </span>
                </div>

                {/* Unread indicator */}
                {notif.unread && (
                  <div className="absolute top-[18px] right-[18px] w-2 h-2 rounded-full bg-[#4ade80]"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
