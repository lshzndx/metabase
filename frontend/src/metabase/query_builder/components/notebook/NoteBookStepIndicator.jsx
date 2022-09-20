/* eslint-disable react/prop-types */
import React from "react";
import styled from "@emotion/styled";
import Icon from "metabase/components/Icon";
import { color as c } from "metabase/lib/colors";

const ICON_SIZE = 2;
const TITLE_WIDTH = 5;

const StepIndicator = styled.div`
  position: absolute;
  left: 0;
  top: ${props => (props.isLastStep ? "0.3rem" : "2.5rem")};
`;
const StepIndicatorIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${c("text-white")};
  width: ${ICON_SIZE}rem;
  height: ${ICON_SIZE}rem;
  border-radius: 50%;
  background: ${props => props.color};
`;
const StepIndicatorName = styled.div`
  padding-top: 4px;
  color: ${props => props.color};
  width: ${TITLE_WIDTH}rem;
  text-align: center;
  transform: translateX(-${(TITLE_WIDTH - ICON_SIZE) / 2}rem);
`;

export default function NoteBookStepIndicator({
  title,
  color,
  icon,
  isLastStep,
}) {
  return (
    <StepIndicator isLastStep={isLastStep}>
      <StepIndicatorIconWrapper color={color}>
        <Icon name={icon} />
      </StepIndicatorIconWrapper>
      <StepIndicatorName color={color}>{title}</StepIndicatorName>
    </StepIndicator>
  );
}
