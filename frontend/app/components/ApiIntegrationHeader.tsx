import { RefreshCw } from "lucide-react";

type ApiIntegrationHeaderProps = {
  activeRoomId: string | null;
  onLoadApiClients: () => void;
};

export function ApiIntegrationHeader({ activeRoomId, onLoadApiClients }: ApiIntegrationHeaderProps) {
  return (
    <>
      <p className="eyebrow">External API</p>
      <div className="sectionTitleRow">
        <h2>API連携</h2>
        <button type="button" onClick={onLoadApiClients} disabled={!activeRoomId} title="APIクライアントを取得">
          <RefreshCw size={16} />
        </button>
      </div>
    </>
  );
}
