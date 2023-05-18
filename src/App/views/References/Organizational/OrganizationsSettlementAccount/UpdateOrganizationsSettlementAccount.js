import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Space, DatePicker, Typography, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import OrgSettleAccServices from '../../../../../services/References/Organizational/OrgSettleAcc/OrgSettleAcc.services';
import classes from "./OrganizationsSettlementAccount.module.css";
import moment from "moment";

import Card from "../../../../components/MainCard";
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import OrgSettleAccModal from "../OrganizationsSettlementAccount/components/Modals/OrgSettleAccModal"
import GetSubCashListModal from "../OrganizationsSettlementAccount/components/Modals/GetSubCashListModal"
import GetSubActualListModal from "./components/Modals/GetSubActualListModal"

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { TextArea } = Input;
const { Text } = Typography;

const UpdateOrgSettleAcc = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loading, setLoading] = useState(true);
  const [orgSettleAccModal, setOrgSettleAccModal] = useState(false);
  const [oldId, setOldId] = useState(null);
  const [getSubCashModal, setGetSubCashModal] = useState(false);
  const [cashSubAccId, setCashSubAccId] = useState(null);
  const [getSubActualCashModal, setGetSubActualCashModal] = useState(false);
  const [actualSubAccId, setActualSubAccId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [orgCash] = await Promise.all([
        OrgSettleAccServices.getById(props.match.params.id ? props.match.params.id : 0),
      ]);
      setOldId(orgCash.data.OldID);
      setCashSubAccId(orgCash.data.CashSubAccID);
      setActualSubAccId(orgCash.data.ActualSubAccID);
      mainForm.setFieldsValue({
        ...orgCash.data,
        OpenDate: orgCash.data.OpenDate ? moment(orgCash.data.OpenDate, 'DD.MM.YYYY') : null,
        CloseDate: orgCash.data.CloseDate ? moment(orgCash.data.CloseDate, 'DD.MM.YYYY') : null,
      });
    };

    fetchData().catch(err => {
      Notification('error', err);
    })
      .finally(() => setLoading(false));
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    values.ID = docId
    values.OpenDate = values.OpenDate ? values.OpenDate.format('DD.MM.YYYY') : null;
    values.CloseDate = values.CloseDate ? values.CloseDate.format('DD.MM.YYYY') : null;
    values.OldID = oldId;
    values.CashSubAccId = cashSubAccId;
    values.ActualSubAccId = actualSubAccId;

    setLoading(true);
    OrgSettleAccServices.update(values)
      .then(() => {
        Notification('success', t('success-msg'));
        history.push(`/OrganizationsSettlementAccount`);
      })
      .catch((err) => {
        Notification('error', err);
      })
      .finally(() => setLoading(false));
  };

  const clearHandler = (input) => {
    mainForm.setFieldsValue({ [input]: null });
  };

  const getOrgSettleAccHandler = useCallback((values) => {
    mainForm.setFieldsValue({ OldCode: values.code, ActualSubAcc: values.actualSubAcc });
    setOldId(values.id);
    setOrgSettleAccModal(false);
  }, [mainForm]);

  const getSubCashCodeHandler = useCallback((values) => {
    mainForm.setFieldsValue({ CashSubAcc: values.code });
    setCashSubAccId(values.id);
    setGetSubCashModal(false);
  }, [mainForm])

  const getSubActualCashCodeHandler = useCallback((values) => {
    mainForm.setFieldsValue({ ActualSubAcc: values.code });
    setActualSubAccId(values.id);
    setGetSubActualCashModal(false);
  }, [mainForm])

  return (
    <Card title={t("OrgSettleAcc")}>
      <Spin spinning={loading} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={7} md={16}>
              <Form.Item
                label={t("Name")}
                name="Name"
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input placeholder={t("Name")} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xl={7} md={8}>
              <Form.Item
                label={t("Code")}
                name="Code"
              >
                <Input
                  disabled
                  style={{ width: "100%" }}
                  placeholder={t("Code")}
                />
              </Form.Item>
            </Col>
            <Col xl={10} lg={8}>
              <Space align='center' style={{ height: '100%' }}>
                <Text type="warning">Эски хисобварак ўрнига янги очилса, хакикий харажатлар янгисида кўриниши учун эски хисобваракни танланг // Если лицевой счет изменился на новый, выберите старый лицевой счет, чтобы фактические расходы отражались на новым лицевом счете</Text>
              </Space>
            </Col>

            <Col xl={8} md={12}>
              <div className={classes.flex}>
                <CSSTransition
                  mountOnEnter
                  unmountOnExit
                  in={orgSettleAccModal}
                  timeout={300}
                >
                  <OrgSettleAccModal
                    visible={orgSettleAccModal}
                    onCancel={() => setOrgSettleAccModal(false)}
                    onSelect={getOrgSettleAccHandler}
                  />
                </CSSTransition>

                <Form.Item
                  label={t("OrgSettleAcc")}
                  name="OldCode"
                  style={{ width: "100%" }}
                >
                  <Input
                    disabled
                    style={{ color: 'black' }}
                    placeholder={t("OrgSettleAcc")}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  onClick={() => {
                    setOrgSettleAccModal(true);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<SearchOutlined />}
                />

                <Button
                  type="primary"
                  onClick={() => {
                    clearHandler('OldCode');
                    setOldId(null);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<DeleteOutlined />}
                />
              </div>
            </Col>
            <Col xl={8} md={12}>
              <div className={classes.flex}>
                <CSSTransition
                  mountOnEnter
                  unmountOnExit
                  in={getSubCashModal}
                  timeout={300}
                >
                  <GetSubCashListModal
                    visible={getSubCashModal}
                    onCancel={() => setGetSubCashModal(false)}
                    onSelect={getSubCashCodeHandler}
                  />
                </CSSTransition>

                <Form.Item
                  label={t("GetSubCashList")}
                  name="CashSubAcc"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <Input
                    disabled
                    style={{ color: 'black' }}
                    placeholder={t("GetSubCashList")}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  onClick={() => {
                    setGetSubCashModal(true);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<SearchOutlined />}
                />

                <Button
                  type="primary"
                  onClick={() => {
                    clearHandler('CashSubAcc');
                    setCashSubAccId(null);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<DeleteOutlined />}
                />
              </div>
            </Col>
            <Col xl={8} md={12}>
              <div className={classes.flex}>
                <CSSTransition
                  mountOnEnter
                  unmountOnExit
                  in={getSubActualCashModal}
                  timeout={300}
                >
                  <GetSubActualListModal
                    visible={getSubActualCashModal}
                    onCancel={() => setGetSubActualCashModal(false)}
                    onSelect={getSubActualCashCodeHandler}
                  />
                </CSSTransition>

                <Form.Item
                  label={t("GetSubActualList")}
                  name="ActualSubAcc"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <Input
                    disabled
                    style={{ color: 'black' }}
                    placeholder={t("GetSubActualList")}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  onClick={() => {
                    setGetSubActualCashModal(true);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<SearchOutlined />}
                />

                <Button
                  type="primary"
                  onClick={() => {
                    clearHandler('ActualSubAcc');
                    setActualSubAccId(null);
                  }}
                  style={{ marginTop: 38 }}
                  icon={<DeleteOutlined />}
                />
              </div>

            </Col>

            <Col xl={4} md={16}>
              <Form.Item
                name="OpenDate"
                label={t("OpenDate")}
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={4} md={16}>
              <Form.Item
                name="CloseDate"
                label={t("CloseDate")}
              >
                <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={16} lg={12}>
              <Form.Item
                label={t("Comment")}
                name="Comment"
              >
                <TextArea rows={1} placeholder={t("Comment")} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

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
      </Spin>
    </Card>
  )
}

export default UpdateOrgSettleAcc;