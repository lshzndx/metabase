import styled from "@emotion/styled";
import { color, hueRotate } from "metabase/lib/colors";
import { breakpointMinSmall } from "metabase/styled-components/theme";

export const LayoutRoot = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: ${color("bg-light")};
`;

export const LayoutBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem 3rem;
  min-height: 100vh;
`;

export const LayoutCard = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  padding: 2.5rem 1.5rem;
  background-color: ${color("white")};
  box-shadow: 0 1px 15px ${color("shadow")};
  border-radius: 6px;

  ${breakpointMinSmall} {
    width: 30.875rem;
    padding: 2.5rem 3.5rem;
  }
`;

export const LayoutIllustration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: hue-rotate(${hueRotate("brand")}deg);
  background-image: url("app/img/bridge.svg");
  background-size: max(100%, 100%) auto;
  background-repeat: no-repeat;
  background-position: right bottom;
`;

export const LayoutLogoWrap = styled.div`
  display: flex;
`;

export const LogoIconWrap = styled.div`
  display: block;
`;

export const LogoText = styled.span`
  font-size: 32px;
  font-weight: 500;
  color: ${color("text-dark")};
  padding: 0 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  display: flex;
  align-items: center;
  justify-content: center;
`;
