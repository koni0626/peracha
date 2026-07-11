import { Bell, LogOut } from "lucide-react";

type SidebarAccountActionsProps = {
  notificationPermission: NotificationPermission;
  onLogout: () => void | Promise<void>;
  onRequestNotifications: () => void | Promise<void>;
};

export function SidebarAccountActions({
  notificationPermission,
  onLogout,
  onRequestNotifications,
}: SidebarAccountActionsProps) {
  return (
    <>
      <button className="logoutButton" type="button" onClick={onLogout} title="ログアウト">
        <LogOut size={16} />
        ログアウト
      </button>
      {typeof window !== "undefined" && "Notification" in window && notificationPermission !== "granted" ? (
        <button className="notificationButton" type="button" onClick={onRequestNotifications}>
          <Bell size={16} />
          通知を有効化
        </button>
      ) : null}
    </>
  );
}
