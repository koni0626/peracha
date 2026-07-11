import { FileText, Plus } from "lucide-react";

type WikiEmptyStateProps = {
  canCreate: boolean;
  saving: boolean;
  onCreate: () => void;
};

export function WikiEmptyState({ canCreate, saving, onCreate }: WikiEmptyStateProps) {
  return (
    <div className="wikiEmptyState">
      <FileText size={30} />
      <h2>ノートを作成してください</h2>
      <p>Markdownで手順、仕様、議事メモなどを残せます。</p>
      <button type="button" onClick={onCreate} disabled={!canCreate || saving}>
        <Plus size={16} />
        ノートを作成
      </button>
    </div>
  );
}
