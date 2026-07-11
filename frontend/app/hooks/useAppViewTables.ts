import { useEffect, useState } from "react";

import type { WorkTable } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { pickCurrentOrFirstWorkTableId } from "./workTableListUtils";
import { fetchRoomWorkTables } from "./workTablesApi";

export function useAppViewTables(roomId: string | null) {
  const [tables, setTables] = useState<WorkTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setTables([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchRoomWorkTables(roomId)
      .then((data) => {
        setTables(data.items);
        setSelectedTableId((current) => pickCurrentOrFirstWorkTableId(data.items, current) ?? "");
      })
      .catch((err) => setError(getErrorMessage(err, "テーブルを読み込めませんでした")))
      .finally(() => setLoading(false));
  }, [roomId]);

  return {
    error,
    loading,
    selectedTableId,
    setError,
    setSelectedTableId,
    setTables,
    tables,
  };
}
