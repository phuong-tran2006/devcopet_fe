import React, { useState } from "react";
import { useAuthStore } from "../../users/store/auth.store";

interface AccountSecurityProps {
  theme: "light" | "dark";
}

export const AccountSecurity: React.FC<AccountSecurityProps> = ({ theme }) => {
  // State quản lý nút bật/tắt bảo mật 2 lớp (2FA)
  const [isTwoFactor, setIsTwoFactor] = useState(true);
  const user = useAuthStore((state) => state.user);

  return (
    <div
      className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors ${
        theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Tiêu đề phân hệ với icon Khiên Bảo Mật */}
      <h2 className="text-sm font-bold tracking-widest uppercase text-[#76d6d5] flex items-center gap-2">
        🛡️ Account Security
      </h2>

      <div className="space-y-4">
        {/* 1. Phân hệ Email gốc */}
        <div
          className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
            theme === "dark"
              ? "bg-[#040d14] border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">
              Primary Email
            </p>
            <p
              className={`text-sm mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
            >
              {user?.email || "No email connected"}
            </p>
          </div>
          <button
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${
              theme === "dark"
                ? "bg-[#142533] hover:bg-[#1c3245] text-slate-300 border-[#223a4d]"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Change Email
          </button>
        </div>

        {/* 2. Phân hệ Master Password */}
        <div
          className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
            theme === "dark"
              ? "bg-[#040d14] border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">
              Master Password
            </p>
          </div>
          <button
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${
              theme === "dark"
                ? "bg-[#142533] hover:bg-[#1c3245] text-slate-300 border-[#223a4d]"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            Reset Key
          </button>
        </div>

        {/* 3. Nút Toggle Switch 2FA xịn mịn theo ảnh */}
        <div
          className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
            theme === "dark"
              ? "bg-[#040d14]/50 border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div>
            <p
              className={`text-sm font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
            >
              Two-Factor Authentication
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Enhance your security vault
            </p>
          </div>

          {/* Nút gạt chuyển trạng thái */}
          <button
            onClick={() => setIsTwoFactor(!isTwoFactor)}
            className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
              isTwoFactor ? "bg-[#1c3242]" : "bg-slate-300 dark:bg-slate-800"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full shadow-md transform duration-300 ${
                isTwoFactor
                  ? "bg-[#7fe3dd] translate-x-6 shadow-[0_0_8px_rgba(127,227,221,0.5)]"
                  : "bg-white translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
