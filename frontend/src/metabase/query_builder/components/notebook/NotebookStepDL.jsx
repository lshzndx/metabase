/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import _ from "underscore";

import styled from "@emotion/styled";

import { color as c, lighten, darken, alpha } from "metabase/lib/colors";

import Tooltip from "metabase/components/Tooltip";
import Icon from "metabase/components/Icon";
import Button from "metabase/core/components/Button";
import ExpandingContent from "metabase/components/ExpandingContent";

// import NotebookStepPreview from "./NotebookStepPreview";

import DataStep from "./steps/DataStepDL";
import JoinStep from "./steps/JoinStepDL";
import ExpressionStep from "./steps/ExpressionStepDL";
import FilterStep from "./steps/FilterStepDL";
import AggregateStep from "./steps/AggregateStepDL";
import BreakoutStep from "./steps/BreakoutStepDL";
import SummarizeStep from "./steps/SummarizeStepDL";
import SortStep from "./steps/SortStepDL";
import LimitStep from "./steps/LimitStepDL";
import {
  StepActionsContainer,
  StepBody,
  StepContent,
  StepHeader,
  StepButtonContainer,
  StepRoot,
  StepArrow,
} from "./NotebookStepDL.styled";
import NoteBookStepIndicator from "./NoteBookStepIndicator";

import Modal from "metabase/components/Modal";

import NotebookStepPreviewDL from "./NotebookStepPreviewDL";

// TODO
const STEP_UI = {
  data: {
    title: t`Data`,
    icon: "database",
    component: DataStep,
    getColor: () => c("brand"),
  },
  join: {
    title: t`Join data`,
    icon: "join_left_outer",
    component: JoinStep,
    priority: 1,
    getColor: () => c("brand"),
  },
  expression: {
    title: t`Custom column`,
    icon: "add_data",
    component: ExpressionStep,
    transparent: true,
    getColor: () => c("brand"),
  },
  filter: {
    title: t`Filter`,
    icon: "filter",
    component: FilterStep,
    priority: 10,
    getColor: () => c("filter"),
  },
  summarize: {
    title: t`Summarize`,
    icon: "sum",
    component: SummarizeStep,
    priority: 5,
    getColor: () => c("summarize"),
  },
  aggregate: {
    title: t`Aggregate`,
    icon: "sum",
    component: AggregateStep,
    priority: 5,
    getColor: () => c("summarize"),
  },
  breakout: {
    title: t`Breakout`,
    icon: "segment",
    component: BreakoutStep,
    priority: 1,
    getColor: () => c("accent4"),
  },
  sort: {
    title: t`Sort`,
    icon: "smartscalar",
    component: SortStep,
    compact: true,
    transparent: true,
    getColor: () => c("brand"),
  },
  limit: {
    title: t`Row limit`,
    icon: "list",
    component: LimitStep,
    compact: true,
    transparent: true,
    getColor: () => c("brand"),
  },
};

function getTestId(step) {
  const { type, stageIndex, itemIndex } = step;
  return `step-${type}-${stageIndex || 0}-${itemIndex || 0}`;
}

export default class NotebookStep extends React.Component {
  state = {
    showPreview: false,
  };

  render() {
    const {
      step,
      openStep,
      isLastStep,
      isLastOpened,
      updateQuery,
      hasVisualizeButton,
      isRunnable,
    } = this.props;
    const { showPreview } = this.state;

    const {
      title,
      icon,
      getColor,
      component: NotebookStepComponent,
    } = STEP_UI[step.type] || {};

    const color = getColor();
    const canPreview = step.previewQuery && step.previewQuery.isValid();
    const showPreviewButton = !showPreview && canPreview;

    // const largeActionButtons =
    //   isLastStep &&
    //   _.any(step.actions, action => !STEP_UI[action.type].compact);

    const actions = [];
    actions.push(
      ...step.actions.map(action => {
        const stepUi = STEP_UI[action.type];

        return {
          priority: stepUi.priority,
          button: (
            <ActionButton
              mr={isLastStep ? 2 : 1}
              mt={isLastStep ? 2 : null}
              color={stepUi.getColor()}
              // large={largeActionButtons}
              {...stepUi}
              key={`actionButton_${stepUi.title}`}
              onClick={() => action.action({ query: step.query, openStep })}
            />
          ),
        };
      }),
    );

    actions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const actionButtons = actions.map(action => action.button);

    return (
      <ExpandingContent isInitiallyOpen={!isLastOpened} isOpen>
        <StepRoot
          className="hover-parent hover--visibility"
          data-testid={getTestId(step)}
          isLastStep={isLastStep}
          hide={!hasVisualizeButton || !isRunnable}
        >
          <NoteBookStepIndicator title={title} color={color} icon={icon} />
          <StepHeader color={color}>
            {/* {title} */}
            <Icon
              name="close"
              className="ml-auto cursor-pointer text-light text-medium-hover hover-child"
              tooltip={t`Remove`}
              onClick={() => step.revert(step.query).update(updateQuery)}
              data-testid="remove-step"
            />
          </StepHeader>

          {NotebookStepComponent && (
            <StepBody>
              <StepContent>
                <StepArrow color={color} />
                <NotebookStepComponent
                  color={color}
                  step={step}
                  query={step.query}
                  updateQuery={updateQuery}
                  isLastOpened={isLastOpened}
                />
              </StepContent>
              <StepButtonContainer>
                <ActionButton
                  ml={[1, 2]}
                  className={
                    !showPreviewButton ? "hidden disabled" : "text-brand-hover"
                  }
                  icon="play"
                  title={t`Preview`}
                  color={c("text-light")}
                  transparent
                  onClick={() => this.setState({ showPreview: true })}
                />
              </StepButtonContainer>
            </StepBody>
          )}

          {/* {showPreview && canPreview && (
            <NotebookStepPreview
              step={step}
              onClose={() => this.setState({ showPreview: false })}
            />
          )} */}

          <Modal
            style={{ padding: "1em" }}
            isOpen={showPreview && canPreview}
            title={t`Preview`}
            onClose={() => this.setState({ showPreview: false })}
            className="Modal Modal--wide"
          >
            <NotebookStepPreviewDL step={step} />
          </Modal>

          {actionButtons.length > 0 && (
            <StepActionsContainer data-testid="action-buttons">
              {actionButtons}
            </StepActionsContainer>
          )}
        </StepRoot>
      </ExpandingContent>
    );
  }
}

const ColorButton = styled(Button)`
  border: none;
  color: ${({ color }) => color};
  background-color: ${({ color, transparent }) =>
    transparent ? null : alpha(color, 0.2)};
  &:hover {
    color: ${({ color }) => darken(color, 0.115)};
    background-color: ${({ color, transparent }) =>
      transparent ? lighten(color, 0.5) : alpha(color, 0.35)};
  }
  transition: background 300ms;
`;

const ActionButton = ({
  icon,
  title,
  color,
  transparent,
  large,
  onClick,
  ...props
}) => {
  const button = (
    <ColorButton
      icon={icon}
      small={!large}
      color={color}
      transparent={transparent}
      iconVertical={large}
      iconSize={large ? 18 : 14}
      onClick={onClick}
      {...props}
    >
      {large ? title : null}
    </ColorButton>
  );

  return large ? button : <Tooltip tooltip={title}>{button}</Tooltip>;
};
