import { FileText, FolderOpen } from "lucide-react";

type RoomFilePreviewNoticeProps = {
  body?: string;
  icon?: "file" | "folder";
  title: string;
};

export function RoomFilePreviewNotice({ body, icon = "file", title }: RoomFilePreviewNoticeProps) {
  const Icon = icon === "folder" ? FolderOpen : FileText;

  return (
    <div className="officePreviewNotice">
      <Icon size={36} />
      <strong>{title}</strong>
      {body ? <p>{body}</p> : null}
    </div>
  );
}
