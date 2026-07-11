import { apiUrl } from "../api";

type MessageAvatarProps = {
  avatarUrl: string | null;
  senderName: string | null;
};

export function MessageAvatar({ avatarUrl, senderName }: MessageAvatarProps) {
  return (
    <div className={avatarUrl ? "avatar hasImage" : "avatar"}>
      {avatarUrl ? (
        <img src={apiUrl(avatarUrl)} alt={senderName ?? "avatar"} />
      ) : (
        (senderName ?? "?").slice(0, 1)
      )}
    </div>
  );
}
