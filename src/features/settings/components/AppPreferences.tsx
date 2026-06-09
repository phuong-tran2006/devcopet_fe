import React, { useState } from "react";

interface AppPreferencesProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Đảm bảo export chính xác tên component bằng từ khóa 'export const'
export const AppPreferences: React.FC<AppPreferencesProps> = ({
  theme,
  toggleTheme,
}) => {
  const [language, setLanguage] = useState("English (US)");
  const [haptic, setHaptic] = useState(true);
  const [scale, setScale] = useState(50);
  const [brightness, setBrightness] = useState(60);
  const [fontSize, setFontSize] = useState(40);

  const [protocols, setProtocols] = useState({
    questAlerts: true,
    healthWarning: true,
    worldUpdates: false,
  });

  return (
    <div
      className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors ${
        theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
      }`}
    >
      <h2 className="text-sm font-bold tracking-widest uppercase text-[#76d6d5] flex items-center gap-2">
        🎛️ App Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Theme Mode */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            Theme Mode
          </label>
          <button
            onClick={toggleTheme}
            className={`w-full text-left border rounded-xl px-4 py-2.5 text-sm font-semibold transition-all flex items-center justify-between ${
              theme === "dark"
                ? "bg-background border-[#14232e] text-[#7fe3dd] hover:border-[#7fe3dd]"
                : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400"
            }`}
          >
            <span>
              {theme === "dark"
                ? "Cyberpunk Dark (Active)"
                : "Clean Light Mode (Active)"}
            </span>
            <span className="text-xs text-on-surface-variant">
              ❖ Click to toggle
            </span>
          </button>
        </div>

        {/* 2. Core Language */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            Core Language
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#76d6d5] appearance-none cursor-pointer ${
                theme === "dark"
                  ? "bg-background border-[#14232e] text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option>English (US)</option>
              <option>Tiếng Việt (VN)</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* 3. Haptic Feedback */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            Haptic Feedback
          </label>
          <div
            className={`grid grid-cols-2 p-1 border rounded-xl bg-surface border-outline-variant`}
          >
            <button
              onClick={() => setHaptic(true)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                haptic
                  ? "bg-[#142533] text-[#7fe3dd] border border-[#223a4d]"
                  : "text-on-surface-variant"
              }`}
            >
              ON
            </button>
            <button
              onClick={() => setHaptic(false)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                !haptic
                  ? "bg-[#142533] text-[#ff6b6b] border border-[#223a4d]"
                  : "text-on-surface-variant"
              }`}
            >
              OFF
            </button>
          </div>
        </div>

        {/* 4. Interface Scale */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
            <label>Interface Scale</label>
            <span className="font-mono text-[10px]">{scale}%</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-on-surface-variant text-xs">🔍</span>
            <input
              type="range"
              min="25"
              max="100"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-[#7fe3dd] h-1 bg-[#14232e] rounded-lg cursor-pointer"
            />
            <span className="text-on-surface-variant text-xs">➕</span>
          </div>
        </div>

        {/* 5. System Brightness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
            <label>System Brightness</label>
            <span className="font-mono text-[10px]">{brightness}%</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-on-surface-variant text-xs">☀️</span>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#7fe3dd] h-1 bg-[#14232e] rounded-lg cursor-pointer"
            />
            <span className="text-on-surface-variant text-xs">⚙️</span>
          </div>
        </div>

        {/* 6. Master Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
            <label>Master Font Size</label>
            <span className="font-mono text-[10px]">{fontSize}px</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-on-surface-variant text-xs font-mono text-[10px]">
              TT
            </span>
            <input
              type="range"
              min="12"
              max="64"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#7fe3dd] h-1 bg-[#14232e] rounded-lg cursor-pointer"
            />
            <span className="text-on-surface-variant text-xs font-mono text-sm">
              TT
            </span>
          </div>
        </div>
      </div>

      {/* Notification Protocols */}
      <div
        className={`p-4 border rounded-xl space-y-4 transition-colors ${
          theme === "dark"
            ? "bg-background border-[#14232e]"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase flex items-center gap-2">
          🔔 Notification Protocols
        </p>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={protocols.questAlerts}
              onChange={(e) =>
                setProtocols({ ...protocols, questAlerts: e.target.checked })
              }
              className="accent-[#7fe3dd] rounded"
            />
            Quest Alerts
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={protocols.healthWarning}
              onChange={(e) =>
                setProtocols({ ...protocols, healthWarning: e.target.checked })
              }
              className="accent-[#7fe3dd] rounded"
            />
            Health Warning
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={protocols.worldUpdates}
              onChange={(e) =>
                setProtocols({ ...protocols, worldUpdates: e.target.checked })
              }
              className="accent-[#7fe3dd] rounded"
            />
            World Updates
          </label>
        </div>
      </div>
    </div>
  );
};
