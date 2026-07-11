import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Room, Stamp, StampFolder, Task, User } from "../types";

export type HomeScreenProps = {
  notices: {
    chatNotice: string | null;
    error: string | null;
  };
  profile: {
    currentUser: User;
    onUploadAvatar: (file: File) => void | Promise<void>;
  };
  roomActions: {
    acceptToken: string;
    newRoomName: string;
    onAcceptInvitation: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
    onCreateRoom: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
    setAcceptToken: (token: string) => void;
    setNewRoomName: (name: string) => void;
  };
  roomOps: {
    homeRoomId: string | null;
    onLoadTasks: (roomId?: string | null) => void | Promise<void>;
    onSaveTaskProgress: (event: FormEvent<HTMLFormElement>, taskId: string) => void;
    onUpdateTask: (taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) => void | Promise<void>;
    rooms: Room[];
    setError: (message: string | null) => void;
    setHomeRoomId: (roomId: string | null) => void;
    setTaskNotes: Dispatch<SetStateAction<Record<string, string>>>;
    taskNotes: Record<string, string>;
    tasks: Task[];
  };
  stampManagement: {
    onDeleteStamp: (stampId: string) => void | Promise<void>;
    onCreateStampFolder: (name: string) => void | Promise<void>;
    onDeleteStampFolder: (folderId: string) => void | Promise<void>;
    onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
    selectedUploadFolderId: string | null;
    setSelectedUploadFolderId: (folderId: string | null) => void;
    stampFolders: StampFolder[];
    stamps: Stamp[];
    stampUploading: boolean;
  };
};
