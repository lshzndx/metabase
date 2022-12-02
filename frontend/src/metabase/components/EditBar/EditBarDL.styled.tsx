import styled from "@emotion/styled";

import Icon from "metabase/components/Icon";

import { alpha, color } from "metabase/lib/colors";
import { FullWidthContainer } from "metabase/styled-components/layout/FullWidthContainer";

export const Root = styled(FullWidthContainer)<{ admin: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  background-color: ${props =>
    props.admin ? alpha(color("accent7"), 0.85) : color("bg-black")};

  .Button {
    color: ${color("text-white")};
    background-color: ${props =>
      alpha(color("bg-white"), props.admin ? 0.1 : 0)};

    border: ${props =>
      props.admin ? "none" : `1px solid ${color("text-white")}`};
    font-size: 1em;
    margin-left: 0.75em;
  }

  .Button--primary {
    color: ${props => color(props.admin ? "text-dark" : "text-white")};
    background-color: ${props => color(props.admin ? "bg-white" : "brand")};
    border-color: ${color("brand")};
  }

  .Button:hover {
    color: ${color("text-white")};
    background-color: ${props => color(props.admin ? "accent7" : "brand")};
    border-color: ${color("brand")};
  }
`;

export const EditIcon = styled(Icon)`
  color: ${props => color(props.admin ? "text-white" : "brand")};
  margin-right: 0.5rem;
`;

export const Title = styled.span`
  color: ${color("text-white")};
  font-weight: 700;
`;

export const Subtitle = styled.span`
  color: ${alpha(color("text-white"), 0.5)};
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;
