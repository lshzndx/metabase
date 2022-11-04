import React from "react";
import LogoIcon from "metabase/components/LogoIcon";
import { LogoLink, LogoRoot, LogoText } from "./AppBarLogoDL.styled";

export interface AppBarLogoProps {
  onLogoClick?: () => void;
}

const AppBarLogoDL = ({ onLogoClick }: AppBarLogoProps): JSX.Element => {
  return (
    <LogoRoot>
      <LogoLink to="/" onClick={onLogoClick} data-metabase-event="Navbar;Logo">
        <LogoIcon height={64} />
        <LogoText>Meta Base</LogoText>
      </LogoLink>
    </LogoRoot>
  );
};

export default AppBarLogoDL;
