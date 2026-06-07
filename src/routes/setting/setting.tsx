/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "../../contexts/ThemeContext";
import Header from "../../components/layout/Header";

// BẢN SỬA ĐÚNG: Gọi trực tiếp tên file gốc cùng cấp thư mục bằng dấu ./ (Bỏ dấu gạch dưới đi)
import { ProfileSettings } from "./ProfileSettings";
import { AccountSecurity } from "./AccountSecurity";
import { PetStatus } from "./PetStatus";
import { SystemMetrics } from "./SystemMetrics";
import { AppPreferences } from "./AppPreferences";
export const Route = createFileRoute("/setting/setting")({
  component: SettingComponent,
});

function SettingComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-colors duration-300 select-none ${
        theme === "dark" ? "bg-[#040d14]" : "bg-slate-50"
      }`}
    >
      {/* 1. Thanh Dashboard Header */}
      <Header />

      {/* Layout Content chia làm 2 cột chính */}
      <div className="flex-1 w-full p-4 md:p-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI & GIỮA (2/3 chiều rộng) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1
                className={`text-3xl font-bold tracking-wider ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Command Center (Current: {theme})
              </h1>
              <p className="text-xs text-on-surface-variant uppercase mt-1 tracking-widest">
                System Configuration & Pet Status Dashboard
              </p>
            </div>

            <ProfileSettings theme={theme} />
            <AccountSecurity theme={theme} />
            <AppPreferences theme={theme} toggleTheme={toggleTheme} />
          </div>

          {/* CỘT PHẢI (1/3 chiều rộng) */}
          <div className="space-y-8 lg:mt-12">
            <PetStatus theme={theme} />
            <SystemMetrics theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingComponent;
