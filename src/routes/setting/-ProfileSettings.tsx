import React, { useState, useEffect } from "react";
import { mascotAxolotl } from "../../features/users/constants/authImages";
import { useAuthStore } from "../../features/users/store/auth.store";
import { api } from "../../services/axiosClient";

interface ProfileSettingsProps {
  theme: "light" | "dark";
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ theme }) => {
  const { user, setAuth } = useAuthStore();
  const [systemName, setSystemName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setSystemName(user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!systemName.trim()) {
      setMessage({ text: "System Name cannot be empty.", isError: true });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.patch("/users/profile", {
        username: systemName.trim(),
        bio: bio.trim(),
      });
      const updatedUser = response.data;
      setAuth(null, null, updatedUser);
      setMessage({ text: "Profile updated successfully!", isError: false });
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: err?.response?.data?.message || "Failed to update profile",
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors relative ${
        theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Tiêu đề với icon User */}
      <h2 className="text-sm font-bold tracking-widest uppercase text-[#76d6d5] flex items-center gap-2">
        👤 Profile Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Khu vực Avatar chuẩn khung viền game */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            {/* Khung viền Squircle bo bầu độc đáo theo đúng ảnh chụp */}
            <div
              className={`w-[74px] h-[84px] rounded-[28px] border-2 p-2 flex items-center justify-center transition-colors ${
                theme === "dark"
                  ? "border-[#1c3242] bg-[#040d14]"
                  : "border-slate-300 bg-slate-100"
              }`}
            >
              <img
                src={mascotAxolotl}
                alt="Axo-Script Avatar"
                className="w-12 h-12 object-contain"
              />
            </div>
            <button
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                theme === "dark"
                  ? "bg-[#142533] hover:bg-[#1c3245] text-slate-300 border-[#223a4d]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              }`}
            >
              Update
              <br />
              Hash
            </button>
          </div>
        </div>

        {/* Cột phải: Textarea mô tả tiểu sử */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            Bio / Kernel Description
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={saving}
            className={`w-full h-[84px] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#76d6d5] resize-none transition-all ${
              theme === "dark"
                ? "bg-[#040d14] border-[#14232e] text-slate-300"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          />
        </div>
      </div>

      {/* Hàng dưới cùng: System Name & Nút Save Changes */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pt-2">
        <div className="w-full md:w-[45%] space-y-2">
          <label className="text-xs text-on-surface-variant font-medium block">
            System Name
          </label>
          <input
            type="text"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            disabled={saving}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#76d6d5] transition-all ${
              theme === "dark"
                ? "bg-[#040d14] border-[#14232e] text-slate-300"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          />
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          {message && (
            <p
              className={`text-[12px] font-semibold ${message.isError ? "text-red-400" : "text-green-400"}`}
            >
              {message.text}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto px-6 py-2.5 bg-[#7fe3dd] hover:bg-[#6bd2cc] text-[#040d14] text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(127,227,221,0.2)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed md:mt-0 mt-2"
          >
            {saving ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
