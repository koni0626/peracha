import { useEffect, useMemo, useState } from "react";

import type { PptSlidePreview, WorkbookPreview } from "./officePreviewParsers";
import { loadOfficePreview } from "./officePreviewLoader";
import type { OfficePreviewKind } from "./officePreviewLoader";

type UseOfficeDocumentPreviewOptions = {
  kind: OfficePreviewKind;
  onError: (message: string) => void;
  url: string | null;
};

export function useOfficeDocumentPreview({ kind, onError, url }: UseOfficeDocumentPreviewOptions) {
  const [loading, setLoading] = useState(false);
  const [workbook, setWorkbook] = useState<WorkbookPreview | null>(null);
  const [activeSheet, setActiveSheet] = useState("");
  const [docHtml, setDocHtml] = useState("");
  const [slides, setSlides] = useState<PptSlidePreview[]>([]);

  useEffect(() => {
    setWorkbook(null);
    setActiveSheet("");
    setDocHtml("");
    setSlides([]);
    if (!url) {
      return;
    }
    let disposed = false;
    setLoading(true);
    loadOfficePreview(kind, url)
      .then((preview) => {
        if (disposed) {
          return;
        }
        if (preview.kind === "xlsx") {
          setWorkbook(preview.workbook);
          setActiveSheet(preview.workbook.sheetNames[0] ?? "");
        } else if (preview.kind === "docx") {
          setDocHtml(preview.html);
        } else {
          setSlides(preview.slides);
        }
      })
      .catch(() => {
        if (!disposed) {
          onError("Officeプレビューを読み込めませんでした。");
        }
      })
      .finally(() => {
        if (!disposed) {
          setLoading(false);
        }
      });
    return () => {
      disposed = true;
    };
  }, [kind, onError, url]);

  const activeRows = useMemo(() => workbook?.sheets[activeSheet] ?? [], [activeSheet, workbook]);

  return {
    activeRows,
    activeSheet,
    docHtml,
    loading,
    setActiveSheet,
    slides,
    workbook,
  };
}
