import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { WorkTable } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { pickCurrentOrFirstWorkTableId } from "./workTableListUtils";
import { fetchRoomWorkTables } from "./workTablesApi";

type UseWorkTableRoomDataOptions = {
  roomId: string | null;
  setActiveTableId: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export function useWorkTableRoomData({
  roomId,
  setActiveTableId,
  setError,
  setTables,
}: UseWorkTableRoomDataOptions) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setTables([]);
      setActiveTableId(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchRoomWorkTables(roomId)
      .then((data) => {
        setTables(data.items);
        setActiveTableId((current) => pickCurrentOrFirstWorkTableId(data.items, current));
      })
      .catch((err) => setError(getErrorMessage(err, "テーブルを読み込めませんでした")))
      .finally(() => setLoading(false));
  }, [roomId, setActiveTableId, setError, setTables]);

  return { loading };
}
