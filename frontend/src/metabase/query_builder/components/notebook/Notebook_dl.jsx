/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";

import Button from "metabase/core/components/Button";
import { color as c } from "metabase/lib/colors";

import NotebookSteps from "./NotebookSteps_dl";
import { NotebookRoot, VizContainer } from "./Notebook_dl.styled";
import NoteBookStepIndicator from "./NoteBookStepIndicator";

export default function Notebook({ className, ...props }) {
  const {
    question,
    isDirty,
    isRunnable,
    isResultDirty,
    runQuestionQuery,
    setQueryBuilderMode,
    hasVisualizeButton = true,
  } = props;

  // When switching out of the notebook editor, cleanupQuestion accounts for
  // post aggregation filters and otherwise nested queries with duplicate column names.
  async function cleanupQuestion() {
    let cleanQuestion = question.setQuery(question.query().clean());
    if (cleanQuestion.display() === "table") {
      cleanQuestion = cleanQuestion.setDefaultDisplay();
    }
    await cleanQuestion.update();
  }

  // vizualize switches the view to the question's visualization.
  async function visualize() {
    // Only cleanup the question if it's dirty, otherwise Metabase
    // will incorrectly display the Save button, even though there are no changes to save.
    if (isDirty) {
      cleanupQuestion();
    }
    // switch mode before running otherwise URL update may cause it to switch back to notebook mode
    await setQueryBuilderMode("view");
    if (isResultDirty) {
      await runQuestionQuery();
    }
  }

  return (
    <NotebookRoot className={className}>
      <NotebookSteps hasVisualizeButton={hasVisualizeButton} {...props} />
      {hasVisualizeButton && isRunnable && (
        <VizContainer>
          <NoteBookStepIndicator
            color={c("brand")}
            title={t`Visualize`}
            icon="viz"
            isLastStep
          />
          <Button
            medium
            primary
            style={{ minWidth: 220, height: 40 }}
            onClick={visualize}
          >
            {t`Visualize`}
          </Button>
        </VizContainer>
      )}
    </NotebookRoot>
  );
}
