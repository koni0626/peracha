import { OfficePreviewNotice, SlidePreview, SpreadsheetPreview, WordPreview } from "./OfficePreviewViews";
import type { OfficePreviewKind } from "./officePreviewLoader";
import { useOfficeDocumentPreview } from "./useOfficeDocumentPreview";

type OfficeDocumentPreviewProps = {
  kind: OfficePreviewKind;
  title: string;
  url: string | null;
  onError: (message: string) => void;
};

export function OfficeDocumentPreview({ kind, title, url, onError }: OfficeDocumentPreviewProps) {
  const { activeRows, activeSheet, docHtml, loading, setActiveSheet, slides, workbook } = useOfficeDocumentPreview({
    kind,
    onError,
    url,
  });

  if (loading) {
    return <OfficePreviewNotice title={`${title} を読み込み中です。`} />;
  }

  if (kind === "xlsx" && workbook) {
    return (
      <SpreadsheetPreview
        activeSheet={activeSheet}
        rows={activeRows}
        sheetNames={workbook.sheetNames}
        setActiveSheet={setActiveSheet}
      />
    );
  }

  if (kind === "docx" && docHtml) {
    return <WordPreview html={docHtml} />;
  }

  if (kind === "pptx" && slides.length > 0) {
    return <SlidePreview slides={slides} />;
  }

  return (
    <OfficePreviewNotice title="プレビューできる内容が見つかりませんでした。">
      <p>ダウンロードして確認してください。</p>
    </OfficePreviewNotice>
  );
}
