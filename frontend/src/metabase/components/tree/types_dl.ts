import React from "react";
import { IconProps } from "../Icon";
import { User } from "metabase-types/api";

export interface ITreeNodeItem {
  id: string | number;
  name: string;
  icon: string | IconProps;
  children?: ITreeNodeItem[];
}

export interface TreeNodeDLProps {
  item: ITreeNodeItem;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  onSelect?: () => void;
  onToggleExpand: () => void;
  currentUser: User;
  handleCreateNewCollection: () => void;
  handleCreateNewDashboard: () => void;
}
