import type { FormEvent } from "react";
import { FolderOpen } from "lucide-react";

import type { RelatedContext, Room, RoomMember } from "../types";
import { HeaderContextSearch } from "./HeaderContextSearch";
import { RoomMemberAvatars } from "./RoomMemberAvatars";

type ChatRoomHeaderProps = {
  activeRoom: Room;
  activeRoomId: string | null;
  contextSearch: {
    loading: boolean;
    query: string;
    results: RelatedContext[];
    search: (event?: FormEvent<HTMLFormElement>) => void;
    setQuery: (value: string) => void;
  };
  members: RoomMember[];
  onOpenFolder: (roomId: string) => void | Promise<void>;
  onOpenRoomEditor: (roomId: string) => void | Promise<void>;
};

export function ChatRoomHeader({
  activeRoom,
  activeRoomId,
  contextSearch,
  members,
  onOpenFolder,
  onOpenRoomEditor,
}: ChatRoomHeaderProps) {
  function openRoomEditor() {
    if (activeRoomId) {
      return onOpenRoomEditor(activeRoomId);
    }
  }

  return (
    <header className="chatHeader">
      <div className="chatHeaderTitle">
        <h1>{activeRoom.name}</h1>
        <p>{activeRoom.description ?? "参加中のルームを選択してください"}</p>
      </div>
      <RoomMemberAvatars members={members} onAddMember={openRoomEditor} />
      <HeaderContextSearch
        activeRoomId={activeRoomId}
        contextQuery={contextSearch.query}
        contextResults={contextSearch.results}
        contextLoading={contextSearch.loading}
        setContextQuery={contextSearch.setQuery}
        searchContexts={contextSearch.search}
      />
      <div className="chatHeaderActions">
        <button
          type="button"
          onClick={() => activeRoomId && onOpenFolder(activeRoomId)}
          title="フォルダを開く"
        >
          <FolderOpen size={17} />
        </button>
      </div>
    </header>
  );
}
