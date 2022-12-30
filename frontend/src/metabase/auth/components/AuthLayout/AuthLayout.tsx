import React, { ReactNode } from "react";
import LogoIcon from "metabase/components/LogoIcon";
import {
  LayoutBody,
  LayoutCard,
  LayoutIllustration,
  LayoutRoot,
  LogoText,
  LayoutLogoWrap,
  LogoIconWrap,
} from "./AuthLayout.styled";
import { t } from "ttag";

export interface AuthLayoutProps {
  showIllustration: boolean;
  children?: ReactNode;
}

const AuthLayout = ({
  showIllustration,
  children,
}: AuthLayoutProps): JSX.Element => {
  return (
    <LayoutRoot>
      {showIllustration && <LayoutIllustration />}
      <LayoutBody>
        <LayoutLogoWrap>
          <LogoIconWrap>
            <LogoIcon height={65} />
          </LogoIconWrap>
          <LogoText>{t`VLink`}</LogoText>
        </LayoutLogoWrap>
        <LayoutCard>{children}</LayoutCard>
      </LayoutBody>
    </LayoutRoot>
  );
};

export default AuthLayout;
