import React, { useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { t } from "ttag";
import _ from "underscore";

import { Collection } from "metabase-types/api";

import { TreeNode } from "metabase/components/tree/TreeNode";
// import { TreeNodeProps } from "metabase/components/tree/types";
import { TreeNodeDLProps } from "metabase/components/tree/types_dl";

import CollectionDropTarget from "metabase/containers/dnd/CollectionDropTarget";
import { usePrevious } from "metabase/hooks/use-previous";

import { PLUGIN_COLLECTIONS } from "metabase/plugins";
import {
  getCollectionIcon,
  PERSONAL_COLLECTIONS,
} from "metabase/entities/collections";
import * as Urls from "metabase/lib/urls";

import {
  CollectionNodeRoot,
  ExpandToggleButton,
  FullWidthLink,
  NameContainer,
  SidebarIcon,
} from "./SidebarItems.styled";

import {
  CollectionMenuList,
  CollectionsMoreIcon,
  CollectionsMoreIconContainer,
} from "metabase/nav/containers/MainNavbar/MainNavbar.styled";

import TippyPopoverWithTrigger from "metabase/components/PopoverWithTrigger/TippyPopoverWithTrigger";

import { SidebarLink } from "./index";

const BROWSE_URL = "/browse";
const OTHER_USERS_COLLECTIONS_URL = Urls.otherUsersPersonalCollections();
const ARCHIVE_URL = "/archive";
const ADD_YOUR_OWN_DATA_URL = "/admin/databases/create";

type DroppableProps = {
  hovered: boolean;
  highlighted: boolean;
};

type Props = DroppableProps &
  Omit<TreeNodeDLProps, "item"> & {
    collection: Collection;
  };

const TIME_BEFORE_EXPANDING_ON_HOVER = 600;

const SidebarCollectionLink = React.forwardRef<HTMLLIElement, Props>(
  function SidebarCollectionLink(
    {
      collection,
      hovered: isHovered,
      depth,
      onSelect,
      isExpanded,
      isSelected,
      hasChildren,
      onToggleExpand,
      currentUser,
      handleCreateNewCollection,
      handleCreateNewDashboard,
    }: Props,
    ref,
  ) {
    const wasHovered = usePrevious(isHovered);
    const timeoutId = useRef<any>(null);

    useEffect(() => {
      const justHovered = !wasHovered && isHovered;

      if (justHovered && !isExpanded) {
        timeoutId.current = setTimeout(() => {
          if (isHovered) {
            onToggleExpand();
          }
        }, TIME_BEFORE_EXPANDING_ON_HOVER);
      }

      return () => clearTimeout(timeoutId.current);
    }, [wasHovered, isHovered, isExpanded, onToggleExpand]);

    const url = Urls.collection(collection);

    const onKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!hasChildren) {
          return;
        }
        switch (event.key) {
          case "ArrowRight":
            !isExpanded && onToggleExpand();
            break;
          case "ArrowLeft":
            isExpanded && onToggleExpand();
            break;
        }
      },
      [isExpanded, hasChildren, onToggleExpand],
    );

    const icon = getCollectionIcon(collection);
    const isRegularCollection = PLUGIN_COLLECTIONS.isRegularCollection(
      collection as unknown as Collection,
    );

    const renderMenu = useCallback(
      ({ closePopover }) => (
        <CollectionMenuList>
          <SidebarLink
            icon="add"
            onClick={() => {
              closePopover();
              handleCreateNewCollection();
            }}
          >
            {t`New collection`}
          </SidebarLink>
          <SidebarLink
            icon="add"
            onClick={() => {
              closePopover();
              handleCreateNewDashboard && handleCreateNewDashboard();
            }}
          >
            {t`New dashboard`}
          </SidebarLink>
          {currentUser.is_superuser && (
            <SidebarLink
              icon={getCollectionIcon(PERSONAL_COLLECTIONS)}
              url={OTHER_USERS_COLLECTIONS_URL}
              onClick={closePopover}
            >
              {t`Other users' personal collections`}
            </SidebarLink>
          )}
          <SidebarLink
            icon="view_archive"
            url={ARCHIVE_URL}
            onClick={closePopover}
          >
            {t`View archive`}
          </SidebarLink>
        </CollectionMenuList>
      ),
      [currentUser, handleCreateNewCollection, handleCreateNewDashboard],
    );

    return (
      <CollectionNodeRoot
        role="treeitem"
        depth={depth}
        aria-selected={isSelected}
        isSelected={isSelected}
        hovered={isHovered}
        onClick={onToggleExpand}
        hasDefaultIconStyle={isRegularCollection}
        ref={ref}
      >
        <ExpandToggleButton hidden={!hasChildren}>
          <TreeNode.ExpandToggleIcon
            isExpanded={isExpanded}
            name="chevronright"
            size={12}
          />
        </ExpandToggleButton>
        <FullWidthLink to={url} onClick={onSelect} onKeyDown={onKeyDown}>
          <TreeNode.IconContainer transparent={false}>
            <SidebarIcon {...icon} isSelected={isSelected} />
          </TreeNode.IconContainer>
          <NameContainer>{collection.name}</NameContainer>
          <CollectionsMoreIconContainer>
            <TippyPopoverWithTrigger
              renderTrigger={({ onClick }) => (
                <CollectionsMoreIcon
                  name="ellipsis"
                  onClick={onClick}
                  size={12}
                />
              )}
              popoverContent={renderMenu}
            />
          </CollectionsMoreIconContainer>
        </FullWidthLink>
      </CollectionNodeRoot>
    );
  },
);

const DroppableSidebarCollectionLink = React.forwardRef<
  HTMLLIElement,
  TreeNodeDLProps
>(function DroppableSidebarCollectionLink(
  { item, ...props }: TreeNodeDLProps,
  ref,
) {
  const collection = item as unknown as Collection;
  return (
    <div data-testid="sidebar-collection-link-root">
      <CollectionDropTarget collection={collection}>
        {(droppableProps: DroppableProps) => (
          <SidebarCollectionLink
            {...props}
            {...droppableProps}
            collection={collection}
            ref={ref}
          />
        )}
      </CollectionDropTarget>
    </div>
  );
});

export default DroppableSidebarCollectionLink;
