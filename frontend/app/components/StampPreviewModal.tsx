import { Trash2, X } from "lucide-react";

import { apiUrl } from "../api";
import type { Stamp } from "../types";

type StampPreviewModalProps = {
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void | Promise<void>;
  stamp: Stamp;
};

export function StampPreviewModal({ deleting, onClose, onDelete, stamp }: StampPreviewModalProps) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="stampPreviewTitle">
      <section className="stampPreviewModal">
        <header>
          <div>
            <p className="eyebrow">Stamp</p>
            <h2 id="stampPreviewTitle">{stamp.title}</h2>
          </div>
          <button type="button" className="iconButton" title="閉じる" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="stampPreviewImageWrap">
          <img src={apiUrl(stamp.image_url)} alt={stamp.title} />
        </div>
        <footer>
          <button type="button" className="dangerButton" disabled={deleting} onClick={onDelete}>
            <Trash2 size={17} />
            {deleting ? "削除中" : "削除"}
          </button>
        </footer>
      </section>
    </div>
  );
}
