/* eslint-disable react/prop-types */
import React from "react";
import _ from "underscore";
import { t } from "ttag";
import Icon from "metabase/components/Icon";
import CollapseSection from "metabase/components/CollapseSection";
import SidebarContent from "metabase/query_builder/components/SidebarContent";
import "./ChartTypeSidebarDL.css";

import visualizations from "metabase/visualizations";
import {
  OptionIconContainer,
  OptionList,
  OptionRoot,
  OptionText,
} from "./ChartTypeOption.styled";

// const FIXED_LAYOUT = [
//   ["line", "bar", "combo", "area", "row", "waterfall"],
//   ["scatter", "pie", "funnel", "smartscalar", "progress", "gauge"],
//   ["scalar", "table", "pivot", "map"],
// ];
// const FIXED_TYPES = new Set(_.flatten(FIXED_LAYOUT));

const FIXED_LAYOUT = [
  {
    name: t`Compare`,
    items: ["line", "bar", "combo", "area", "row", "waterfall"],
  },
  {
    name: t`Distribution`,
    items: ["scatter", "pie", "funnel", "smartscalar", "progress", "gauge"],
  },
  {
    name: t`Process`,
    items: ["scalar", "table", "pivot", "map"],
  },
];
const FIXED_TYPES = new Set(_.flatten(FIXED_LAYOUT.map(v => v.items)));

const ChartTypeSidebar = ({
  question,
  result,
  onOpenChartSettings,
  onCloseChartType,
  isShowingChartTypeSidebar,
  setUIControls,
  ...props
}) => {
  const other = Array.from(visualizations)
    .filter(
      ([type, visualization]) =>
        !visualization.hidden && !FIXED_TYPES.has(type),
    )
    .map(([type]) => type);
  const otherGrouped = [
    {
      name: t`Other`,
      items: _.flatten(
        Object.values(_.groupBy(other, (_, index) => Math.floor(index / 4))),
      ),
    },
  ];

  const layout = [...FIXED_LAYOUT, ...otherGrouped];

  return (
    <SidebarContent
      className="ChartTypeSidebarContent full-height px1"
      headerClass="ChartTypeSidebarContentHeader"
      title={t`Choose a visualization`}
      onDone={onCloseChartType}
    >
      {layout.map((section, index) => (
        <CollapseSection
          key={index}
          className="ChartTypeSidebarSection"
          headerClass="ChartTypeSidebarSectionHeader"
          iconPosition="tail"
          iconVariant="up-down"
          initialState={index === 0 ? "expanded" : "collapsed"}
          header={section.name}
        >
          <OptionList>
            {section.items.map(type => {
              const visualization = visualizations.get(type);
              return (
                visualization && (
                  <ChartTypeOption
                    key={type}
                    visualization={visualization}
                    isSelected={type === question.display()}
                    isSensible={
                      result &&
                      result.data &&
                      visualization.isSensible &&
                      visualization.isSensible(result.data, props.query)
                    }
                    onClick={() => {
                      question
                        .setDisplay(type)
                        .lockDisplay(true) // prevent viz auto-selection
                        .update(null, {
                          reload: false,
                          shouldUpdateUrl: question.query().isEditable(),
                        });
                      onOpenChartSettings({ section: t`Data` });
                      setUIControls({ isShowingRawTable: false });
                    }}
                  />
                )
              );
            })}
          </OptionList>
        </CollapseSection>
      ))}
    </SidebarContent>
  );
};

const ChartTypeOption = ({
  visualization,
  isSelected,
  isSensible,
  onClick,
}) => (
  <OptionRoot isSensible={isSensible}>
    <OptionIconContainer
      isSelected={isSelected}
      onClick={onClick}
      className="cursor-pointer bg-brand-hover text-brand text-white-hover"
      data-testid={`${visualization.uiName}-button`}
      data-is-sensible={isSensible}
    >
      <Icon name={visualization.iconName} size={20} />
    </OptionIconContainer>
    <OptionText>{visualization.uiName}</OptionText>
  </OptionRoot>
);

export default ChartTypeSidebar;
