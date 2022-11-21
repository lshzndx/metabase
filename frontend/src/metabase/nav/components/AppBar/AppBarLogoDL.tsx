import React from "react";
import LogoIcon from "metabase/components/LogoIcon";
import { LogoLink, LogoRoot, LogoText } from "./AppBarLogoDL.styled";
import { t } from "ttag";

export interface AppBarLogoProps {
  onLogoClick?: () => void;
}

const AppBarLogoDL = ({ onLogoClick }: AppBarLogoProps): JSX.Element => {
  return (
    <LogoRoot>
      <LogoLink to="/" onClick={onLogoClick} data-metabase-event="Navbar;Logo">
        <LogoIcon height={38} />
        {/* <LogoText>{t`VLink`}</LogoText> */}
      </LogoLink>
    </LogoRoot>
  );
};

export default AppBarLogoDL;
