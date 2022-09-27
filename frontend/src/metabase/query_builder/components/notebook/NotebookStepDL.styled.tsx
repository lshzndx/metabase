import styled from "@emotion/styled";
import { breakpointMinSmall } from "metabase/styled-components/theme";
import { color, alpha } from "metabase/lib/colors";

const getPercentage = (number: number): string => {
  return `${number * 100}%`;
};

const BUTTON_CONTAINER_WIDTH = 60;

export const StepRoot = styled.div`
  position: relative;
  padding-bottom: 0.5rem;
  padding-left: 4rem;

  ${breakpointMinSmall} {
    padding-bottom: 1rem;
  }

  &:after {
    content: " ";
    display: ${props => (props.hide ? "none" : "block")};
    position: absolute;
    left: 1rem;
    top: 6.2rem;
    width: 1px;
    height: ${props =>
      props.isLastStep ? "calc(100% - 6.5rem)" : "calc(100% - 4.2rem)"};
    background: ${color("text-light")};
  }
`;

export interface StepHeaderProps {
  color?: string;
}

export const StepContent = styled.div`
  position: relative;
  width: calc(100% - ${BUTTON_CONTAINER_WIDTH}px);
`;

export const StepArrow = styled.div`
  position: absolute;
  transform: rotate(45deg);
  top: 1.5rem;
  left: -6px;
  width: 12px;
  height: 12px;
  border: 1px solid ${props => alpha(props.color, 0.3)};
  border-top: none;
  border-right: none;
  background: white;
`;

export const StepHeader = styled(StepContent)<StepHeaderProps>`
  display: flex;
  color: ${props => props.color};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const StepBody = styled.div`
  display: flex;
  align-items: center;
`;

export const StepButtonContainer = styled.div`
  width: ${BUTTON_CONTAINER_WIDTH}px;
`;

export const StepActionsContainer = styled.div`
  margin-top: 0.5rem;
`;
