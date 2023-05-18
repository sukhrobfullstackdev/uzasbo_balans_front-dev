import React from 'react';
import { Skeleton } from 'antd';
import NVD3Chart from 'react-nvd3';

import DashboardServices from '../../../services/Dashboard/dashboard.services';
import classes from './charts.module.css';

class MultiBarChart extends React.Component {
  state = {
    data: [],
    loader: true,
  }

  componentDidMount() {
    DashboardServices.getSalaryDashboardInfo()
      .then(res => {
        if (res.status === 200) {
          this.setState({ data: res.data, loader: false });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  custom_template_function = (obj) => {
    return `<div style='padding: 10px'>${obj.data.Count} ${obj.data.Oblast}</div>`;
  }

  gety = (d) => {
    return d.y;
  }

  render() {
    if (this.state.loader) {
      return (
        <div className={classes['multi-bar-chart-loader']}>
          <Skeleton.Input active size='large' />
          <Skeleton.Input active size='large' />
          <Skeleton.Button active size='large' className={classes['multi-bar-chart-button-loader']} />
          <Skeleton.Input active size='large' />
          <Skeleton.Input active size='large' />
        </div>
      )
    }

    return <NVD3Chart type="multiBarChart" datum={this.state.data} x="x" y={this.gety} height={400} showValues groupSpacing={0.2} margin={{ left: 100 }} />
  }
}

export default MultiBarChart;