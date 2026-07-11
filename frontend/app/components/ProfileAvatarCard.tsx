import { useState } from "react";
import type { DragEvent } from "react";
import { ImagePlus, UserRound } from "lucide-react";

import { apiUrl } from "../api";
import type { User } from "../types";

type ProfileAvatarCardProps = {
  currentUser: User;
  onUploadAvatar: (file: File) => void | Promise<void>;
};

export function ProfileAvatarCard({ currentUser, onUploadAvatar }: ProfileAvatarCardProps) {
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragActive(event.type !== "dragleave");
  }

  async function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("image/"));
    if (file) {
      await onUploadAvatar(file);
    }
  }

  return (
    <section
      className={`homeActionCard profileCard ${dragActive ? "isDragActive" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div>
        <h2>顔アイコン</h2>
        <p>画像をドラッグ&ドロップするか、ファイルを選んで顔アイコンを登録できます。</p>
      </div>
      <div className="profilePreview">
        <span className="profileAvatar">
          {currentUser.avatar_url ? <img src={apiUrl(currentUser.avatar_url)} alt={currentUser.name} /> : <UserRound size={26} />}
        </span>
        <div>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
        </div>
      </div>
      <label className="homeUploadButton">
        <ImagePlus size={17} />
        顔アイコンを選ぶ
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUploadAvatar(file);
            }
            event.target.value = "";
          }}
        />
      </label>
    </section>
  );
}
