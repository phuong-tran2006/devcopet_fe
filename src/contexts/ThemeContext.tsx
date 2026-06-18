import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export interface ProtocolsType {
  questAlerts: boolean;
  healthWarning: boolean;
  worldUpdates: boolean;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  haptic: boolean;
  setHaptic: (haptic: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  protocols: ProtocolsType;
  setProtocols: (protocols: ProtocolsType) => void;
  t: (key: string) => string;
  triggerHaptic: (duration?: number) => void;
}

const translations: Record<string, Record<string, string>> = {
  "English (US)": {
    course: "Course",
    roadmap: "Roadmap",
    arena: "Arena",
    leaderboard: "Leaderboard",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    signUp: "Sign Up",
    appPreferences: "App Preferences",
    themeMode: "Theme Mode",
    coreLanguage: "Core Language",
    hapticFeedback: "Haptic Feedback",
    interfaceScale: "Interface Scale",
    systemBrightness: "System Brightness",
    masterFontSize: "Master Font Size",
    notificationProtocols: "Notification Protocols",
    questAlerts: "Quest Alerts",
    healthWarning: "Health Warning",
    worldUpdates: "World Updates",
    clickToToggle: "❖ Click to toggle",
    cyberpunkDark: "Cyberpunk Dark (Active)",
    cleanLight: "Clean Light Mode (Active)",
    on: "ON",
    off: "OFF",
  },
  "Tiếng Việt (VN)": {
    course: "Khóa học",
    roadmap: "Lộ trình",
    arena: "Đấu trường",
    leaderboard: "Bảng xếp hạng",
    settings: "Cài đặt",
    profile: "Hồ sơ",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    signUp: "Đăng ký",
    appPreferences: "Tùy chọn ứng dụng",
    themeMode: "Chế độ giao diện",
    coreLanguage: "Ngôn ngữ chính",
    hapticFeedback: "Phản hồi xúc giác",
    interfaceScale: "Tỷ lệ giao diện",
    systemBrightness: "Độ sáng hệ thống",
    masterFontSize: "Cỡ chữ chính",
    notificationProtocols: "Giao thức thông báo",
    questAlerts: "Cảnh báo nhiệm vụ",
    healthWarning: "Cảnh báo sức khỏe",
    worldUpdates: "Cập nhật thế giới",
    clickToToggle: "❖ Nhấp để thay đổi",
    cyberpunkDark: "Tối Cyberpunk (Hoạt động)",
    cleanLight: "Sáng Tối giản (Hoạt động)",
    on: "BẬT",
    off: "TẮT",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme;
      return savedTheme || "dark";
    } catch {
      return "dark";
    }
  });

  // Language state
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem("pref_language") || "English (US)";
    } catch {
      return "English (US)";
    }
  });

  // Haptic feedback state
  const [haptic, setHapticState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("pref_haptic");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  // Scale state
  const [scale, setScaleState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("pref_scale");
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  // Brightness state
  const [brightness, setBrightnessState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("pref_brightness");
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  // Font size state
  const [fontSize, setFontSizeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("pref_fontSize");
      return saved ? Number(saved) : 16;
    } catch {
      return 16;
    }
  });

  // Notification protocols state
  const [protocols, setProtocolsState] = useState<ProtocolsType>(() => {
    try {
      const saved = localStorage.getItem("pref_protocols");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to parse saved protocols:", e);
    }
    return {
      questAlerts: true,
      healthWarning: true,
      worldUpdates: false,
    };
  });

  // Theme effect
  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Language effect
  useEffect(() => {
    try {
      localStorage.setItem("pref_language", language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Haptic effect
  useEffect(() => {
    try {
      localStorage.setItem("pref_haptic", String(haptic));
    } catch (e) {
      console.error(e);
    }
  }, [haptic]);

  // Scale effect (Interface scale)
  useEffect(() => {
    try {
      localStorage.setItem("pref_scale", String(scale));
      document.documentElement.style.zoom = (scale / 100).toString();
    } catch (e) {
      console.error(e);
    }
  }, [scale]);

  // Brightness effect
  useEffect(() => {
    try {
      localStorage.setItem("pref_brightness", String(brightness));
      // Brightness overlay opacity (ensure it never blocks user interaction or goes to absolute 0 opacity screen dimming)
      const clampedBrightness = Math.max(10, brightness);
      document.documentElement.style.setProperty(
        "--brightness-opacity",
        (1 - clampedBrightness / 100).toString(),
      );
    } catch (e) {
      console.error(e);
    }
  }, [brightness]);

  // Font size effect
  useEffect(() => {
    try {
      localStorage.setItem("pref_fontSize", String(fontSize));
      document.documentElement.style.fontSize = `${fontSize}px`;
    } catch (e) {
      console.error(e);
    }
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    triggerHaptic(60);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    triggerHaptic(50);
  };

  const setHaptic = (hapticVal: boolean) => {
    setHapticState(hapticVal);
    // Trigger vibration immediately to demonstrate feedback if turning on
    if (hapticVal) {
      if (
        typeof window !== "undefined" &&
        window.navigator &&
        window.navigator.vibrate
      ) {
        try {
          window.navigator.vibrate(60);
        } catch (e) {
          console.warn("Vibration failed:", e);
        }
      }
    }
  };

  const setScale = (scaleVal: number) => {
    setScaleState(scaleVal);
    triggerHaptic(20);
  };

  const setBrightness = (brightnessVal: number) => {
    setBrightnessState(brightnessVal);
    triggerHaptic(20);
  };

  const setFontSize = (fontSizeVal: number) => {
    setFontSizeState(fontSizeVal);
    triggerHaptic(20);
  };

  const setProtocols = (protocolsVal: ProtocolsType) => {
    setProtocolsState(protocolsVal);
    triggerHaptic(50);
    try {
      localStorage.setItem("pref_protocols", JSON.stringify(protocolsVal));
    } catch (e) {
      console.error(e);
    }
  };

  const triggerHaptic = (duration = 50) => {
    if (
      haptic &&
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      try {
        window.navigator.vibrate(duration);
      } catch (e) {
        console.warn("Haptic feedback error:", e);
      }
    }
  };

  const t = (key: string): string => {
    const langSet = translations[language] || translations["English (US)"];
    return langSet[key] || key;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        haptic,
        setHaptic,
        scale,
        setScale,
        brightness,
        setBrightness,
        fontSize,
        setFontSize,
        protocols,
        setProtocols,
        t,
        triggerHaptic,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme phải được đặt bên trong ThemeProvider");
  }
  return context;
};
