import type { ReactNode } from "react";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PanelTop,
  Quote,
  TableColumnsSplit,
  TableRowsSplit,
  X,
} from "lucide-react";

export type TableEditAction = "column-left" | "column-right" | "column-delete" | "row-above" | "row-below" | "row-delete";

type CommandButton = {
  command: string;
  commandValue?: string;
  icon: ReactNode;
  title: string;
};

type TableButton = {
  action: TableEditAction;
  danger?: boolean;
  icon: ReactNode;
  title: string;
};

export const commandButtons: CommandButton[] = [
  { command: "formatBlock", commandValue: "H1", icon: <Heading1 size={15} />, title: "見出し 1" },
  { command: "formatBlock", commandValue: "H2", icon: <Heading2 size={15} />, title: "見出し 2" },
  { command: "bold", icon: <Bold size={15} />, title: "太字" },
  { command: "italic", icon: <Italic size={15} />, title: "斜体" },
  { command: "insertUnorderedList", icon: <List size={15} />, title: "箇条書き" },
  { command: "insertOrderedList", icon: <ListOrdered size={15} />, title: "番号付きリスト" },
  { command: "formatBlock", commandValue: "BLOCKQUOTE", icon: <Quote size={15} />, title: "引用" },
  { command: "formatBlock", commandValue: "PRE", icon: <Code2 size={15} />, title: "コード" },
];

export const tableButtons: TableButton[] = [
  { action: "column-left", icon: <PanelLeft size={15} />, title: "左に列を追加" },
  { action: "column-right", icon: <PanelRight size={15} />, title: "右に列を追加" },
  {
    action: "column-delete",
    danger: true,
    icon: (
      <span className="tableDeleteIcon">
        <TableColumnsSplit size={15} />
        <X size={10} />
      </span>
    ),
    title: "列を削除",
  },
  { action: "row-above", icon: <PanelTop size={15} />, title: "上に行を追加" },
  { action: "row-below", icon: <PanelBottom size={15} />, title: "下に行を追加" },
  {
    action: "row-delete",
    danger: true,
    icon: (
      <span className="tableDeleteIcon">
        <TableRowsSplit size={15} />
        <X size={10} />
      </span>
    ),
    title: "行を削除",
  },
];
