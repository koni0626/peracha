"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Message, Room, User } from "../types";
import { browserNotificationPayload, shouldSkipBrowserNotification } from "./browserNotificationPayload";

type UseBrowserNotificationsOptions = {
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  user: User | null;
};

export function useBrowserNotifications({
  setActiveRoomId,
  setChatNotice,
  user,
}: UseBrowserNotificationsOptions) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const showBrowserNotification = useCallback((room: Room, message: Message, isMention: boolean) => {
    if (shouldSkipBrowserNotification(message, user)) {
      return;
    }
    if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") {
      return;
    }
    const payload = browserNotificationPayload(room, message, isMention);
    const notification = new Notification(payload.title, { body: payload.body, tag: payload.tag });
    notification.onclick = () => {
      window.focus();
      setActiveRoomId(room.id);
      notification.close();
    };
  }, [setActiveRoomId, user]);

  const requestNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setChatNotice("このブラウザは通知に対応していません");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setChatNotice(permission === "granted" ? "通知を有効にしました" : "通知は許可されませんでした");
  }, [setChatNotice]);

  return { notificationPermission, requestNotifications, showBrowserNotification };
}
