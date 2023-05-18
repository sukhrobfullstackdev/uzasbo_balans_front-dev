import React from 'react';
import NVD3Chart from 'react-nvd3';
import Fade from 'react-reveal/Fade';

import HelperServices from '../../../services/Dashboard/dashboard.services';
// const datum = [
//   {
//     key: "Cumulative Return",
//     // values: [{ 'Date': '12/1/2011', 'MinimalSalary': '12' },
//     // { 'Date': '8/1/2012', 'MinimalSalary': '23' },
//     // { 'Date': '12/1/2012', 'MinimalSalary': '34' },
//     // { 'Date': '8/15/2013', 'MinimalSalary': '45' },
//     // { 'Date': '12/15/2013', 'MinimalSalary': '56' },
//     // { 'Date': '9/1/2014', 'MinimalSalary': '67' }]
//     values: [{
//       "label": "A",
//       "value": -29,
//       "color": "#3ebfea"
//     }, {
//       "label": "B",
//       "value": 101234314,
//       "color": "#04a9f5"
//     }, {
//       "label": "C",
//       "value": 32,
//       "color": "#ff8a65"
//     }, {
//       "label": "D",
//       "value": 19,
//       "color": "#1de9b6"
//     }, {
//       "label": "E",
//       "value": 0.2,
//       "color": "#4C5667"
//     }, {
//       "label": "F",
//       "value": -98,
//       "color": "#69CEC6"
//     }, {
//       "label": "G",
//       "value": -13,
//       "color": "#a389d4"
//     }, {
//       "label": "H",
//       "value": -5,
//       "color": "#FE8A7D"
//     }]
//   }
// ];

class BarDiscreteChart extends React.Component {
  state = {
    datum: []
  }
  componentDidMount() {
    HelperServices.getDashboardMinimalSalary()
      .then((res) => {
        if (res.status === 200) {
          this.setState({ datum: res.data });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  getX = (d) => {
    // let dateObj = new Date(d.Date);
    // let month = dateObj.getMonth() + 1;
    // let day = dateObj.getDate();
    // let year = dateObj.getFullYear();

    // if (month.toString().length === 1) {
    //   month = '0' + month;
    // }

    // let newdate = day + "." + month + "." + year;
    // console.log(dateObj);
    // return d.Date;

    var newDate = new Date(d.Date);
    var dd = String(newDate.getDate()).padStart(2, '0');
    var mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = newDate.getFullYear();

    newDate = dd + '.' + mm + '.' + yyyy;

    return newDate;
  }

  render() {
    return (
      <Fade>
        {/* <NVD3Chart tooltip={{ enabled: true }} type="discreteBarChart" datum={datum} x="label" y="value" height={600} showValues staggerLabels /> */}
        <NVD3Chart tooltip={{ enabled: true }} type="discreteBarChart" datum={this.state.datum} x='Date' y="MinimalSalary" showValues height={400} />
      </Fade>
    )
  }
}

export default BarDiscreteChart;