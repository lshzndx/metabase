import React, { useState, useCallback, useEffect } from "react";
import _ from "underscore";
import { usePrevious } from "metabase/hooks/use-previous";
import { TreeNodeList } from "./TreeNodeListDL";
import { TreeNode as DefaultTreeNode } from "./TreeNode";
import { getInitialExpandedIds } from "./utils";
import { ITreeNodeItem, TreeNodeComponent } from "./types";
import { User } from "metabase-types/api";

interface TreeProps {
  data: ITreeNodeItem[];
  selectedId?: ITreeNodeItem["id"];
  role?: string;
  emptyState?: React.ReactNode;
  onSelect?: (item: ITreeNodeItem) => void;
  TreeNode?: TreeNodeComponent;
  currentUser: User;
  handleCreateNewCollection: () => void;
  handleCreateNewDashboard: () => void;
}

function BaseTree({
  data,
  selectedId,
  role = "menu",
  emptyState = null,
  onSelect,
  TreeNode = DefaultTreeNode,
  currentUser,
  handleCreateNewCollection,
  handleCreateNewDashboard,
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useState(
    new Set(selectedId != null ? getInitialExpandedIds(selectedId, data) : []),
  );
  const previousSelectedId = usePrevious(selectedId);
  const prevData = usePrevious(data);

  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const selectedItemChanged =
      previousSelectedId !== selectedId && !expandedIds.has(selectedId);
    if (selectedItemChanged || !_.isEqual(data, prevData)) {
      setExpandedIds(
        prev => new Set([...prev, ...getInitialExpandedIds(selectedId, data)]),
      );
    }
  }, [prevData, data, selectedId, previousSelectedId, expandedIds]);

  const handleToggleExpand = useCallback(
    itemId => {
      if (expandedIds.has(itemId)) {
        setExpandedIds(prev => new Set([...prev].filter(id => id !== itemId)));
      } else {
        setExpandedIds(prev => new Set([...prev, itemId]));
      }
    },
    [expandedIds],
  );

  if (data.length === 0) {
    return <React.Fragment>{emptyState}</React.Fragment>;
  }

  return (
    <TreeNodeList
      items={data}
      role={role}
      TreeNode={TreeNode}
      expandedIds={expandedIds}
      selectedId={selectedId}
      depth={0}
      onSelect={onSelect}
      onToggleExpand={handleToggleExpand}
      currentUser={currentUser}
      handleCreateNewCollection={handleCreateNewCollection}
      handleCreateNewDashboard={handleCreateNewDashboard}
    />
  );
}

export const Tree = Object.assign(BaseTree, {
  Node: DefaultTreeNode,
});
