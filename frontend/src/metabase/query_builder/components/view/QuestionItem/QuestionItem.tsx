import React from "react";
import { QuestionItemRoot } from "./QuestionItem.styled";

type Props = {
  question: string;
};

export function QuestionItem({ question }: Props) {
  return (
    <div style={{ height: 33 }}>
      <QuestionItemRoot>{question}</QuestionItemRoot>
    </div>
  );
}
