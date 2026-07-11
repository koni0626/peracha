import type { ReactNode } from "react";
import { FileText } from "lucide-react";

type OfficePreviewNoticeProps = {
  children?: ReactNode;
  title: string;
};

export function OfficePreviewNotice({ children, title }: OfficePreviewNoticeProps) {
  return (
    <div className="officePreviewNotice">
      <FileText size={36} />
      <strong>{title}</strong>
      {children}
    </div>
  );
}
