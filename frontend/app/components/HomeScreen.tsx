import { HomeIntro } from "./HomeIntro";
import { HomeRoomActions } from "./HomeRoomActions";
import { HomeRoomOps } from "./HomeRoomOps";
import type { HomeScreenProps } from "./homeScreenTypes";
import { ProfileAvatarCard } from "./ProfileAvatarCard";
import { StampManagementCard } from "./StampManagementCard";

export function HomeScreen({ notices, profile, roomActions, roomOps, stampManagement }: HomeScreenProps) {
  return (
    <section className="homeColumn">
      <div className="homePanel">
        <HomeIntro />

        <HomeRoomActions
          newRoomName={roomActions.newRoomName}
          acceptToken={roomActions.acceptToken}
          setNewRoomName={roomActions.setNewRoomName}
          setAcceptToken={roomActions.setAcceptToken}
          onCreateRoom={roomActions.onCreateRoom}
          onAcceptInvitation={roomActions.onAcceptInvitation}
        />

        <div className="homeActions">
          <ProfileAvatarCard currentUser={profile.currentUser} onUploadAvatar={profile.onUploadAvatar} />
          <StampManagementCard
            stamps={stampManagement.stamps}
            stampFolders={stampManagement.stampFolders}
            selectedUploadFolderId={stampManagement.selectedUploadFolderId}
            stampUploading={stampManagement.stampUploading}
            setSelectedUploadFolderId={stampManagement.setSelectedUploadFolderId}
            onCreateStampFolder={stampManagement.onCreateStampFolder}
            onDeleteStampFolder={stampManagement.onDeleteStampFolder}
            onUploadStampImage={stampManagement.onUploadStampImage}
            onDeleteStamp={stampManagement.onDeleteStamp}
          />
        </div>

        <HomeRoomOps
          rooms={roomOps.rooms}
          homeRoomId={roomOps.homeRoomId}
          tasks={roomOps.tasks}
          taskNotes={roomOps.taskNotes}
          setError={roomOps.setError}
          setHomeRoomId={roomOps.setHomeRoomId}
          setTaskNotes={roomOps.setTaskNotes}
          onLoadTasks={roomOps.onLoadTasks}
          onUpdateTask={roomOps.onUpdateTask}
          onSaveTaskProgress={roomOps.onSaveTaskProgress}
        />

        {notices.chatNotice ? <p className="footerNotice">{notices.chatNotice}</p> : null}
        {notices.error ? <p className="footerError">{notices.error}</p> : null}
      </div>
    </section>
  );
}
