import React from "react";
import { t } from "ttag";
import NewItemMenu from "metabase/containers/NewItemMenu";
import { NewButton, NewButtonText } from "./NewItemButton.styled";

const NewItemButtonDL = () => {
  return (
    <NewItemMenu
      trigger={
        <NewButton
          primary
          icon={<img src="app/img/add_icon.svg" />}
          iconSize={14}
          data-metabase-event="NavBar;Create Menu Click"
        >
          <NewButtonText>{t`New`}</NewButtonText>
        </NewButton>
      }
      analyticsContext={"NavBar"}
    />
  );
};

export default NewItemButtonDL;
