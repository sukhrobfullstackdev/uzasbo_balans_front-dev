import React from 'react';
import { Row} from 'react-bootstrap';
import { withTranslation } from "react-i18next";

// import LineChart from "./LineChart";
// import BarDiscreteChart from "./BarDiscreteChart";
// import MultiBarChart from "./MultiBarChart";
// import DrillDown from "./DrillDown/DrillDown";
// import DrillDownRechart from "./DrillDown/DrillDownRechart";
// import PieDonutChart from "./PieDonutChart";
// import CumulativeLineChart from "./CumulativeLineChart";

class Nvd3Chart extends React.Component {

  render() {
    //const { t } = this.props;

    return (
      <Row>
{/* 
      <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('Ташкилотлар ҳаражатлари')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <DrillDown />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('Ташкилотлар ҳаражатлари')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <DrillDownRechart />
            </Card.Body>
          </Card>
        </Col>
         */}
        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('DashboardOrgInfo')}</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieDonutChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('getSalaryDashboardInfo')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <MultiBarChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{t('minSalaryInfos')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <BarDiscreteChart />
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">{t("Pie Basic Chart")}</Card.Title>
              </Card.Header>
              <Card.Body className="text-center">
                <PieBasicChart />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">{t("Line Chart")}</Card.Title>
              </Card.Header>
              <Card.Body>
                <LineChart />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">CumulativeLineChart</Card.Title>
              </Card.Header>
              <Card.Body>
                <CumulativeLineChart />
              </Card.Body>
            </Card>
          </Col>
          
          

          */}
      </Row>
    );
  }
}

export default withTranslation()(Nvd3Chart);


