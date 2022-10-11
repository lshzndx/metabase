/* eslint-disable react/prop-types */
import React, { Component } from "react";
// import PropTypes from "prop-types";
import { t } from "ttag";

import crossfilter from "crossfilter";
import { getFriendlyName } from "metabase/visualizations/lib/utils";

import {
  forceSortedGroup,
  makeIndexMap,
  formatNull,
} from "../lib/renderer_utils";

import {
  // isNumeric,
  // isDate,
  isDimension,
  isMetric,
} from "metabase/lib/schema_metadata";

import _ from "underscore";
// import cx from "classnames";

// import { getAccentColors } from "metabase/lib/colors/groups";

import { columnSettings } from "metabase/visualizations/lib/settings/column";

import {
  GRAPH_DATA_SETTINGS,
  GRAPH_COLORS_SETTINGS,
} from "metabase/visualizations/lib/settings/graph";

import Data from "./TreeData";

import ReactECharts from "echarts-for-react";

import * as echarts from "echarts/core";
import { TooltipComponent } from "echarts/components";
import { TreeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import { getComputedSettingsForSeries } from "metabase/visualizations/lib/settings/visualization";

import { formatValue } from "metabase/lib/formatting";

echarts.use([TooltipComponent, TreeChart, CanvasRenderer]);

const DefaultTreeData = Data;

DefaultTreeData.children.forEach((datum, index) => {
  index % 2 === 0 && (datum.collapsed = true);
});

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.echartRef = React.createRef();

    this.chartOption = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
      },
      series: [
        {
          type: "tree",
          data: [DefaultTreeData],
          top: "1%",
          left: "7%",
          bottom: "1%",
          right: "20%",
          symbolSize: 7,
          label: {
            position: "left",
            verticalAlign: "middle",
            align: "right",
            fontSize: 9,
          },
          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "left",
            },
          },
          emphasis: {
            focus: "descendant",
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };

    this.state = {
      currentChart: null,
      newTreeData: {},
    };
  }
  static uiName = t`Tree`;
  static identifier = "tree";
  static iconName = "tree";

  // static aliases = ["state", "country", "pin_map"];

  // static minSize = { width: 4, height: 4 };

  static isSensible({ cols, rows }) {
    return (
      rows.length > 1 &&
      cols.length >= 2 &&
      cols.filter(isDimension).length > 0 &&
      cols.filter(isMetric).length > 0
    );
  }

  static placeholderSeries = [
    {
      card: {
        display: "line",
        visualization_settings: {},
        dataset_query: { type: "null" },
      },
      data: {
        rows: _.range(0, 11).map(i => [i, i]),
        cols: [
          { name: "x", base_type: "type/Integer" },
          { name: "y", base_type: "type/Integer" },
        ],
      },
    },
  ];

  static transformSeries(series) {
    const newSeries = [].concat(
      ...series.map((s, seriesIndex) =>
        transformSingleSeries(s, series, seriesIndex),
      ),
    );
    if (_.isEqual(series, newSeries) || newSeries.length === 0) {
      return series;
    } else {
      return newSeries;
    }
  }

  static settings = {
    ...columnSettings({ hidden: true }),
    ...GRAPH_DATA_SETTINGS,
    ...GRAPH_COLORS_SETTINGS,
  };

  getNewTreeData = series => {
    const { cols } = series[0].data;
    const { display_name } = cols[1];

    const rowsWithFormattedNull = series[0].data.rows.map(
      ([first, ...rest]) => [formatNull(first), ...rest],
    );

    const rows = rowsWithFormattedNull.map(([a, b]) => [
      formatValue(a, { column: cols[0], type: "axis" }),
      b,
    ]);

    // const formattedDimensionMap = new Map(
    //   rows.map(([formattedDimension], index) => [
    //     formattedDimension,
    //     rowsWithFormattedNull[index][0],
    //   ]),
    // );

    const dataset = crossfilter(rows);
    const dimension = dataset.dimension(d => d[0]);
    const group = dimension.group().reduceSum(d => d[1]);
    const yValues = rows.map(d => d[0]);

    forceSortedGroup(group, makeIndexMap(yValues));

    const currentData = group.all();

    const newTreeDataList = currentData.map(item => {
      return { name: item.key, value: item.value };
    });

    const newTreeData = {
      name: display_name,
      children: newTreeDataList,
    };

    newTreeData.children.forEach((datum, index) => {
      index % 2 === 0 && (datum.collapsed = true);
    });

    return newTreeData;
  };

  componentDidMount() {
    const { settings, series } = this.props;

    const newTreeData = this.getNewTreeData(series);

    const myChart = this.echartRef.getEchartsInstance();
    myChart.setOption({
      series: [
        {
          lineStyle: { color: settings.series(series[0]).color },
          data: [newTreeData],
        },
      ],
    });
  }

  componentDidUpdate() {
    const { settings, series } = this.props;

    const newTreeData = this.getNewTreeData(series);

    const myChart = this.echartRef.getEchartsInstance();
    myChart.setOption({
      series: [
        {
          lineStyle: { color: settings.series(series[0]).color },
          data: [newTreeData],
        },
      ],
    });
  }

  componentWillUnmount() {
    const myChart = this.echartRef.getEchartsInstance();
    myChart && myChart.dispose();
  }

  render() {
    const { chartOption } = this;

    return (
      <div className="absolute top left bottom right z1">
        {chartOption && (
          <ReactECharts
            option={chartOption}
            lazyUpdate={true}
            ref={e => {
              this.echartRef = e;
            }}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
    );
  }
}

function transformSingleSeries(s, series, seriesIndex) {
  const { card, data } = s;

  // HACK: prevents cards from being transformed too many times
  if (data._transformed) {
    return [s];
  }

  const { cols, rows } = data;
  const settings = getComputedSettingsForSeries([s]);

  const dimensions = (settings["graph.dimensions"] || []).filter(
    d => d != null,
  );
  const metrics = (settings["graph.metrics"] || []).filter(d => d != null);
  const dimensionColumnIndexes = dimensions.map(dimensionName =>
    _.findIndex(cols, col => col.name === dimensionName),
  );
  const metricColumnIndexes = metrics.map(metricName =>
    _.findIndex(cols, col => col.name === metricName),
  );
  const bubbleColumnIndex =
    settings["scatter.bubble"] &&
    _.findIndex(cols, col => col.name === settings["scatter.bubble"]);
  const extraColumnIndexes =
    bubbleColumnIndex != null && bubbleColumnIndex >= 0
      ? [bubbleColumnIndex]
      : [];

  if (dimensions.length > 1) {
    const [dimensionColumnIndex, seriesColumnIndex] = dimensionColumnIndexes;
    const rowColumnIndexes = [dimensionColumnIndex].concat(
      metricColumnIndexes,
      extraColumnIndexes,
    );

    const breakoutValues = [];
    const breakoutRowsByValue = new Map();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const seriesValue = row[seriesColumnIndex];

      let seriesRows = breakoutRowsByValue.get(seriesValue);
      if (!seriesRows) {
        breakoutRowsByValue.set(seriesValue, (seriesRows = []));
        breakoutValues.push(seriesValue);
      }

      const newRow = rowColumnIndexes.map(columnIndex => row[columnIndex]);
      newRow._origin = { seriesIndex, rowIndex, row, cols };
      seriesRows.push(newRow);
    }

    return breakoutValues.map(breakoutValue => ({
      card: {
        ...card,
        // if multiseries include the card title as well as the breakout value
        name: [
          // show series title if it's multiseries
          series.length > 1 && card.name,
          // always show grouping value
          formatValue(breakoutValue, { column: cols[seriesColumnIndex] }),
        ]
          .filter(n => n)
          .join(": "),
        originalCardName: card.name,
        _breakoutValue: breakoutValue,
        _breakoutColumn: cols[seriesColumnIndex],
      },
      data: {
        rows: breakoutRowsByValue.get(breakoutValue),
        cols: rowColumnIndexes.map(i => cols[i]),
        _rawCols: cols,
        _transformed: true,
      },
      // for when the legend header for the breakout is clicked
      clicked: {
        dimensions: [
          {
            value: breakoutValue,
            column: cols[seriesColumnIndex],
          },
        ],
      },
    }));
  } else {
    // dimensions.length <= 1
    const dimensionColumnIndex = dimensionColumnIndexes[0];
    return metricColumnIndexes.map(metricColumnIndex => {
      const col = cols[metricColumnIndex];
      const rowColumnIndexes = [dimensionColumnIndex].concat(
        metricColumnIndex,
        extraColumnIndexes,
      );
      const name = [
        // show series title if it's multiseries
        series.length > 1 && card.name,
        // show column name if there are multiple metrics or sigle series
        (metricColumnIndexes.length > 1 || series.length === 1) &&
          col &&
          getFriendlyName(col),
      ]
        .filter(n => n)
        .join(": ");

      return {
        card: {
          ...card,
          name: name,
          originalCardName: card.name,
          _seriesIndex: seriesIndex,
          // use underlying column name as the seriesKey since it should be unique
          // EXCEPT for dashboard multiseries, so check seriesIndex == 0
          _seriesKey: seriesIndex === 0 && col ? col.name : name,
        },
        data: {
          rows: rows.map((row, rowIndex) => {
            const newRow = rowColumnIndexes.map(i => row[i]);
            newRow._origin = { seriesIndex, rowIndex, row, cols };
            return newRow;
          }),
          cols: rowColumnIndexes.map(i => cols[i]),
          _transformed: true,
          _rawCols: cols,
        },
      };
    });
  }
}

// rename these settings
Tree.settings["graph.metrics"] = {
  ...Tree.settings["graph.metrics"],
  title: t`X-axis`,
};
Tree.settings["graph.dimensions"] = {
  ...Tree.settings["graph.dimensions"],
  title: t`Y-axis`,
};
