import React from 'react';
import { Col, Row } from 'antd'

import Map from './Map';
import Calendar from "../../views/NotFound/Calendar";

const MainPage = () => {
  const dashboardViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('Dashboard');

  return (
    <Row gutter={16}>
      <Col span={24}>
        {dashboardViewRole ? (<Map />) : (<Calendar />)}
      </Col>
    </Row>
  );
};

export default MainPage;