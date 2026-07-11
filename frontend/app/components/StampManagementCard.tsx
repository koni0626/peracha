import { StampExplorer } from "./StampExplorer";
import { StampPreviewModal } from "./StampPreviewModal";
import type { Stamp, StampFolder } from "../types";
import { useStampManagementCard } from "./useStampManagementCard";

type StampManagementCardProps = {
  selectedUploadFolderId: string | null;
  stampFolders: StampFolder[];
  stamps: Stamp[];
  stampUploading: boolean;
  setSelectedUploadFolderId: (folderId: string | null) => void;
  onCreateStampFolder: (name: string) => void | Promise<void>;
  onDeleteStamp: (stampId: string) => void | Promise<void>;
  onDeleteStampFolder: (folderId: string) => void | Promise<void>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
};

export function StampManagementCard({
  selectedUploadFolderId,
  stampFolders,
  stamps,
  stampUploading,
  setSelectedUploadFolderId,
  onCreateStampFolder,
  onDeleteStamp,
  onDeleteStampFolder,
  onUploadStampImage,
}: StampManagementCardProps) {
  const { deletingStampId, deletePreviewStamp, previewStamp, setPreviewStamp, uploadFiles } = useStampManagementCard({
    onDeleteStamp,
    onUploadStampImage,
  });

  return (
    <>
      <section className="homeActionCard stampHomeCard">
        <div>
          <h2>スタンプ登録</h2>
          <p>右クリックでフォルダやファイルを管理し、画像はドラッグ&ドロップで追加できます。</p>
        </div>
        <StampExplorer
          activeFolderId={selectedUploadFolderId}
          mode="manage"
          stampFolders={stampFolders}
          stamps={stamps}
          uploading={stampUploading}
          onCreateFolder={onCreateStampFolder}
          onDeleteFolder={onDeleteStampFolder}
          onDeleteStamp={onDeleteStamp}
          onOpenStamp={setPreviewStamp}
          onSelectFolder={setSelectedUploadFolderId}
          onUploadFiles={uploadFiles}
        />
      </section>

      {previewStamp ? (
        <StampPreviewModal
          deleting={deletingStampId === previewStamp.id}
          onClose={() => setPreviewStamp(null)}
          onDelete={deletePreviewStamp}
          stamp={previewStamp}
        />
      ) : null}
    </>
  );
}
