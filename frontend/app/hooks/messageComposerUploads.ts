import type { Attachment, RoomFile } from "../types";
import { roomFileToAttachment } from "./messageComposerPayload";

type UploadRoomFile = (file: File, roomId?: string | null) => Promise<RoomFile>;
type LoadRoomFiles = (roomId?: string | null) => Promise<void>;

export async function uploadFilesAsAttachments(files: File[], roomId: string, uploadRoomFile: UploadRoomFile): Promise<Attachment[]> {
  const attachments: Attachment[] = [];
  for (const file of files) {
    attachments.push(roomFileToAttachment(await uploadRoomFile(file, roomId)));
  }
  return attachments;
}

export async function uploadInlineFileAttachment(
  file: File,
  roomId: string | null,
  uploadRoomFile: UploadRoomFile,
  loadRoomFiles: LoadRoomFiles
) {
  if (!roomId) {
    throw new Error("ルームが選択されていません");
  }
  const uploaded = await uploadRoomFile(file, roomId);
  await loadRoomFiles(roomId);
  return {
    title: uploaded.original_name,
    url: uploaded.download_url,
    content_type: uploaded.content_type,
  };
}
