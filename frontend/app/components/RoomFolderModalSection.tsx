import { RoomFolderModal } from "./RoomFolderModal";
import type { RoomModalsProps } from "./roomModalsTypes";

type RoomFolderModalSectionProps = Pick<
  RoomModalsProps,
  | "activeRoom"
  | "filePreviewError"
  | "filePreviewUrl"
  | "files"
  | "roomFolderOpen"
  | "selectedFile"
  | "onCloseFolder"
  | "onPreviewLoadError"
  | "onRefreshFiles"
  | "onSelectFile"
>;

export function RoomFolderModalSection({
  activeRoom,
  filePreviewError,
  filePreviewUrl,
  files,
  roomFolderOpen,
  selectedFile,
  onCloseFolder,
  onPreviewLoadError,
  onRefreshFiles,
  onSelectFile,
}: RoomFolderModalSectionProps) {
  if (!roomFolderOpen || !activeRoom) {
    return null;
  }

  return (
    <RoomFolderModal
      room={activeRoom}
      files={files}
      selectedFile={selectedFile}
      filePreviewError={filePreviewError}
      filePreviewUrl={filePreviewUrl}
      onClose={onCloseFolder}
      onPreviewLoadError={onPreviewLoadError}
      onRefresh={onRefreshFiles}
      onSelectFile={onSelectFile}
    />
  );
}
