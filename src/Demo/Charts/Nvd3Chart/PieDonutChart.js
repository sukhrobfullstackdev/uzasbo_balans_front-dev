import React from 'react';
import { Skeleton } from 'antd';
import NVD3Chart from 'react-nvd3';
import Fade from 'react-reveal/Fade';

import DashboardServices from '../../../services/Dashboard/dashboard.services.js';
import classes from './charts.module.css';

class PieDonutChart extends React.Component {
  state = {
    datum: [],
    loader: true,
    total: null
  }

  componentDidMount() {
    DashboardServices.getOrganizationDashboardInfo()
      .then(res => {
        if (res.status === 200) {
          this.setState({ datum: res.data.rows, total: res.data.total, loader: false });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  custom_template_function = (obj) => {
    return `<div style='padding: 10px'>${obj.data.Count} ${obj.data.Region}</div>`;
  }

  render() {
    if (this.state.loader) {
      return <Skeleton.Avatar size={500} active={true} className={classes.pieChart} shape='circle' />
    }

    return (
      <Fade>
        <NVD3Chart id="chart" height={400} type="pieChart" datum={this.state.datum} x="Region" y="Count" donut labelType='percent' tooltip={{ contentGenerator: this.custom_template_function }} title={this.state.total} />
      </Fade>
    )
  }
}

export default PieDonutChart;