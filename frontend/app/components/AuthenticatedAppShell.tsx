import type { ComponentProps } from "react";

import { ChatRoomView } from "./ChatRoomView";
import { HomeScreen } from "./HomeScreen";
import { RoomModals } from "./RoomModals";
import { Sidebar } from "./Sidebar";
import type { Room } from "../types";

type AuthenticatedAppShellProps = {
  activeRoom: Room | null;
  chat: ComponentProps<typeof ChatRoomView> | null;
  home: ComponentProps<typeof HomeScreen>;
  modals: ComponentProps<typeof RoomModals>;
  sidebar: ComponentProps<typeof Sidebar>;
};

export function AuthenticatedAppShell({ activeRoom, chat, home, modals, sidebar }: AuthenticatedAppShellProps) {
  return (
    <main className={activeRoom ? "appShell" : "appShell homeMode"}>
      <Sidebar {...sidebar} />
      <RoomModals {...modals} />
      {activeRoom && chat ? <ChatRoomView {...chat} /> : <HomeScreen {...home} />}
    </main>
  );
}
