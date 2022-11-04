import React from "react";
import { Database, PopularItem, RecentItem, User } from "metabase-types/api";
import styled from "@emotion/styled";
import { color } from "metabase/lib/colors";
import Button from "metabase/core/components/Button";
import * as Urls from "metabase/lib/urls";
import Link from "metabase/core/components/Link";

export interface HomeContentProps {
  user: User;
  databases?: Database[];
  recentItems?: RecentItem[];
  popularItems?: PopularItem[];
  onCloseNavbar?: any;
}

const Header = styled.div`
  color: ${color("text-black")};
  font-size: 24px;
  font-weight: bold;
`;
const Detail = styled.div`
  color: ${color("text-dark")};
  font-size: 20px;
  padding: 20px 0 80px 0;
`;
const NewButton = styled(Button)`
  font-size: 24px;
  padding: 12px 54px;
`;

const HomeContent = (props: HomeContentProps): JSX.Element | null => {
  const url = Urls.newQuestion({
    mode: "notebook",
    creationType: "custom_question",
  });

  return (
    <div>
      <Header>VLink</Header>
      <Detail>用更智能的方式创建你需要的可视化图表</Detail>
      <NewButton
        primary
        data-metabase-event="NavBar;Create Menu Click"
        onClick={props.onCloseNavbar}
      >
        <Link to={url} data-metabase-event="NavBar;New Question Click">
          创建
        </Link>
      </NewButton>
    </div>
  );
};

export default HomeContent;
