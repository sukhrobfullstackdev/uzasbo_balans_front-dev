import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import moment from "moment";

import HelperServices from '../../../../../services/Helper/helper.services';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';
import ContractorSubCountModal from './components/ContractorSubCountModal';
import PaymentOrderTable from './components/PaymentOrderTable';
import PaymentRequestServices from '../../../../../services/Documents/PaymentDocuments/PaymentRequest/PaymentRequest.services';
import AccountDetailsModal from './components/AccountDetailsModal';

const { Option } = Select;
const { TextArea } = Input;

const UpdatePaymentRequest = (props) => {
    // console.log(props.location.search);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [inPayment, setInPayment] = useState([]);
    const [moneyMeansMovementList, setMoneyMeansMovementList] = useState([]);
    const [allowedTransactionList, setAllowedTransactionList] = useState([]);
    const [subAccDBList, setSubAccDBList] = useState([]);
    const [subAccCRList, setSubAccCRList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [contractorAccountList, setContractorAccountList] = useState([]);
    const [itemOfExpenseList, setItemOfExpenseList] = useState([]);
    const [transactionSubCountInfo, setTransactionSubCountInfo] = useState({});

    const [contractorSubCountModal, setContractorSubCountModal] = useState(false);
    const [contractorSubCountParams, setContractorSubCountParams] = useState(null);
    const [accountDetailsModal, setAccountDetailsModal] = useState(false);
    const [accountDetailsParams, setAccountDetailsParams] = useState(null);

    const [Tables, setTables] = useState([]);
    const [disabledTables, setDisabledTables] = useState(false);
    const [subaccdbiscurrency, setSubaccdbiscurrency] = useState(false);
    const [subacccriscurrency, setSubacccriscurrency] = useState(false);
    const [lastcurrencycourse, setLastcurrencycourse] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [inPayment, moneyMeansMovementList, currencyList, itemOfExpenseList] = await Promise.all([
                PaymentRequestServices.getById(
                    props.match.params.id ? [`${props.location.search}&id=${props.match.params.id}`] : props.location.search
                ),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getCurrencyList(),
                HelperServices.getItemOfExpenseList(),
            ]);

            const [allowedTransactionList, subAccDBList, subAccCRList, contractorAccountList, transactionSubCountInfo] = await Promise.all([
                HelperServices.getAllowedTransactionInPaymentList({
                    TableID: inPayment.data.TableID, OrganizationAccountID: inPayment.data.OrganizationsSettlementAccountID,
                }),
                HelperServices.getInpaymentSubAccDBList({ OrganizationsSettlementAccountID: inPayment.data.OrganizationsSettlementAccountID }),
                HelperServices.getInpaymentSubAccCrList({ AllowedTransactionID: inPayment.data.AllowedTransactionID }),
                HelperServices.getContractorAccountList(inPayment.data.ContractorPayeeID),
                HelperServices.getTransactionSubCountInfo(inPayment.data.AllowedTransactionID),
            ]);

            console.log(inPayment.data);
            setInPayment(inPayment.data);
            inPayment.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(inPayment.data.Tables);
            if (inPayment.data.Tables.length > 0) {
                setDisabledTables(true);
            };

            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setAllowedTransactionList(allowedTransactionList.data);
            setSubAccDBList(subAccDBList.data);
            setSubAccCRList(subAccCRList.data);
            setCurrencyList(currencyList.data.rows);
            setContractorAccountList(contractorAccountList.data);
            setItemOfExpenseList(itemOfExpenseList.data);
            setTransactionSubCountInfo(transactionSubCountInfo.data)

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...inPayment.data,
                    Date: inPayment.data.Date ? moment(inPayment.data.Date, 'DD.MM.YYYY') : null,
                });
                selectedMoneyMeansMovementChange(subAccDBList, subAccCRList)
            } else {
                mainForm.setFieldsValue({
                    ...inPayment.data,
                    AllowedTransactionID: inPayment.data.AllowedTransactionID === 0 ? null : inPayment.data.AllowedTransactionID,
                    SubAccDbID: inPayment.data.SubAccDbID === 0 ? null : inPayment.data.SubAccDbID,
                    ContractorsSettlementAccountID: inPayment.data.ContractorsSettlementAccountID === 0 ? null : inPayment.data.ContractorsSettlementAccountID,
                    MoneyMeansMovementID: inPayment.data.MoneyMeansMovementID === 0 ? null : inPayment.data.MoneyMeansMovementID,
                    Date: inPayment.data.Date ? moment(inPayment.data.Date, 'DD.MM.YYYY') : null,
                });
            }
            allowedTransactionChange(inPayment.data.AllowedTransactionID)
            contractorChange()
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const allowedTransactionChange = (id) => {
        // console.log(id);
        const fetchData = async () => {
            const [transactionSubCountInfo, moneyMeansMovementList, subAccDBList, subAccCRList] = await Promise.all([
                HelperServices.getTransactionSubCountInfo(id),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getTMZSubAccDBList(id),
                HelperServices.getInpaymentSubAccCrList({ AllowedTransactionID: id }),
            ]);
            setTransactionSubCountInfo(transactionSubCountInfo.data)
            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setSubAccDBList(subAccDBList.data)
            setSubAccCRList(subAccCRList.data)

            selectedMoneyMeansMovementChange(subAccDBList, subAccCRList)
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    };

    const contractorChange = () => {
        const fetchData = async () => {
            const [contractorAccountList] = await Promise.all([
                HelperServices.getContractorAccountList(mainForm.getFieldValue(['ContractorPayeeID'])),
            ]);
            setContractorAccountList(contractorAccountList.data)
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    }

    const onMainFormFinish = (values) => {
        values.AcademicYearStart = values.AcademicYearStart?.format("YYYY");
        values.AcademicYearEnd = values.AcademicYearEnd?.format("YYYY");
        values.Date = values.Date?.format("DD.MM.YYYY");
        inPayment.RequestReceivingCashID = null;
        inPayment.PayrollSheetID = null;
        if (inPayment.FinanceYear === 0) {
            inPayment.FinanceYear = values.Date.substring(6, 10);
        }
        console.log({
            ...inPayment, ...values,
            Tables: Tables,
        });
        setLoader(true);
        PaymentRequestServices.update({
            ...inPayment, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/inPayment`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const openContractorPayeeModal = (params) => {
        setContractorSubCountParams(params);
        setContractorSubCountModal(true);
    };

    const openAccountDetailsModal = (params) => {
        setAccountDetailsParams(params);
        setAccountDetailsModal(true);
    };

    const refreshContractorAccountList = () => {
        HelperServices.getContractorAccountList(mainForm.getFieldValue(['ContractorPayeeID']))
            .then(res => {
                setContractorAccountList(res.data);
            }).catch(err => {
                Notification('error', err)
            })
    }

    const onSelect = (data) => {
        console.log(data);
        mainForm.setFieldsValue({
            [`${data.id}`]: data.ID,
            [`${data.Name}`]: data.NameValue,
        });
    };

    const editTableData = (data) => {
        let totalsum = 0;
        let totalcur = 0;
        data.map(data => {
            if (data.Status !== 3) {
                totalsum += data.Sum
                totalcur += data.CurrencySum
            }
            return null;
        })
        mainForm.setFieldsValue({
            [`Sum`]: totalsum,
            [`CurrencySum`]: totalcur,
        });
        setTables(data);
    };

    const selectedMoneyMeansMovementChange = useCallback((listDB, listCR) => {
        let currentDBList = listDB?.data ? listDB.data : subAccDBList;
        let currentCRList = listCR?.data ? listCR.data : subAccCRList;

        let selectedDB = currentDBList.find((db) => db.ID === mainForm.getFieldValue(['SubAccDbID']))
        setSubaccdbiscurrency(selectedDB?.IsCurrency)

        let selectedCR = currentCRList.find((db) => db.ID === mainForm.getFieldValue(['SubAccCrID']))
        setSubacccriscurrency(selectedCR?.IsCurrency)
    }, [subAccDBList, subAccCRList, mainForm])

    const courseChange = (id) => {
        HelperServices.getLastCurrencyCourse({ CurrencyID: id, Date: inPayment.Date })
            .then(res => {
                setLastcurrencycourse(res.data);
                mainForm.setFieldsValue({
                    [`CurrencySum`]: mainForm.getFieldValue(['Sum']) / res.data,
                });
            }).catch(err => {
                Notification('error', err)
            })
    }

    return (
        <Card title={t("PaymentRequest")}>
            <Spin spinning={loader} size='large'>
                <Form
                    // {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                    initialValues={{
                    }}
                >
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('Number')}
                            </div>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                // label={t('Number')}
                                name="Number"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber disabled={disabledTables}
                                    style={{ width: '100%' }}
                                    placeholder={t("Number")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}></Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("Date")}
                            </div>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                // label={t("Date")}
                                name="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker disabled={disabledTables}
                                    format="DD.MM.YYYY" style={{ width: '100%' }}
                                    placeholder={t('Date')} className={'addonInput'}
                                // onChange={onChangeDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}></Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("allowedTransaction")}
                            </div>
                        </Col>
                        <Col md={16}>
                            <Form.Item
                                // label={t("AllowedTransactionID")}
                                name="AllowedTransactionID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select disabled={disabledTables}
                                    placeholder={t("Select from list")}
                                    allowClear showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={allowedTransactionChange}
                                >
                                    {allowedTransactionList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("DbSubAcc")}
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Item
                                // label={t("DbSubAcc")}
                                name="SubAccDbID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                >
                                    {subAccDBList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("CrSubAcc")}
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Item
                                // label={t("CrSubAcc")}
                                name="SubAccCrID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                >
                                    {subAccCRList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("Sum")}
                            </div>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                // label={t('Sum')}
                                name="Sum"
                            >
                                <InputNumber readOnly
                                    bordered={false}
                                    formatter={value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
                                    style={{ width: '100%' }}
                                    placeholder={t("Sum")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[15, 0]}>
                        {(
                            subaccdbiscurrency || subacccriscurrency
                        ) && (
                                <>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("currency")}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Item
                                            // label={t('Currency')}
                                            name="CurrencyID"
                                        >
                                            <Select
                                                placeholder={t("Select from list")}
                                                allowClear
                                                onChange={courseChange}
                                            >
                                                {currencyList?.map((item) => (
                                                    <Option key={item.ID} value={item.ID}>
                                                        {item.Code}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col md={3}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("Cource")}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <InputNumber readOnly
                                            bordered={false}
                                            value={lastcurrencycourse}
                                            formatter={value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
                                            style={{ width: '100%' }}
                                            placeholder={t("Cource")}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("CurrencySum")}
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Item
                                            // label={t('Sum')}
                                            name="CurrencySum"
                                        >
                                            <InputNumber readOnly
                                                bordered={false}
                                                formatter={value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
                                                style={{ width: '100%' }}
                                                placeholder={t("CurrencySum")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </>
                            )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("MoneyMeansMovement")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("MoneyMeansMovement")}
                                name="MoneyMeansMovementID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={selectedMoneyMeansMovementChange}
                                >
                                    {moneyMeansMovementList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("orgSettAcc")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("contractorsSettlementAccount")}
                                name="OrganizationAccountCode"
                                style={{ width: "100%" }}
                            >
                                <Input
                                    style={{ width: '100%' }} disabled
                                    placeholder={t("OrganizationAccountCode")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}></Col>
                    </Row>
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("Payee")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("Payee")}
                                name="ContractorPayeeName"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    className={'addonInput'}
                                    placeholder={t("Select from list")}
                                    disabled
                                    addonAfter={
                                        <Button disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openContractorPayeeModal({
                                                Name: 'ContractorPayeeName',
                                                ID: 'ContractorPayeeID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("ContractorPayeeID")}
                                name="ContractorPayeeID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("contractorsSettlementAccount")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Form.Item
                                    // label={t("contractorsSettlementAccount")}
                                    name="ContractorsSettlementAccountID"
                                    style={{ width: "calc(100% - 28px)" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}>
                                    <Select
                                        placeholder={t("Select from list")}
                                        allowClear showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {contractorAccountList.map((taxItem) => (
                                            <Option key={taxItem.ID} value={taxItem.ID}>
                                                {taxItem.Code}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    icon={<i className="feather icon-plus" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', width: "28px" }}
                                    onClick={() => openAccountDetailsModal({
                                        ContractorPayeeID: mainForm.getFieldValue(['ContractorPayeeID']),
                                        // TableID: 248, //children
                                        // ColumnName: 'ChildrenGroupTypeID',
                                    })}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("PaymentDetails")}
                            </div>
                        </Col>
                        <Col md={16}>
                            <Form.Item
                                // label={t('PaymentDetails')}
                                name="PaymentDetails"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <TextArea rows={3} placeholder={t('PaymentDetails')} maxLength={450} />
                            </Form.Item>
                        </Col>
                        <Col md={4}></Col>
                    </Row>
                    <PaymentOrderTable
                        data={Tables}
                        tableHeaders={transactionSubCountInfo.DbSubCountInfo}
                        editTableData={editTableData}
                        itemOfExpenseList={itemOfExpenseList}
                        setDisabledTables={setDisabledTables}
                        mainForm={mainForm}
                        currrrr={(subaccdbiscurrency || subacccriscurrency)}
                        lastcurrencycourse={lastcurrencycourse}
                    />
                </Form>

                <Space size='middle' className='btns-wrapper'>
                    <Button
                        type="default"
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

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={contractorSubCountModal}
                timeout={300}
            >
                <ContractorSubCountModal
                    visible={contractorSubCountModal}
                    params={contractorSubCountParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setContractorSubCountModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={accountDetailsModal}
                timeout={300}
            >
                <AccountDetailsModal
                    visible={accountDetailsModal}
                    params={accountDetailsParams}
                    onSelect={onSelect}
                    fetch={refreshContractorAccountList}
                    onCancel={() => {
                        setAccountDetailsModal(false);
                    }}
                />
            </CSSTransition>

        </Card>
    )
}

export default React.memo(UpdatePaymentRequest);