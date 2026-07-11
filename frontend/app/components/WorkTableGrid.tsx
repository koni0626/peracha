import { WorkTableGridBody } from "./WorkTableGridBody";
import { WorkTableGridHeader } from "./WorkTableGridHeader";
import { WorkTableGridMenus } from "./WorkTableGridMenus";
import {
  selectWorkTableGridBodyProps,
  selectWorkTableGridHeaderProps,
  selectWorkTableGridMenuProps,
} from "./workTableGridPropSelectors";
import type { WorkTableGridProps } from "./workTableGridTypes";

export function WorkTableGrid(props: WorkTableGridProps) {
  return (
    <div className="workTableMain">
      <div className="workTableGridWrap">
        <table className="workTableGrid">
          <WorkTableGridHeader {...selectWorkTableGridHeaderProps(props)} />
          <WorkTableGridBody {...selectWorkTableGridBodyProps(props)} />
        </table>
        <WorkTableGridMenus {...selectWorkTableGridMenuProps(props)} />
      </div>
    </div>
  );
}
