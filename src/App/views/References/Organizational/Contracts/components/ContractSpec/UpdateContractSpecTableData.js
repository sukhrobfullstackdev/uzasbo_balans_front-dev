import React, { useEffect, useState, useCallback } from "react";
import { Modal, Form, Select, Button, Row, Col, Input, Spin, DatePicker, Tabs, InputNumber } from "antd";
import { useTranslation } from 'react-i18next';
import { SearchOutlined, } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import moment from 'moment';

import EnktModal from "./EnktModal";
import PurchasePlanTable from './PurchasePlanTable';
import HelperServices from "../../../../../../../services/Helper/helper.services";
import TreasInfoApis from "../../../../../../../services/TreasInfo/TreasInfoApis";
import CommodityParamsTable from "./CommodityParams";
import { Notification } from "../../../../../../../helpers/notifications";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const UpdateContractSpecTableData = ({ rowData, onSave, ...props }) => {
  const [mainForm] = Form.useForm();
  const [purchasePlanForm] = Form.useForm();
  const { t } = useTranslation();

  // const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enktModalVisible, setEnktModalVisible] = useState(false);
  const [enktPropsList, setEnktPropsList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [commodityParamsTableData, setCommodityParamsTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const countryLs = await TreasInfoApis.getAllTreasCountry();
      if (rowData?.ENKTCode) {
        const expenseLs = await HelperServices.getItemOfExpenseListForENKT(rowData.ENKTCode);
        const enktPropsLs = await HelperServices.getENKTPropertiesList(rowData.ENKTCode);
        setExpenseList(expenseLs.data);
        setEnktPropsList(enktPropsLs.data);
      }
      setCountryList(countryLs.data);
    }

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))

    mainForm.setFieldsValue({
      ...rowData,
      GuaranteePeriod: rowData.GuaranteePeriod ? moment(rowData.GuaranteePeriod, 'DD.MM.YYYY') : null,
      DateOfIssue: rowData.DateOfIssue ? moment(rowData.DateOfIssue, 'DD.MM.YYYY') : null,
      ExpirationDate: rowData.ExpirationDate ? moment(rowData.ExpirationDate, 'DD.MM.YYYY') : null,
    })
  }, [rowData, rowData.ENKTCode, mainForm])

  const onFormFinish = useCallback(values => {
    values.ID = rowData.ID;
    values.Status = rowData.ID !== 0 ? 2 : 1;
    values.key = rowData.key ? rowData.key : Math.random();
    values.DateOfIssue = values.DateOfIssue.format('DD.MM.YYYY');
    values.ExpirationDate = values.ExpirationDate.format('DD.MM.YYYY');
    values.GuaranteePeriod = values.GuaranteePeriod.format('DD.MM.YYYY');
    values.SplitTables = [purchasePlanForm.getFieldsValue()];
    values.CV2Tables = commodityParamsTableData;
    onSave(values);
  }, [purchasePlanForm, rowData, onSave, commodityParamsTableData])

  const selectEnktHandler = useCallback(async (values) => {
    setEnktModalVisible(false);
    mainForm.setFieldsValue({
      ENKTCode: values.code,
      ENKTValue: values.value
    });

    if (values.code && values.value) {
      setLoading(true);
      try {
        const expenseLs = await HelperServices.getItemOfExpenseListForENKT(values.code);
        const enktPropsLs = await HelperServices.getENKTPropertiesList(values.code);
        setExpenseList(expenseLs.data);
        setEnktPropsList(enktPropsLs.data);
        setLoading(false);
      } catch (err) {
        Notification('error', err);
        setLoading(false)
      }
    } else {
      setExpenseList([]);
      setEnktPropsList([]);
    }
  }, [mainForm])

  return (
    <>
      <Modal
        width={1800}
        visible={props.visible}
        title={t("specification")}
        onCancel={props.onCancel}
        footer={[
          <Button form="form" htmlType="submit" key='submit' type="primary">
            {t('save')}
          </Button>,
          <Button form="form" key='cancel' onClick={props.onCancel}>
            {t('cancel')}
          </Button>
        ]}
      >
        <Spin spinning={loading} size='large'>
          <Form
            layout="vertical"
            id='form'
            form={mainForm}
            onFinish={onFormFinish}
          // initialValues={rowData}
          >
            <Row gutter={[15, 0]}>
              <Col xl={2} lg={12}>
                <Form.Item
                  label={t('number')}
                  name='Number'
                >
                  <Input
                    disabled
                    style={{ width: '100%' }}
                    placeholder={t('number')}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t("ENKTCode")}
                  name="ENKTCode"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <Input
                    disabled
                    placeholder={t("ENKTCode")}
                    addonAfter={<Button
                      type="primary"
                      className='addon-after-btn'
                      icon={<SearchOutlined />}
                      onClick={() => {
                        setEnktModalVisible(true);
                      }}
                    />}
                  />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("ENKTValue")}
                  name="ENKTValue"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <Input
                    disabled
                    placeholder={t("ENKTValue")}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('itemOfExpensesCode')}
                  name='ItemOfExpensesCode'
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("itemOfExpensesCode")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {expenseList.map(item => <Option key={item.expense} value={item.expense}>{item.expense}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={2} lg={12}>
                <Form.Item
                  label={t('quantity')}
                  name='Quantity'
                >
                  <Input
                    disabled
                    style={{ width: '100%' }}
                    placeholder={t('quantity')}
                  />
                </Form.Item>
              </Col>
              <Col xl={2} lg={12}>
                <Form.Item
                  label={t('price')}
                  name='Price'
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t('price')}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t('sum')}
                  name='Sum'
                >
                  <InputNumber
                    readOnly
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    style={{ width: '100%' }}
                    placeholder={t('sum')}
                  />
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('license')}
                  name='License'
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t('license')}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('mark')}
                  name='Mark'
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t('mark')}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('paramerts')}
                  name='Paramerts'
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t('paramerts')}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('manufacturer')}
                  name='Manufacturer'
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={t('manufacturer')}
                  />
                </Form.Item>
              </Col>
              <Col xl={8} lg={12}>
                <Form.Item
                  label={t('countries')}
                  name='CountryID'
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("countries")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {countryList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("guaranteePeriod")}
                  name="GuaranteePeriod"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder={t("guaranteePeriod")}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("dateOfIssue")}
                  name="DateOfIssue"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder={t("dateOfIssue")}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("expirationDate")}
                  name="ExpirationDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder={t("expirationDate")}
                  />
                </Form.Item>
              </Col>
              <Col xl={15} lg={12}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea rows={1} placeholder={t("Comment")} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('purchasePlan')} key="1">
              <Form
                form={purchasePlanForm}
                component={false}
                initialValues={rowData.SplitTables[0]}
              >
                <PurchasePlanTable form={purchasePlanForm} mainForm={mainForm} />
              </Form>
            </TabPane>
            <TabPane tab={t('commodityParams')} key="2">
              <CommodityParamsTable
                data={rowData.CV2Tables}
                enktPropsList={enktPropsList}
                enktCode={mainForm.getFieldValue('ENKTCode')}
                setData={setCommodityParamsTableData}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </Modal>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={enktModalVisible}
        timeout={300}
      >
        <EnktModal
          visible={enktModalVisible}
          onCancel={() => setEnktModalVisible(false)}
          onSelect={selectEnktHandler}
        />
      </CSSTransition>
    </>
  );
};

export default React.memo(UpdateContractSpecTableData);