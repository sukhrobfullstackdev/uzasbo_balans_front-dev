import React from 'react';
import NVD3Chart from 'react-nvd3';

function getDatum() {
  var sin = [
    { key: '12/1/2011', y: '12' },
    { key: '8/1/2012', y: '23' },
    { key: '12/1/2012', y: '34' },
    { key: '8/15/2013', y: '45' },
    { key: '12/15/2013', y: '56' },
    { key: '9/1/2014', y: '67' }
  ]
  // var sin = [
  //   { x: 67, y: 12 },
  //   { x: 56, y: 23 },
  //   { x: 45, y: 34 },
  //   { x: 34, y: 45 },
  //   { x: 22, y: 56 },
  //   { x: 11, y: 67 }
  // ]
  // sin2 = [],
  //   cos = [];
  // for (var i = 0; i < 10; i++) {
  //   sin.push({
  //     'x': i,
  //     'y': Math.sin(i / 10)
  //   });
  //   sin2.push({
  //     'x': i,
  //     'y': Math.sin(i / 10) * 0.25 + 0.5
  //   });
  //   cos.push({
  //     'x': i,
  //     'y': .5 * Math.cos(i / 10)
  //   });
  // }

  console.log(sin);
  return [
    {
      values: sin,
      key: 'Sine Wave',
      color: '#A389D4'
    },
    // {
    //   values: cos,
    //   key: 'Cosine Wave',
    //   color: '#04a9f5'
    // },
    // {
    //   values: sin2,
    //   key: 'Another sine wave',
    //   color: '#1de9b6',
    //   area: true
    // }
  ];
}

class LineChart extends React.Component {

  render() {
    const data = getDatum();
    return (
      <div>
        {
          React.createElement(NVD3Chart, {
            xAxis: {
              axisLabel: 'Year',
              tickFormat: function (d) {
                var dateObj = new Date(d);
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = year + "/" + month + "/" + day;
                
                return (newdate)
              },
            },
            yAxis: {
              axisLabel: 'Voltage (v)',
              tickFormat: function (d) { return parseFloat(d).toFixed(2); }
            },
            type: 'lineChart',
            datum: data,
            x: 'key',
            y: 'y',
            height: 300,
            renderEnd: function () {
              console.log('renderEnd');
            }
          })
        }
      </div>
    )
  }
}

export default LineChart;