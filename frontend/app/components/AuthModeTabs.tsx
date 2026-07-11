import { LogIn, UserPlus } from "lucide-react";

type AuthModeTabsProps = {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
};

export function AuthModeTabs({ authMode, setAuthMode }: AuthModeTabsProps) {
  return (
    <div className="segmented" aria-label="auth mode">
      <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
        <UserPlus size={16} />
        登録
      </button>
      <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
        <LogIn size={16} />
        ログイン
      </button>
    </div>
  );
}
