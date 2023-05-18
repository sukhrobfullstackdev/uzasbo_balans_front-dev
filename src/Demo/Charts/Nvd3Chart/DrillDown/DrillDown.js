import React, { Component } from 'react';
import { Chart, Series, Legend, ValueAxis, Tooltip } from "devextreme-react/chart";
import { Button } from "devextreme-react/button";
import { withTranslation } from "react-i18next";

import 'devextreme/dist/css/dx.light.css';
import './drill-down.css';
import service from "./dataForDrillDown";
import classes from './DrillDown.module.css';

const colors = ["#6babac", "#e55253"];

class DrillDown extends Component {
  state = {
    isFirstLevel: true,
    isSecondLevel: false,
    data: service.filterData("")
  };

  renderContent = (tooltip) => {
    return {
      text: new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(tooltip.value)
    };
  }

  customizePoint = () => {
    if (!this.state.isSecondLevel && !this.state.isFirstLevel) {
      return {
        color: colors[2]
      };
    }
    return {
      color: colors[Number(this.state.isFirstLevel)]
    };
  }

  onPointClick = (e) => {
    if (e.target.data.parentID === "") {
      this.setState({
        isFirstLevel: false,
        isSecondLevel: true,
        orgArg: e.target.originalArgument,
        data: service.filterData(e.target.originalArgument)
      });
    } else if (!this.state.isFirstLevel && this.state.isSecondLevel) {
      this.setState({
        isSecondLevel: false,
        data: service.filterData(e.target.originalArgument)
      });
    }
  }

  onSecondButtonClick = () => {
    if (!this.state.isSecondLevel) {
      this.setState({
        isSecondLevel: true,
        data: service.filterData(this.state.orgArg)
      });
    }
  }

  onButtonClick = () => {
    if (!this.state.isFirstLevel) {
      this.setState({
        isFirstLevel: true,
        data: service.filterData("")
      });
    }
  };

  // customizeText = (e) => {
  //   return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(e.value);
  // }

  render() {
    const { t } = this.props;
    return (
      <>
        <Button
          className={classes['button-container']}
          text={t("back")}
          icon="chevronleft"
          visible={!this.state.isFirstLevel && this.state.isSecondLevel}
          onClick={this.onButtonClick}
        />
        <Button
          className={classes['button-container']}
          text={t("back")}
          icon="chevronleft"
          visible={!this.state.isFirstLevel && !this.state.isSecondLevel}
          onClick={this.onSecondButtonClick}
        />
        <Chart
          style={{ height: "80vh", marginTop: '10px' }}
          id="chart"
          rotated={true}
          customizePoint={this.customizePoint}
          onPointClick={this.onPointClick}
          className={this.state.isFirstLevel ? "pointer-on-bars" : ""}
          dataSource={this.state.data}
        >
          <Series type="bar" />
          <ValueAxis showZero={false} allowDecimals>
            {/* <Label customizeText={this.customizeText} /> */}
          </ValueAxis>
          <Legend visible={false} />
          <Tooltip
            enabled={true}
            // contentRender={this.renderContent}
            customizeTooltip={this.renderContent}
            closeOnOutsideClick={true}
          />
        </Chart>
      </>
    );
  }
}

export default withTranslation()(DrillDown);