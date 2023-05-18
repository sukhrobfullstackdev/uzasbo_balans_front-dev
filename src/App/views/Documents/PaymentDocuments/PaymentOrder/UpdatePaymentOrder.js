import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from "moment";

import HelperServices from '../../../../../services/Helper/helper.services';
import Card from "../../../../components/MainCard";
import { CSSTransition } from 'react-transition-group';
import { Notification } from '../../../../../helpers/notifications';
import PaymentOrderServices from '../../../../../services/Documents/PaymentDocuments/PaymentOrder/PaymentOrder.services';
import ContractorSubCountModal from './components/ContractorSubCountModal';
import PaymentOrderTable from './components/PaymentOrderTable';
import AccountDetailsModal from './components/AccountDetailsModal';
import CommonModal from './components/CommonModal';

const { Option } = Select;
const { TextArea } = Input;

const UpdatePaymentOrder = (props) => {
    // console.log(props.location.search);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [paymentOrder, setPaymentOrder] = useState([]);
    const [moneyMeansMovementList, setMoneyMeansMovementList] = useState([]);
    const [allowedTransactionList, setAllowedTransactionList] = useState([]);
    const [subAccDBList, setSubAccDBList] = useState([]);
    const [subAccCRList, setSubAccCRList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [contractorAccountList, setContractorAccountList] = useState([]);
    const [signList1, setSignList1] = useState([]);
    const [signList2, setSignList2] = useState([]);
    const [itemOfExpenseList, setItemOfExpenseList] = useState([]);
    const [transactionSubCountInfo, setTransactionSubCountInfo] = useState({});

    const [contractorSubCountModal, setContractorSubCountModal] = useState(false);
    const [contractorSubCountParams, setContractorSubCountParams] = useState(null);
    const [accountDetailsModal, setAccountDetailsModal] = useState(false);
    const [accountDetailsParams, setAccountDetailsParams] = useState(null);
    const [commonModal, setCommonModal] = useState(false);
    const [commonParams, setCommonParams] = useState(null);

    const [Tables, setTables] = useState([]);
    const [disabledTables, setDisabledTables] = useState(false);
    const [subaccdbiscurrency, setSubaccdbiscurrency] = useState(false);
    const [subacccriscurrency, setSubacccriscurrency] = useState(false);
    const [lastcurrencycourse, setLastcurrencycourse] = useState(0);
    const [showpayrollsheet, setShowpayrollsheet] = useState(false);
    const [showpayrollsheetcash, setShowpayrollsheetcash] = useState(false);
    const [requestreceivingcashtype, setRequestreceivingcashtype] = useState(0);
    const [constat, setConstat] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [debitAccID, setDebitAccID] = useState(0);
    const [MMMKindID, setMMMKindID] = useState(0);
    const [isInvoice, setIsInvoice] = useState(0);
    const [subAccountCode, setSubAccountCode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [paymentOrder, moneyMeansMovementList, currencyList, signList1, signList2, itemOfExpenseList] = await Promise.all([
                PaymentOrderServices.getById(
                    props.match.params.id ? [`${props.location.search}&id=${props.match.params.id}`] : props.location.search
                ),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getCurrencyList(),
                HelperServices.getOrgSignList(1),
                HelperServices.getOrgSignList(2),
                HelperServices.getItemOfExpenseList(),
            ]);

            const [allowedTransactionList, subAccDBList, subAccCRList, contractorAccountList, transactionSubCountInfo] = await Promise.all([
                HelperServices.getAllowedTransactionList({
                    TableID: paymentOrder.data.TableID, OrganizationAccountID: paymentOrder.data.OrganizationsSettlementAccountID,
                }),
                HelperServices.getSubAccDBList({ AllowedTransactionID: paymentOrder.data.AllowedTransactionID }),
                HelperServices.getSubAccCRList({ OrganizationsSettlementAccountID: paymentOrder.data.OrganizationsSettlementAccountID }),
                HelperServices.getContractorAccountList(paymentOrder.data.ContractorPayeeID),
                HelperServices.getTransactionSubCountInfo(paymentOrder.data.AllowedTransactionID),
            ]);

            console.log(paymentOrder.data);
            setPaymentOrder(paymentOrder.data);
            paymentOrder.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(paymentOrder.data.Tables);
            if (paymentOrder.data.Tables.length > 0) {
                setDisabledTables(true);
            };

            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setAllowedTransactionList(allowedTransactionList.data);
            setSubAccDBList(subAccDBList.data);
            setSubAccCRList(subAccCRList.data);
            setCurrencyList(currencyList.data.rows);
            setContractorAccountList(contractorAccountList.data);
            setSignList1(signList1.data);
            setSignList2(signList2.data);
            setItemOfExpenseList(itemOfExpenseList.data);
            setTransactionSubCountInfo(transactionSubCountInfo.data)

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...paymentOrder.data,
                    Date: paymentOrder.data.Date ? moment(paymentOrder.data.Date, 'DD.MM.YYYY') : null,
                });
                selectedSubAccDBChange(paymentOrder.data.SubAccDbID, subAccDBList)
                selectedMoneyMeansMovementChange(paymentOrder.data.MoneyMeansMovementID, moneyMeansMovementList, subAccDBList, subAccCRList)
                invoiceChange(paymentOrder.data.IncomeSettlementAccount)

                let accountcode = ''
                setShowpayrollsheet(false)
                let row = contractorAccountList.data.find(a => a.ID === paymentOrder.data.ContractorsSettlementAccountID)
                accountcode = row.Code
                if (paymentOrder.data.PayrollSheetID > 0 && (accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('22628') || accountcode.startsWith('23106')) && (paymentOrder.data.OrganizationIsFullBudget === true)) {
                    setShowpayrollsheet(true);
                }

            } else {
                mainForm.setFieldsValue({
                    ...paymentOrder.data,
                    AllowedTransactionID: paymentOrder.data.AllowedTransactionID === 0 ? null : paymentOrder.data.AllowedTransactionID,
                    SubAccDbID: paymentOrder.data.SubAccDbID === 0 ? null : paymentOrder.data.SubAccDbID,
                    ContractorsSettlementAccountID: paymentOrder.data.ContractorsSettlementAccountID === 0 ? null : paymentOrder.data.ContractorsSettlementAccountID,
                    MoneyMeansMovementID: paymentOrder.data.MoneyMeansMovementID === 0 ? null : paymentOrder.data.MoneyMeansMovementID,
                    Date: paymentOrder.data.Date ? moment(paymentOrder.data.Date, 'DD.MM.YYYY') : null,
                    FirstSign: signList1.data.length === 1 ? signList1.data[0].FIO : null,
                    SecondSign: signList2.data.length === 1 ? signList2.data[0].FIO : null,
                });
            }
            allowedTransactionChange(paymentOrder.data.AllowedTransactionID, paymentOrder.data)
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const allowedTransactionChange = (id, paymOrd) => {
        let orgSettAcc = paymOrd?.OrganizationsSettlementAccountID ? paymOrd.OrganizationsSettlementAccountID : paymentOrder.OrganizationsSettlementAccountID;
        // console.log(id, orgSettAcc);
        const fetchData = async () => {
            const [transactionSubCountInfo, moneyMeansMovementList, subAccDBList, subAccCRList] = await Promise.all([
                HelperServices.getTransactionSubCountInfo(id),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getSubAccDBList({ AllowedTransactionID: id }),
                HelperServices.getSubAccCRList({ OrganizationsSettlementAccountID: orgSettAcc }),
            ]);
            setTransactionSubCountInfo(transactionSubCountInfo.data)
            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setSubAccDBList(subAccDBList.data)
            setSubAccCRList(subAccCRList.data)

            // console.log(transactionSubCountInfo.data.DbSubCountInfo);
            if (transactionSubCountInfo.data.DbSubCountInfo.SubCount2ID === 11) {
                setShowRequest(false);
                mainForm.setFieldsValue({
                    [`RequestReceivingCashID`]: null,
                    [`PayrollSheetID`]: null,
                });
            } else {
                setShowRequest(true);
            }

            selectedMoneyMeansMovementChange(mainForm.getFieldValue(['MoneyMeansMovementID']), moneyMeansMovementList, subAccDBList, subAccCRList)
        }

        fetchData().catch(err => {
            Notification('error', err)
        });

        if (id === 25 || id === 34 || id === 68 || id === 148 || id === 149 || id === 150) {
            setShowpayrollsheetcash(true);
        }
    };

    const onMainFormFinish = (values) => {
        values.AcademicYearStart = values.AcademicYearStart?.format("YYYY");
        values.AcademicYearEnd = values.AcademicYearEnd?.format("YYYY");
        values.Date = values.Date?.format("DD.MM.YYYY");
        paymentOrder.RequestReceivingCashID = null;
        paymentOrder.PayrollSheetID = null;
        paymentOrder.PaymentTypeCode = null;
        paymentOrder.PayrollSheetCashID = null;
        paymentOrder.IncomeSettlementAccount = null;
        paymentOrder.Invoice = null;
        if (paymentOrder.FinanceYear === 0) {
            paymentOrder.FinanceYear = values.Date.substring(6, 10);
        }
        console.log({
            ...paymentOrder, ...values,
            Tables: Tables,
        });
        setLoader(true);
        PaymentOrderServices.update({
            ...paymentOrder, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/PaymentOrder`);
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

    const openCommonModal = (params) => {
        setCommonParams(params);
        setCommonModal(true);
    }

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

    const onSelectCommon = (data) => {
        console.log(data);
        mainForm.setFieldsValue({
            [`${data.id}`]: data.ID,
            [`${data.Name}`]: data.NameValue,
        });
        if (data.TypeValue) {
            // console.log(data.TypeValue);
            setRequestreceivingcashtype(data.TypeValue)
            calculationPaymentTypeCode(data.TypeValue)
        }
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

    const selectedSubAccDBChange = useCallback((id, list) => {
        let currentList = list?.data ? list.data : subAccDBList;
        let selected = currentList?.find((db) => db.ID === id)
        setDebitAccID(selected?.AccID)
    }, [subAccDBList])

    const selectedMoneyMeansMovementChange = useCallback((id, listMMM, listDB, listCR) => {
        let currentMMMList = listMMM?.data ? listMMM.data : moneyMeansMovementList;
        let currentDBList = listDB?.data ? listDB.data : subAccDBList;
        let currentCRList = listCR?.data ? listCR.data : subAccCRList;

        let selectedMMM = currentMMMList.find((mmm) => mmm.ID === id)
        setMMMKindID(selectedMMM?.MoneyMeansMovementsKindID)

        let selectedDB = currentDBList.find((db) => db.ID === mainForm.getFieldValue(['SubAccDbID']))
        console.log(currentDBList, id);
        console.log(selectedDB);
        setSubaccdbiscurrency(selectedDB?.IsCurrency)

        let selectedCR = currentCRList.find((db) => db.ID === mainForm.getFieldValue(['SubAccCrID']))
        setSubacccriscurrency(selectedCR?.IsCurrency)
    }, [moneyMeansMovementList, subAccDBList, subAccCRList, mainForm])

    const invoiceChange = useCallback((e) => {
        let code = e?.target ? e.target.value : e
        // console.log(MMMKindID);
        if (code !== null && MMMKindID === 2) {
            let insett = code.substring(15, 22);
            let beginsett = code.substring(0, 4);
            if (beginsett === '4014' && (insett === '3422957' || insett === '3422956' || insett === '3422103' || insett === '3422115'))
                setIsInvoice(1);
            else {
                setIsInvoice(0);
                mainForm.setFieldsValue({
                    [`Invoice`]: '',
                });
            }
        } else {
            setIsInvoice(0);
            mainForm.setFieldsValue({
                [`Invoice`]: '',
            });
        }

    }, [MMMKindID, mainForm])

    const calculationPaymentTypeCode = (requestreceivingcashtype) => {
        if (mainForm.getFieldValue(['ContractorsSettlementAccountID']) === 2745) {
            mainForm.setFieldsValue({
                [`PaymentTypeCode`]: '08102',
            });
        } else if (showRequest && paymentOrder.OrganizationState === 1
            && paymentOrder.OrganizationsSettlementAccountOutOfBalance === false
            && debitAccID !== 45 && MMMKindID === 2
            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
            && mainForm.getFieldValue(['OrganizationAccountCode'])?.length !== 20
            && mainForm.getFieldValue(['ContractorsSettlementAccountID']) !== 2745
        ) {
            if (requestreceivingcashtype === 1) {
                mainForm.setFieldsValue({
                    [`PaymentTypeCode`]: '07110',
                });
            }
            if (requestreceivingcashtype === 2) {
                mainForm.setFieldsValue({
                    [`PaymentTypeCode`]: '07120',
                });
            }
            if (requestreceivingcashtype === 3 || requestreceivingcashtype === 4) {
                mainForm.setFieldsValue({
                    [`PaymentTypeCode`]: '07210',
                });
            }
        } else {
            mainForm.setFieldsValue({
                [`IncomeSettlementAccount`]: null,
            });
        }
        setIsInvoice(0)
        if (mainForm.getFieldValue(['ContractorsSettlementAccountID']) !== 2745) {
            mainForm.setFieldsValue({
                [`Invoice`]: '',
            });
        }
    }

    const contractorAccountChange = (e) => {
        let accountcode = ''
        setShowpayrollsheet(false)
        let row = contractorAccountList.find(a => a.ID === e)
        if (row) {
            accountcode = row.Code;
            setSubAccountCode(accountcode);
        }
        accountcode = row.Code
        if (accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('23106') || accountcode.startsWith('22628') || accountcode.startsWith('23110')) {
            setShowpayrollsheet(true);
        }
        setConstat(accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('23106') || accountcode.startsWith('23110'))
        calculationPaymentTypeCode(requestreceivingcashtype)
    }

    const courseChange = (id) => {
        HelperServices.getLastCurrencyCourse({ CurrencyID: id, Date: paymentOrder.Date })
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
        <Card title={t("PaymentOrder")}>
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
                        <Col md={3}>
                            <Form.Item
                                // label={t('Number')}
                                name="Number"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder={t("Number")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={10}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("Date")}
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Item
                                // label={t("Date")}
                                name="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker
                                    format="DD.MM.YYYY" style={{ width: '100%' }}
                                    placeholder={t('Date')} className={'addonInput'}
                                // onChange={onChangeDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                        </Col>
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
                                    onSelect={selectedSubAccDBChange}
                                >
                                    {subAccDBList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={10}>
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
                                        onSelect={contractorAccountChange}
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
                        <Col md={4}></Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("orgSettAcc")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t('orgSettAcc')}
                                name="OrganizationAccountCode"
                            >
                                <Input
                                    style={{ width: '100%' }} disabled
                                    placeholder={t("OrganizationAccountCode")}
                                />
                            </Form.Item>
                        </Col>
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
                        <Col md={4}></Col>
                    </Row>
                    <Row gutter={[15, 0]}>
                        {(MMMKindID === 2 && debitAccID !== 45 && showRequest) ? (
                            <>
                                {(
                                    paymentOrder.OrganizationState === 1
                                    && paymentOrder.OrganizationsSettlementAccountOutOfBalance === false
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.length !== 20
                                ) && (
                                        <>
                                            <Col md={4}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                                    {t("Request")}
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Item
                                                    // label={t("Request")}
                                                    name="RequestReceivingCashID"
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
                                                            <Button
                                                                style={{ border: 'none', background: 'transparent', padding: '0' }}
                                                                onClick={() => openCommonModal({
                                                                    Name: 'RequestReceivingCashName',
                                                                    ID: 'RequestReceivingCashID',
                                                                    Type: 'ReqRecCashTypeID',
                                                                    Endpoint: 'GetRequestReceivingCashList',
                                                                    params: { SettlementAccountID: paymentOrder.OrganizationsSettlementAccountID },
                                                                })}
                                                            >
                                                                <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                                            </Button>
                                                        }
                                                    />
                                                </Form.Item>
                                                {/* <Form.Item
                                                    label={t("RequestReceivingCashName")}
                                                    name="RequestReceivingCashID"
                                                    hidden={true}
                                                >
                                                    <Input />
                                                </Form.Item> */}
                                            </Col>
                                        </>
                                    )}
                            </>
                        ) : null}
                        {(
                            paymentOrder.OrganizationState === 1
                            && showpayrollsheet
                            && paymentOrder.OrganizationIsFullBudget === true
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.length !== 20
                        ) && (
                                <>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("payrollSheet")}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Item
                                            // label={t("PayrollSheet")}
                                            name="PayrollSheetID"
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
                                                    <Button
                                                        style={{ border: 'none', background: 'transparent', padding: '0' }}
                                                        onClick={() => openCommonModal({
                                                            Name: 'PayrollSheetName',
                                                            ID: 'PayrollSheetID',
                                                            Endpoint: constat ? 'GetPlasticCardSheetList' : 'GetINPSRegistryList',
                                                            params: { SettlementAccountID: paymentOrder.OrganizationsSettlementAccountID },
                                                        })}
                                                    >
                                                        <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                                    </Button>
                                                }
                                            />
                                        </Form.Item>
                                        {/* <Form.Item
                                            label={t("PayrollSheetName")}
                                            name="PayrollSheetID"
                                            hidden={true}
                                        >
                                            <Input />
                                        </Form.Item> */}
                                    </Col>
                                    <Col md={4}></Col>
                                </>
                            )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        {(
                            showRequest && paymentOrder.OrganizationState === 1
                            && paymentOrder.OrganizationsSettlementAccountOutOfBalance === false
                            && debitAccID !== 45 && MMMKindID === 2
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.length !== 20
                            && mainForm.getFieldValue(['ContractorsSettlementAccountID']) !== 2745
                        ) && (
                                <>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("PaymentTypeCode")}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Item
                                            // label={t('PaymentTypeCode')}
                                            name="PaymentTypeCode"
                                            rules={[
                                                {
                                                    required: true,
                                                    pattern: /^\d+$/,
                                                    message: t("Please input valid"),
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled maxLength={5}
                                                style={{ width: '100%' }}
                                                placeholder={t("PaymentTypeCode")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </>
                            )}
                        {(
                            MMMKindID === 2
                            && showpayrollsheetcash
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.length !== 20
                        ) && (
                                <>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("PayrollSheetCash")}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Item
                                            // label={t("PayrollSheetCash")}
                                            name="PayrollSheetCashID"
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
                                                    <Button
                                                        style={{ border: 'none', background: 'transparent', padding: '0' }}
                                                        onClick={() => openCommonModal({
                                                            Name: 'PayrollSheetCashName',
                                                            ID: 'PayrollSheetCashID',
                                                            Endpoint: 'GetPlasticCardSheetCashList',
                                                            params: { SettlementAccountID: paymentOrder.OrganizationsSettlementAccountID },
                                                        })}
                                                    >
                                                        <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                                    </Button>
                                                }
                                            />
                                        </Form.Item>
                                        {/* <Form.Item
                                            label={t("PayrollSheetCashName")}
                                            name="PayrollSheetCashID"
                                            hidden={true}
                                        >
                                            <Input />
                                        </Form.Item> */}
                                    </Col>
                                </>
                            )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        {!showRequest && (
                            <>
                                <Col md={4}></Col>
                                <Col md={6}>
                                    <Form.Item
                                        // label="&zwnj;"
                                        name="IsPrePayment"
                                        valuePropName="checked"
                                    >
                                        <Checkbox >
                                            {t("IsPrePayment")}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col md={4}></Col>
                            </>
                        )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        {mainForm.getFieldValue(['ContractorsSettlementAccountID']) === 2745 && (
                            <>
                                <Col md={4}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                        {t("PaymentTypeCode")}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        // label={t('PaymentTypeCode')}
                                        name="PaymentTypeCode"
                                        rules={[
                                            {
                                                required: true,
                                                pattern: /^\d+$/,
                                                message: t("Please input valid"),
                                            },
                                        ]}
                                    >
                                        <Input
                                            maxLength={5}
                                            style={{ width: '100%' }}
                                            placeholder={t("PaymentTypeCode")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col md={4}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                        {t("IncomeSettlementAccount")}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        // label={t('IncomeSettlementAccount')}
                                        name="IncomeSettlementAccount"
                                        rules={[
                                            {
                                                required: true,
                                                pattern: /^\d+$/,
                                                message: t("Please input valid"),
                                            },
                                        ]}
                                    >
                                        <Input
                                            maxLength={25}
                                            onChange={invoiceChange}
                                            style={{ width: '100%' }}
                                            placeholder={t("IncomeSettlementAccount")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col md={4}></Col>
                                {isInvoice === 1 && (
                                    <>
                                        <Col md={4}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                                {t("Invoice№")}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Item
                                                // label={t('Invoice№')}
                                                name="Invoice"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("Please input valid"),
                                                    },
                                                ]}>
                                                <Input
                                                    style={{ width: '100%' }}
                                                    placeholder={t("Invoice№")}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </>
                                )}
                            </>
                        )}
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
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("FirstSign")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("FirstSign")}
                                name="FirstSign"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {signList1.map((taxItem) => (
                                        <Option key={taxItem.FIO} value={taxItem.FIO}>
                                            {taxItem.FIO}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t("SecondSign")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("SecondSign")}
                                name="SecondSign"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {signList2.map((taxItem) => (
                                        <Option key={taxItem.Number} value={taxItem.FIO}>
                                            {taxItem.FIO}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Tabs type="card">
                        <TabPane tab={t("PaymentOrder")} key="1"> */}
                    <PaymentOrderTable
                        data={Tables}
                        tableHeaders={transactionSubCountInfo.DbSubCountInfo}
                        editTableData={editTableData}
                        itemOfExpenseList={itemOfExpenseList}
                        setDisabledTables={setDisabledTables}
                        mainForm={mainForm}
                        subAccountCode={subAccountCode}
                        currrrr={(subaccdbiscurrency || subacccriscurrency)}
                        lastcurrencycourse={lastcurrencycourse}
                    />
                    {/* </TabPane>
                    </Tabs> */}
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
                    fetch={refreshContractorAccountList}
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

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={commonModal}
                timeout={300}
            >
                <CommonModal
                    visible={commonModal}
                    params={commonParams}
                    onSelect={onSelectCommon}
                    onCancel={() => {
                        setCommonModal(false);
                    }}
                />
            </CSSTransition>

        </Card>
    )
}

export default React.memo(UpdatePaymentOrder);