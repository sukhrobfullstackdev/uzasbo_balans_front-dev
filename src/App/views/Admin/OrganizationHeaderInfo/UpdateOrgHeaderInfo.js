import React, { useState, useEffect } from 'react';
import Fade from "react-reveal/Fade";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Input, Spin, Space, DatePicker } from "antd";
import moment from "moment";

import Card from "../../../components/MainCard";
import OrganizationHeaderInfoServices from "../../../../services/Admin/OrganizationHeaderInfo/OrganizationHeaderInfo.services";
import { Notification } from "../../../../helpers/notifications";
import HeaderOrganizationModal from "./HeaderOrganizationModal";
import OrganizationModal from "./OrganizationModal";
import ChapterModal from "./ChapterModal";
import { SearchOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import classes from "./PreferentialOrg.module.css";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const UpdatePreferentialOrganization = (props) => {
  const [loader, setLoader] = useState(true);
  const [organizationalModal, setOrganizationModal] = useState(false);
  const [headerOrganizationalModal, setHeaderOrganizationModal] = useState(false);
  const [chapterlModal, setChapterModal] = useState(false);

  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const { size } = useState([]);
  const [orgId, setOrganizationId] = useState();
  const [headerOrgId, setHeaderOrganizationId] = useState();
  const [chapterId, setChapterId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      // console.log(orgHeaderInfo)
      const [orgHeaderInfo] = await Promise.all([
        OrganizationHeaderInfoServices.getById(props.match.params.id ? props.match.params.id : 0),

      ]);
      // console.log(orgHeaderInfo.data)

      mainForm.setFieldsValue({
        ...orgHeaderInfo.data,


        StartDate: moment(orgHeaderInfo.data.StartDate, 'DD.MM.YYYY'),
        EndDate: orgHeaderInfo.data?.EndDate
        // EndDate: (EndDate?.moment(orgHeaderInfo.data.EndDate, 'DD.MM.YYYY') : ""),

      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    values.ID = docId;
    values.HeaderOrganizationID = headerOrgId ? headerOrgId : docId;
    values.OrganizationID = orgId ? orgId : docId;
    values.ChapterID = chapterId ? chapterId : docId;
    values.StartDate = values.StartDate.format("DD.MM.YYYY");
    // values.EndDate = values.EndDate.format("DD.MM.YYYY");
    // values.SubCalculationKindID = subCalcId ? subCalcId : salaryCalc.SubCalculationKindID;
    // values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    OrganizationHeaderInfoServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/OrganizationHeaderInfo`);
          Notification('success', t('success-msg'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const getHeaderOrganizationName = (name, id) => {
    setHeaderOrganizationId(id);
    mainForm.setFieldsValue({ HeaderOrganizationName: name });
  };

  const getOrganizationName = (name, id) => {
    setOrganizationId(id);
    mainForm.setFieldsValue({ OrganizationName: name });
  };

  const getChapterName = (name, id) => {
    setChapterId(id);
    mainForm.setFieldsValue({ ChapterName: name });
  };

  // const onReset = () => {
  //   mainForm.setFieldsValue({ OrganizationName: null });
  // };

  // let fillBtnVisible = true;
  // if (salaryCalc.StatusID === 2 || salaryCalc.StatusID === 6 || salaryCalc.StatusID === 8 || salaryCalc.StatusID === 12) {
  //   fillBtnVisible = false;
  // }

  return (
    <Fade>
      <Card title={t("OrganizationHeaderInfo")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("id")}
                  name="ID"
                >
                  <Input style={{ width: "100%" }} placeholder={t("id")} disabled />
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  name="StartDate"
                  label={t("startDate")}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    className='datepicker'
                    placeholder={t("startDate")}
                  />
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  name="EndDate"
                  label={t("endDate")}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    className='datepicker'
                    placeholder={t("endDate")}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xl={5} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={headerOrganizationalModal}
                    timeout={300}
                  >
                    <HeaderOrganizationModal
                      visible={headerOrganizationalModal}
                      onCancel={() => setHeaderOrganizationModal(false)}
                      getHeaderOrganizationName={getHeaderOrganizationName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("HeaderOrganizationName")}
                    name="HeaderOrganizationName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setHeaderOrganizationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  
                </div>
              </Col>

              <Col xl={5} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={organizationalModal}
                    timeout={300}
                  >
                    <OrganizationModal
                      visible={organizationalModal}
                      onCancel={() => setOrganizationModal(false)}
                      getOrganizationName={getOrganizationName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("OrganizationName")}
                    name="OrganizationName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setOrganizationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  
                </div>
              </Col>

              <Col xl={5} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={chapterlModal}
                    timeout={300}
                  >
                    <ChapterModal
                      visible={chapterlModal}
                      onCancel={() => setChapterModal(false)}
                      getChapterName={getChapterName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("ChapterName")}
                    name="ChapterName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setChapterModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  
                </div>
              </Col>

             
            </Row>
            <Space size='middle' className='btns-wrapper'>
              <Button
                type="danger"
                onClick={() => {
                  history.goBack();
                  Notification("warning", t("not-saved"));
                }}
              >
                {t("back")}
              </Button>
              <Button
                htmlType="submit"
                form="mainForm"
                type="primary"
              >
                {t("save")}
              </Button>
            </Space>
          </Form>

        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdatePreferentialOrganization;