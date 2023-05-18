import React, { useState, useEffect } from 'react';
import Fade from "react-reveal/Fade";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, Space, Switch } from "antd";

import Card from "../../../components/MainCard";
import UserServices from "../../../../services/Admin/User/User.services";
import { Notification } from "../../../../helpers/notifications";

import OrganizationModal from "./OrganizationModal";
// import OrgModal from "./OrgModal";
import { SearchOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import classes from "./PreferentialOrg.module.css";
import HelperServices from "../../../../services/Helper/helper.services";
import HistoryModal from './components/Modals/HistoryModal.js';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdatePreferentialOrganization = (props) => {
  const [loader, setLoader] = useState(true);
  const [organizationModal, setOrganizationModal] = useState(false);
  // const [nameInfoModal, setNameInfoModal] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyInputName, setHistoryInputName] = useState('');

  const docId = props.match.params.id ? props.match.params.id : 0;

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const { size } = useState([]);
  const [status, setStatus] = useState([]);
  const [orgId, setOrganizationId] = useState();
  const [organizationId, setOrgId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [prefOrgs, status] = await Promise.all([
        UserServices.getById(docId),
        HelperServices.getStateList()

      ]);

      setOrgId(prefOrgs.data.OrganizationID)
      setStatus(status.data);

      mainForm.setFieldsValue({
        ...prefOrgs.data,
        StateID: prefOrgs.data.ID === 0 ? null : prefOrgs.data.StateID,
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    console.log(values);
    values.ID = docId;
    values.OrganizationID = orgId ? orgId : organizationId;
    setLoader(true);
    UserServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/ControlUsers`);
          Notification('success', t('success-msg'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const getOrganizationName = (name, id, accounter) => {
    setOrganizationId(id);
    mainForm.setFieldsValue({ OrganizationName: name, DisplayName: accounter, OrganizationID: id });
  };

  // const onReset = () => {
  //   mainForm.setFieldsValue({ OrganizationName: null });
  // };

  // let fillBtnVisible = true;
  // if (salaryCalc.StatusID === 2 || salaryCalc.StatusID === 6 || salaryCalc.StatusID === 8 || salaryCalc.StatusID === 12) {
  //   fillBtnVisible = false;
  // }

  const historyHandler = inputName => {
    setHistoryInputName(inputName);
    setHistoryModalVisible(true);
  }

  const closeHistoryModalHandler = () => {
    setHistoryModalVisible(false);
  }

  return (
    <Fade>
      <Card title={t("User")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col xl={6} lg={12}>
                <div 
                >

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={historyModalVisible}
                    timeout={300}
                  >
                    <HistoryModal
                      visible={historyModalVisible}
                      id={props.match.params.id ? props.match.params.id : 0}
                      columnName={historyInputName}
                      onCancel={closeHistoryModalHandler}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("name")}
                    name="Name"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>

                    <Input
                      className={'addonInput'}
                      addonAfter={
                        <div
                          onClick={() => historyHandler('FullName')}
                          className={classes['ant-input-group-addon']}
                        >
                          <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                      }
                    />
                  </Form.Item>

                </div>
              </Col>

              <Col xl={6} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={historyModalVisible}
                    timeout={300}
                  >
                    <HistoryModal
                      visible={historyModalVisible}
                      id={props.match.params.id ? props.match.params.id : 0}
                      columnName={historyInputName}
                      onCancel={closeHistoryModalHandler}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("FullName")}
                    name="DisplayName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input
                      className={'addonInput'}
                      addonAfter={
                        <div
                          onClick={() => historyHandler('FullName')}
                          className={classes['ant-input-group-addon']}
                        >
                          <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                      }
                    />
                  </Form.Item>


                </div>
              </Col>

              <Col xl={7} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={organizationModal}
                    timeout={1000}
                  >
                    <OrganizationModal
                      visible={organizationModal}
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
                <Form.Item
                  label={t("State")}
                  name="StateID"
                  rules={[
                    {
                      required: true,
                      message: t("Please select status"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select Status")}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {status.map((status) => (
                      <Option key={status.ID} value={status.ID}>
                        {status.DisplayName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("password")}
                  name="Password"
                >
                  <Input style={{ width: "100%" }} placeholder={t("password")} />
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("confirm-password")}
                  name="PasswordConfirm"
                >
                  <Input style={{ width: "100%" }} placeholder={t("passwordConfirm")} />
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("allowedIP")}
                  name="AllowedIP"
                >
                  <Input style={{ width: "100%" }} placeholder={t("allowedIP")} />
                </Form.Item>
              </Col>

              <Col xl={2} lg={12}>
                <Form.Item
                  label={t('verifyEDS')}
                  name='VerifyEDS'
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
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