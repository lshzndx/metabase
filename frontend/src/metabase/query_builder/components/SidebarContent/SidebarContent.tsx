import React, { ReactNode } from "react";
import { t } from "ttag";
import SidebarHeader from "../SidebarHeader";
import {
  SidebarContentRoot,
  SidebarContentMain,
  FooterButton,
} from "./SidebarContent.styled";
import cx from "classnames";

type Props = {
  className?: string;
  headerClass: string;
  title?: string;
  icon?: string;
  color?: string;
  onBack?: () => void;
  onClose?: () => void;
  onDone?: () => void;
  doneButtonText?: string;
  footer?: ReactNode;
  children?: ReactNode;
};

function SidebarContent({
  className,
  headerClass,
  title,
  icon,
  color,
  onBack,
  onClose,
  onDone,
  doneButtonText = t`Done`,
  footer = onDone ? (
    <FooterButton color={color} onClick={onDone}>
      {doneButtonText}
    </FooterButton>
  ) : null,
  children,
}: Props) {
  return (
    <SidebarContentRoot className={className}>
      <SidebarContentMain data-testid="sidebar-content">
        {(title || icon || onBack) && (
          <SidebarHeader
            className={cx("mx3 my2 pt1", headerClass)}
            title={title}
            icon={icon}
            onBack={onBack}
            onClose={onClose}
          />
        )}
        {children}
      </SidebarContentMain>
      {footer}
    </SidebarContentRoot>
  );
}

export default SidebarContent;
