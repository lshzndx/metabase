import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import Icon from "metabase/components/Icon";
import { TreeNode } from "metabase/components/tree/TreeNode";
import Tooltip from "metabase/components/Tooltip";
import Link from "metabase/core/components/Link";

import { NAV_SIDEBAR_WIDTH } from "metabase/nav/constants";

import { darken, color, lighten, alpha } from "metabase/lib/colors";

export const SidebarIcon = styled(Icon)<{
  color?: string | null;
  isSelected: boolean;
}>`
  ${props =>
    !props.color &&
    css`
      color: ${props.isSelected ? color("brand") : color("brand-light")};
    `}
`;

SidebarIcon.defaultProps = {
  size: 14,
};

export const SidebarIconDL = styled(Icon)<{
  color?: string | null;
  isSelected: boolean;
}>`
  ${props =>
    !props.color &&
    css`
      color: ${color("text-light")};
    `}
  ${props =>
    props.isSelected &&
    css`
      color: ${color("white")};
    `}
  vertical-align: -0.125em;
  display: inline-block;
  line-height: 0;
`;

export const ExpandToggleButton = styled(TreeNode.ExpandToggleButton)`
  padding: 4px 0 4px 2px;
  color: ${color("brand-light")};
`;

const activeColorCSS = css`
  color: ${color("brand")};
`;

function getTextColor(isSelected: boolean) {
  return isSelected ? color("brand") : darken(color("text-medium"), 0.25);
}

export const NodeRoot = styled(TreeNode.Root)<{
  hasDefaultIconStyle?: boolean;
}>`
  color: ${props => getTextColor(props.isSelected)};

  background-color: ${props =>
    props.isSelected ? alpha("brand", 0.2) : "unset"};

  padding-left: ${props => props.depth}rem;
  border-radius: 4px;

  ${ExpandToggleButton} {
    ${props => props.isSelected && activeColorCSS}
  }

  &:hover {
    background-color: ${alpha("brand", 0.35)};
    color: ${color("brand")};

    ${ExpandToggleButton} {
      color: ${color("brand")};
    }

    ${SidebarIcon} {
      ${props => props.hasDefaultIconStyle && activeColorCSS};
    }
  }
`;

NodeRoot.defaultProps = {
  hasDefaultIconStyle: true,
};

export const CollectionNodeRoot = styled(NodeRoot)<{ hovered?: boolean }>`
  ${props =>
    props.hovered &&
    css`
      color: ${color("text-white")};
      background-color: ${color("brand")};
    `}
`;

const itemContentStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const FullWidthButton = styled.button<{ isSelected: boolean }>`
  cursor: pointer;
  ${itemContentStyle}

  ${TreeNode.NameContainer} {
    font-weight: 700;
    color: ${props => getTextColor(props.isSelected)};
    text-align: start;

    &:hover {
      color: ${color("brand")};
    }
  }
`;

export const FullWidthLink = styled(Link)`
  ${itemContentStyle}
  width: 90%;
`;

const ITEM_NAME_LENGTH_TOOLTIP_THRESHOLD = 35;
const ITEM_NAME_LABEL_WIDTH = Math.round(parseInt(NAV_SIDEBAR_WIDTH, 10) * 0.7);

const ItemName = styled(TreeNode.NameContainer)`
  width: ${ITEM_NAME_LABEL_WIDTH}px;
  padding: 6px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export function NameContainer({ children: itemName }: { children: string }) {
  if (itemName.length >= ITEM_NAME_LENGTH_TOOLTIP_THRESHOLD) {
    return (
      <Tooltip tooltip={itemName} maxWidth="none">
        <ItemName>{itemName}</ItemName>
      </Tooltip>
    );
  }
  return <TreeNode.NameContainer>{itemName}</TreeNode.NameContainer>;
}

export const CollectionMoreIconContainer = styled.button`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 0.5rem;
  cursor: pointer;
  align-items: center;
`;

export const CollectionMoreIcon = styled(Icon)`
  color: ${color("text-medium")};
  flex: none;
`;

export const CollectionMenuList = styled.ul`
  padding: 0.5rem;
`;
