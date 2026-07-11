import { uploadFileToRoom } from "./roomFilesApi";

export async function uploadFilesToRoom(roomId: string, files: File[]) {
  const uploadedFiles = [];
  for (const file of files) {
    uploadedFiles.push(await uploadFileToRoom(roomId, file));
  }
  return uploadedFiles;
}

export function imageColumnRejectMessage(fieldType: string, file: File) {
  return fieldType === "image" && !file.type.startsWith("image/")
    ? "画像列には画像ファイルをアップロードしてください。"
    : null;
}
