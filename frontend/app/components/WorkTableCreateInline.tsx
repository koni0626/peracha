type WorkTableCreateInlineProps = {
  saving: boolean;
  tableName: string;
  addTable: () => void | Promise<void>;
  setCreatingTable: (creating: boolean) => void;
  setTableName: (name: string) => void;
};

export function WorkTableCreateInline({
  saving,
  tableName,
  addTable,
  setCreatingTable,
  setTableName,
}: WorkTableCreateInlineProps) {
  function cancelCreate() {
    setCreatingTable(false);
    setTableName("");
  }

  return (
    <div className="workTableCreateInline">
      <input
        value={tableName}
        onChange={(event) => setTableName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            void addTable();
          }
          if (event.key === "Escape") {
            cancelCreate();
          }
        }}
        placeholder="テーブル名"
        autoFocus
      />
      <div>
        <button type="button" onClick={() => void addTable()} disabled={saving || !tableName.trim()}>
          作成
        </button>
        <button type="button" onClick={cancelCreate}>
          キャンセル
        </button>
      </div>
    </div>
  );
}
