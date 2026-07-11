import { RoomEditModal } from "./RoomEditModal";
import { selectRoomEditModalProps, type RoomEditModalSectionProps } from "./roomEditModalSelectors";

export function RoomEditModalSection(props: RoomEditModalSectionProps) {
  const modalProps = selectRoomEditModalProps(props);

  if (!modalProps) {
    return null;
  }

  return <RoomEditModal {...modalProps} />;
}
