import React, { useEffect } from "react";
import { isSmallScreen } from "metabase/lib/dom";
import HomeLayout from "../../containers/HomeLayout";
import HomeContent from "../../containers/HomeContent";

export interface HomePageProps {
  onOpenNavbar: () => void;
  onCloseNavbar: () => void;
}

const HomePage = ({
  onOpenNavbar,
  onCloseNavbar,
}: HomePageProps): JSX.Element => {
  useEffect(() => {
    if (!isSmallScreen()) {
      onOpenNavbar();
    }
  }, [onOpenNavbar]);

  return (
    <HomeLayout>
      <HomeContent onCloseNavbar={onCloseNavbar} />
    </HomeLayout>
  );
};

export default HomePage;
