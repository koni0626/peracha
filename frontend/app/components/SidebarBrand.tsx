import { apiUrl } from "../api";
import type { User } from "../types";

export function SidebarBrand({ currentUser }: { currentUser: User }) {
  return (
    <div className="brandBlock">
      <span className="brandMark">
        {currentUser.avatar_url ? <img src={apiUrl(currentUser.avatar_url)} alt={currentUser.name} /> : "ペ"}
      </span>
      <div>
        <strong>ペラチャ</strong>
        <small>Powered by BLAS</small>
      </div>
    </div>
  );
}
