import React, { useState, useEffect, useCallback } from 'react';
import Fade from "react-reveal/Fade";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Space, Tabs, Switch } from "antd";
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import { setInitialSum } from './_redux/contractsSlice';
import Card from "../../../../components/MainCard";
import ContractApis from '../../../../../services/References/Organizational/Contracts/Contracts';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import ContractPayerModal from './components/ContractPayerModal';
import PaymentScheduleTable from './components/PaymentScheduleTable/PaymentScheduleTable';
import classes from './Contracts.module.css';
import ContractSpec from './components/ContractSpec/ContractSpec';
// import AccountModal from './components/AccountModal';
import AccountModal from '../../../../components/References/AccountModal';
const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const UpdateContract = (props) => {
  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isClone = queryParams.get('IsClone') ? queryParams.get('IsClone') : false;
  const id = queryParams.get('id') ? queryParams.get('id') : 0;
  const store = useSelector(state => state.contracts)
  const dispatch = useDispatch();
  const sum = store.sum;

  const [loading, setLoading] = useState(true);
  const [contractPayerModalVisible, setContractPayerModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [isBudgetOrg, setIsBudgetOrg] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [orgSettAccList, setOrgSettAccList] = useState([]);
  const [contractTypeInfoList, setContractTypeInfoList] = useState([]);
  const [contractorsSettAccList, setContractorsSettAccList] = useState([]);
  const [paymentScheduleTableData, setPaymentScheduleTableData] = useState([]);
  const [contractSpecTableData, setContractSpecTableData] = useState([]);

  const [contractorId, setContractorId] = useState(null);
  const [currencySum, setCurrencySum] = useState(null);
  const [currencyRate, setCurrencyRate] = useState(null);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let docId;
      if (props.match.params.id) {
        docId = props.match.params.id;
      } else if (isClone && id) {
        docId = id;
      } else {
        docId = 0
      }

      const [formDt, currencyLs, orgSettAccLs, contractTypeInfoLs] = await Promise.all([
        ContractApis.getById({ id: docId, isClone }),
        HelperServices.getCurrencyList(),
        HelperServices.getOrgSettAccList(),
        HelperServices.getContractTypeInfoList(),
        // HelperServices.getStatusList(),
      ]);
      // currencyRate = formDt.data.CurrencyID;
      setMainData(formDt.data);
      setCurrencyList(currencyLs.data.rows);
      setOrgSettAccList(orgSettAccLs.data);
      setContractTypeInfoList(contractTypeInfoLs.data);
      setContractorId(formDt.data.ContractorID);
      setCurrencySum(formDt.data.CurrencySum);
      setIsBudgetOrg(formDt.data.IsBudgetOrg);
      dispatch(setInitialSum(formDt.data.Sum));
      setPaymentScheduleTableData(formDt.data.Tables.map(item => {
        item.key = Math.random();
        return item;
      }));
      setContractSpecTableData(formDt.data.TableSpecV2);
      setTicket(formDt.data.Ticket);

      if (docId) {
        if (!formDt.data.IsBudgetOrg) {
          const contractorsSettAccLs = await HelperServices.getContractorAccountList(formDt.data.ContractorPayeeID);
          setContractorsSettAccList(contractorsSettAccLs.data);
        }
        const contractorsSettAccLs = await HelperServices.getContractorAccountList(formDt.data.ContractorID);
        const currencyRt = await HelperServices.getLastCurrencyCourse({ CurrencyID: formDt.data.CurrencyID, Date: formDt.data.DateOfContract })
        setContractorsSettAccList(contractorsSettAccLs.data);
        setCurrencyRate(currencyRt.data);
      }
      mainForm.setFieldsValue({
        ...formDt.data,
        DateOfContract: moment(formDt.data.DateOfContract, 'DD.MM.YYYY'),
        DateOfStart: moment(formDt.data.DateOfStart, 'DD.MM.YYYY'),
        DateOfEnd: moment(formDt.data.DateOfEnd, 'DD.MM.YYYY'),
      });
      setLoading(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoading(false);
    });
  }, [props.match.params.id, id, isClone, mainForm, dispatch]);

  const onMainFormFinish = (values) => {
    let paymentScheduleTableSum = 0;
    paymentScheduleTableData.forEach(item => {
      if (item.Status !== 3) {
        paymentScheduleTableSum += item.Sum
      }
    });
    let contractSpecTableSum = 0;
    contractSpecTableData.forEach(item => {
      if (item.Status !== 3) {
        contractSpecTableSum += item.Sum
      }
    });

    if (paymentScheduleTableSum !== contractSpecTableSum) {
      Notification('warning', t('sumsAreNotEqual'));
      return false;
    }

    setLoading(true);
    values.ID = props.match.params.id ? props.match.params.id : id;
    values.ContractorID = contractorId;
    values.DateOfContract = values.DateOfContract.format("DD.MM.YYYY");
    values.DateOfEnd = values.DateOfEnd.format("DD.MM.YYYY");
    values.DateOfStart = values.DateOfStart.format("DD.MM.YYYY");
    values.Sum = sum;
    values.CurrencySum = currencySum;
    values.Tables = paymentScheduleTableData; 
    values.TableSpecV2 = contractSpecTableData;

    ContractApis.update(values, isClone)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/contracts`); 
          Notification('success', t('success-msg'));
          return res;
        }
      }) 
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  }

  const selectContractPayerHandler = useCallback((values) => {
    if (!isBudgetOrg) {
      setLoading(true);
      HelperServices.getContractorAccountList(values.id)
        .then((res) => {
          setLoading(false);
          setContractorsSettAccList(res.data);
        })
        .catch(err => Notification('error', err));
    }
    mainForm.setFieldsValue({ ContractorPayeeName: values.name });
    setContractorId(values.id);
  }, [mainForm, isBudgetOrg]);

  const currencyChangeHandler = useCallback((id) => {
    setLoading(true);
    HelperServices.getLastCurrencyCourse({ CurrencyID: id, Date: mainData.DateOfContract })
      .then(res => {
        setCurrencyRate(res.data);
        setCurrencySum(sum / res.data)
      })
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))
  }, [mainData.DateOfContract, sum]);

  const addSettAccHandler = useCallback(() => {
    setAccountModalVisible(false);
    setLoading(true);
    HelperServices.getContractorAccountList(contractorId)
      .then((res) => {
        setLoading(false);
        setContractorsSettAccList(res.data);
      })
      .catch(err => Notification('error', err));
  }, [contractorId])

  return (
    <Fade>
      <Card title={t("contracts")}>
        <Spin spinning={loading} size='large'>
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('contracts')} key="1">
              <Form
                {...layout}
                form={mainForm}
                id="mainForm"
                onFinish={onMainFormFinish}
              >
                <Row gutter={[15, 0]}>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("treasContract")}
                      name="TreasContractID"
                      rules={[
                        {
                          required: true,
                          message: t("inputValidData"),
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} placeholder={t("treasContract")} />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("contractNumber")}
                      name="Code"
                      rules={[
                        {
                          required: true,
                          message: t("inputValidData"),
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} placeholder={t("contractNumber")} />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("sum")}
                    >
                      {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(sum)}
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("dateOfContract")}
                      name="DateOfContract"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: "100%" }}
                        placeholder={t("dateOfContract")}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("dateOfStart")}
                      name="DateOfStart"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: "100%" }}
                        placeholder={t("dateOfStart")}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("dateOfEnd")}
                      name="DateOfEnd"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: "100%" }}
                        placeholder={t("dateOfEnd")}
                      />
                    </Form.Item>
                  </Col>

                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("prepayment")}
                      name="Prepayment"
                      rules={[
                        {
                          required: true,
                          message: t("inputValidData"),
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} placeholder={t("prepayment")} />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("isBudgetOrg")}
                      name="IsBudgetOrg"
                      valuePropName='checked'
                    >
                      <Switch onChange={(val) => setIsBudgetOrg(val)} />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("valueAddedTax")}
                      name="ValueAddedTax"
                      rules={[
                        {
                          required: true,
                          message: t('pleaseSelect'),
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder={t("valueAddedTax")}
                        style={{ width: "100%" }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        decimalSeparator=','
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("currency")}
                      name="CurrencyID"
                      rules={[
                        {
                          required: true,
                          message: t('pleaseSelect'),
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        placeholder={t("currency")}
                        onChange={currencyChangeHandler}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {currencyList.map((item) => (
                          <Option key={item.ID} value={item.ID}>
                            {item.Code}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("currencyRate")}
                    >
                      {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(currencyRate)}
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("currencySum")}
                    >
                      {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(currencySum)}
                    </Form.Item>
                  </Col>

                  <Col xl={12} lg={12}>
                    <Form.Item
                      label={t("orgSettAcc")}
                      name="OrganizationsSettlementAccountID"
                      rules={[
                        {
                          required: true,
                          message: t('pleaseSelect'),
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        placeholder={t("orgSettAcc")}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {orgSettAccList.map((item) => (
                          <Option key={item.ID} value={item.ID}>
                            {item.Code}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12}>
                    <Form.Item
                      label={t("contractTypeInfo")}
                      name="ContractTypeInfoID"
                      rules={[
                        {
                          required: true,
                          message: t('pleaseSelect'),
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        placeholder={t("contractTypeInfo")}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {contractTypeInfoList.map((item) => (
                          <Option key={item.ID} value={item.ID}>
                            {item.Name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xl={12} lg={12}>
                    <Form.Item
                      label={t("contractorPayeeName")}
                      name="ContractorPayeeName"
                      rules={[
                        {
                          required: true,
                          message: t("Please input valid"),
                        },
                      ]}
                    >
                      <Input
                        disabled
                        placeholder={t("contractorPayeeName")}
                        addonAfter={<Button
                          type="primary"
                          className='addon-after-btn'
                          icon={<SearchOutlined />}
                          onClick={() => setContractPayerModalVisible(true)}
                        />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12}>
                    {isBudgetOrg ?
                      <Form.Item
                        label={t("budgetSettlementAccountCode")}
                        name="BudgetSettlementAccountCode"
                        rules={[
                          {
                            required: true,
                            message: t("Please input valid"),
                          },
                        ]}
                      >
                        <Input placeholder={t("budgetSettlementAccountCode")} />
                      </Form.Item> :
                      <div className={classes['flex-end']}>
                        <Form.Item
                          label={t("contractorsSettlementAccount")}
                          name="ContractorsSettlementAccountID"
                          style={{ width: '100%' }}
                          rules={[
                            {
                              required: true,
                              message: t("Please input valid"),
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder={t("contractorsSettlementAccount")}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {contractorsSettAccList.map((item) => (
                              <Option key={item.ID} value={item.ID}>
                                {item.Code}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type='primary'
                            disabled={!contractorId}
                            onClick={() => {
                              setAccountModalVisible(true);
                            }}
                          >
                            <i className="fa fa-plus" aria-hidden="true" />
                          </Button>
                        </Form.Item>
                      </div>
                    }
                  </Col>

                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("detailedCheck")}
                      name="DetailedCheck"
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("forCorrection")}
                      name="ForCorrection"
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("ticket")}
                      name="Ticket"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: t("Please input valid"),
                    //   },
                    // ]}
                    >
                      <Input placeholder={t("ticket")} onBlur={(e) => setTicket(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col xl={12} lg={12}>
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
            </TabPane>
            <TabPane tab={t('paymentSchedule')} key="2">
              <PaymentScheduleTable tableData={paymentScheduleTableData} setData={setPaymentScheduleTableData} />
            </TabPane>
            <TabPane tab={t('contractSpec')} key="3">
              <ContractSpec ticket={ticket} mainForm={mainForm} tableData={contractSpecTableData} setData={setContractSpecTableData} />
            </TabPane>
          </Tabs>

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
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={contractPayerModalVisible}
        timeout={300}
      >
        <ContractPayerModal
          visible={contractPayerModalVisible}
          onCancel={() => setContractPayerModalVisible(false)}
          onSelect={selectContractPayerHandler}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={accountModalVisible}
        timeout={300}
      >
        <AccountModal
          visible={accountModalVisible}
          onCancel={() => setAccountModalVisible(false)}
          onSave={addSettAccHandler}
          contractorId={contractorId}
        />
      </CSSTransition>
    </Fade>
  );
};

export default UpdateContract;