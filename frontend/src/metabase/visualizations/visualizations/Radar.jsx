/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";
import { getDefaultDimensionsAndMetrics } from "metabase/visualizations/lib/utils";
import { getOptionFromColumn } from "metabase/visualizations/lib/settings/utils";
import { isMetric } from "metabase/lib/schema_metadata";
import styled from "@emotion/styled";
import * as echarts from "echarts";

const ChartContainer = styled.div`
  padding: 1em;
`;

class Radar extends React.Component {
  static uiName = t`Radar`;
  static identifier = "radar";
  static iconName = "table";

  static settings = {
    "radar._metric_filter": {
      getDefault: () => isMetric,
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
    const { indicator, seriesData } = this.getData();

    const option = {
      title: {
        text: "",
      },
      legend: {
        data: ["Allocated Budget", "Actual Spending"],
      },
      radar: {
        indicator,
        // indicator: [
        //   { name: 'Sales',  },
        //   { name: 'Administration' },
        //   { name: 'Information Technology' },
        //   { name: 'Customer Support' },
        //   { name: 'Development' },
        //   { name: 'Marketing' },
        // ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: seriesData,
          // data: [
          //   {
          //     value: [4200, 3000, 20000, 35000, 50000, 18000],
          //     name: 'Allocated Budget'
          //   },
          //   {
          //     value: [5000, 14000, 28000, 26000, 42000, 21000],
          //     name: 'Actual Spending'
          //   },
          // ],
        },
      ],
    };

    if (!this.refChart.current) {
      return;
    }

    const chart = echarts.init(this.refChart.current);
    chart.setOption(option);
  }

  getData = () => {
    const [{ data }] = this.props.series;
    const radarMetrics = this.props.settings["radar.metrics"];

    const rowData = data.rows[0];

    const indicator = [];
    const seriesValue = [];

    for (const metrics of radarMetrics) {
      const colIndex = data.cols.findIndex(v => v.name === metrics);
      indicator.push({ name: metrics });
      seriesValue.push(rowData[colIndex]);
    }

    const seriesData = [
      {
        value: seriesValue,
        name: "test",
      },
    ];

    return {
      indicator,
      seriesData,
    };
  };

  render() {
    return (
      <ChartContainer ref={this.refChart} className={this.props.className} />
    );
  }
}

export default Radar;
