import { Plus, Table2 } from "lucide-react";

type WorkTableWelcomeProps = {
  creatingTable: boolean;
  roomId: string | null;
  saving: boolean;
  tableName: string;
  addTable: () => void | Promise<void>;
  setCreatingTable: (creating: boolean) => void;
  setTableName: (name: string) => void;
};

export function WorkTableWelcome({
  creatingTable,
  roomId,
  saving,
  tableName,
  addTable,
  setCreatingTable,
  setTableName,
}: WorkTableWelcomeProps) {
  return (
    <div className="workTableWelcome">
      <Table2 size={28} />
      <h3>最初のテーブルを作成してください</h3>
      <p>列を自由に追加して、タスクや不具合、議事録の項目を表として管理できます。</p>
      {creatingTable ? (
        <div className="workTableCreateInline">
          <input
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void addTable();
              }
              if (event.key === "Escape") {
                setCreatingTable(false);
                setTableName("");
              }
            }}
            placeholder="テーブル名"
            autoFocus
          />
          <div>
            <button type="button" onClick={() => void addTable()} disabled={saving || !tableName.trim()}>
              作成
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingTable(false);
                setTableName("");
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="workTableAddButton" onClick={() => setCreatingTable(true)} disabled={!roomId || saving}>
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
