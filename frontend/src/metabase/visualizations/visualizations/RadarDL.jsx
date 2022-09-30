/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import { getDefaultDimensionsAndMetrics } from "metabase/visualizations/lib/utils";
import { getOptionFromColumn } from "metabase/visualizations/lib/settings/utils";
import { isDimension, isMetric } from "metabase/lib/schema_metadata";
import styled from "@emotion/styled";
import * as echarts from "echarts";
import _ from "underscore";

const ChartContainer = styled.div`
  padding: 1em;
`;

class Radar extends React.Component {
  static uiName = t`Radar`;
  static identifier = "radar";
  static iconName = "table";

  static settings = {
    "radar._dimension_filter": {
      getDefault: () => isDimension,
      useRawSeries: true,
    },
    "radar._metric_filter": {
      getDefault: () => isMetric,
      useRawSeries: true,
    },
    "radar.dimension": {
      section: t`Data`,
      title: t`Dimension`,
      widget: "field",
      readDependencies: ["radar._dimension_filter"],
      getProps: ([{ data }], vizSettings) => {
        const options = data.cols
          .filter(vizSettings["radar._dimension_filter"])
          .map(getOptionFromColumn);

        return {
          options,
        };
      },
      dashboard: false,
      useRawSeries: true,
    },
    "radar.dimensionValues": {
      section: t`Data`,
      title: t`Dimension Values`,
      widget: "fields",
      readDependencies: ["radar._dimension_filter", "radar.dimension"],
      getProps: ([{ data }], vizSettings) => {
        const colIndex = data.cols.findIndex(
          v => v.name === vizSettings["radar.dimension"],
        );
        let options = data.rows.map(v => v[colIndex]);
        options = _.uniq(options).map(v => ({
          name: v,
          value: v,
        }));

        return {
          options,
          addAnother: t`Add another`,
          showColumnSetting: false,
        };
      },
      dashboard: false,
      useRawSeries: true,
    },
    "radar.metrics": {
      section: t`Data`,
      title: t`Metrics`,
      widget: "fields",
      readDependencies: ["radar._metric_filter"],
      getDefault: series => getDefaultDimensionsAndMetrics(series).metrics,
      persistDefault: true,
      getProps: ([{ data }], vizSettings) => {
        const options = data.cols
          .filter(vizSettings["radar._metric_filter"])
          .map(getOptionFromColumn);

        return {
          options,
          addAnother: t`Add another series...`,
          columns: data.cols,
          showColumnSetting: false,
        };
      },
      dashboard: false,
      useRawSeries: true,
    },
  };

  constructor(props) {
    super(props);

    this.refChart = React.createRef();
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  init() {
    const partOption = this.getOption();

    const option = {
      title: {
        text: "",
      },
      ...partOption,
    };

    if (!this.refChart.current) {
      return;
    }

    const chart = echarts.init(this.refChart.current);
    chart.setOption(option);
  }

  getOption = () => {
    const { settings, series } = this.props;
    const [{ data }] = series;
    const radarDimension = settings["radar.dimension"];
    const radarDimensionValues = settings["radar.dimensionValues"] || [];
    const radarMetrics = settings["radar.metrics"];

    const legendData = radarDimensionValues;

    const colIndex = data.cols.findIndex(v => v.name === radarDimension);
    const rowIndexes = [];
    for (const value of radarDimensionValues) {
      rowIndexes.push(data.rows.findIndex(v => v[colIndex] === value));
    }

    const filteredRows = [];
    for (const i of rowIndexes) {
      filteredRows.push(data.rows[i]);
    }

    const indicator = [];
    for (const metrics of radarMetrics) {
      indicator.push({ name: metrics });
    }

    const seriesData = [];
    for (let i = 0; i < filteredRows.length; ++i) {
      const value = [];
      for (const metrics of radarMetrics) {
        const idx = data.cols.findIndex(v => v.name === metrics);
        value.push(filteredRows[i]?.[idx]);
      }

      seriesData.push({
        value,
        name: legendData[i],
      });
    }

    const option = {
      legend: {
        data: legendData,
      },
      radar: {
        indicator,
      },
      series: [
        {
          type: "radar",
          data: seriesData,
        },
      ],
    };

    return option;
  };

  render() {
    return (
      <ChartContainer ref={this.refChart} className={this.props.className} />
    );
  }
}

export default Radar;
