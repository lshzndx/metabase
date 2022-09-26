import React from "react";
import { CollectionId, User } from "metabase-types/api";
import AppBarLogo from "./AppBarLogo";
import NewItemButton from "../NewItemButton";
import ProfileLink from "../ProfileLink";
import SearchBar from "../SearchBar";
import CollectionBreadcrumbs from "../../containers/CollectionBreadcrumbs";
import QuestionLineage from "../../containers/QuestionLineage";
import {
  AppBarLeftContainer,
  AppBarRightContainer,
  AppBarRoot,
  AppBarInfoContainer,
  AppBarProfileLinkContainer,
} from "./AppBarLarge.styled";

import { AppBarNavDL } from "./AppBarNavDL.styled";

import { HomePageLink } from "../../containers/MainNavbar/MainNavbar.styled";

import { t } from "ttag";

import AppBarLogoDL from "./AppBarLogoDL";

export interface AppBarLargeProps {
  currentUser: User;
  collectionId?: CollectionId;
  isNavBarOpen?: boolean;
  isNavBarVisible?: boolean;
  isSearchVisible?: boolean;
  isNewButtonVisible?: boolean;
  isProfileLinkVisible?: boolean;
  isCollectionPathVisible?: boolean;
  isQuestionLineageVisible?: boolean;
  onToggleNavbar: () => void;
  onLogout: () => void;
}

const AppBarLarge = ({
  currentUser,
  collectionId,
  isNavBarOpen,
  isNavBarVisible,
  isSearchVisible,
  isNewButtonVisible,
  isProfileLinkVisible,
  isCollectionPathVisible,
  isQuestionLineageVisible,
  onToggleNavbar,
  onLogout,
}: AppBarLargeProps): JSX.Element => {
  const { pathname } = location;
  return (
    <AppBarRoot isNavBarOpen={isNavBarOpen}>
      <AppBarLeftContainer isNavBarVisible={isNavBarVisible}>
        {/* <AppBarLogo
          isNavBarOpen={isNavBarOpen}
          isToggleVisible={isNavBarVisible}
          onToggleClick={onToggleNavbar}
        /> */}
        <AppBarLogoDL />
        <AppBarNavDL>
          <HomePageLink isSelected={pathname === "/"} icon="home" url="/">
            {t`Home`}
          </HomePageLink>
          <HomePageLink
            isSelected={pathname.startsWith("/collection")}
            icon="folder"
            url="/collection/root"
          >
            {t`Collections`}
          </HomePageLink>
          <HomePageLink
            isSelected={pathname.startsWith("/browse")}
            icon="database"
            url="/browse"
          >
            {t`Data`}
          </HomePageLink>
        </AppBarNavDL>
        <AppBarInfoContainer
          isVisible={!isNavBarOpen || isQuestionLineageVisible}
        >
          {isQuestionLineageVisible ? (
            <QuestionLineage />
          ) : isCollectionPathVisible ? (
            <CollectionBreadcrumbs collectionId={collectionId} />
          ) : null}
        </AppBarInfoContainer>
      </AppBarLeftContainer>
      {(isSearchVisible || isNewButtonVisible || isProfileLinkVisible) && (
        <AppBarRightContainer>
          {isSearchVisible && <SearchBar />}
          {isNewButtonVisible && <NewItemButton />}
          {isProfileLinkVisible && (
            <AppBarProfileLinkContainer>
              <ProfileLink user={currentUser} onLogout={onLogout} />
            </AppBarProfileLinkContainer>
          )}
        </AppBarRightContainer>
      )}
    </AppBarRoot>
  );
};

export default AppBarLarge;
