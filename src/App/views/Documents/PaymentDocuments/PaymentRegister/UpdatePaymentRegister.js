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
import ContractorSubCountModal from './components/ContractorSubCountModal';
import PaymentOrderTable from './components/PaymentOrderTable';
import AccountDetailsModal from './components/AccountDetailsModal';
import CommonModal from './components/CommonModal';
import PaymentRegisterServices from '../../../../../services/Documents/PaymentDocuments/PaymentRegister/PaymentRegister.services';
import { Tabs } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const UpdatePaymentRegister = (props) => {
    // console.log(props.location.search);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [paymentRegister, setPaymentRegister] = useState([]);
    const [moneyMeansMovementList, setMoneyMeansMovementList] = useState([]);
    const [allowedTransactionList, setAllowedTransactionList] = useState([]);
    const [contractorAccountList, setContractorAccountList] = useState([]);
    const [contractList, setContractList] = useState([]);
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
    const [showpayrollsheet, setShowpayrollsheet] = useState(false);
    const [requestreceivingcashtype, setRequestreceivingcashtype] = useState(0);
    const [constat, setConstat] = useState(false);
    const [showContract, setShowContract] = useState(false);
    const [MMMKindID, setMMMKindID] = useState(0);
    const [subAccountCode, setSubAccountCode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [paymentRegister, moneyMeansMovementList, signList1, signList2, itemOfExpenseList] = await Promise.all([
                PaymentRegisterServices.getById(
                    props.match.params.id ? [`${props.location.search}&id=${props.match.params.id}`] : props.location.search
                ),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getOrgSignList(1),
                HelperServices.getOrgSignList(2),
                HelperServices.getItemOfExpenseList(),
            ]);

            const [allowedTransactionList, contractorAccountList, transactionSubCountInfo] = await Promise.all([
                HelperServices.getAllowedTransactionList({
                    TableID: paymentRegister.data.TableID, OrganizationAccountID: paymentRegister.data.OrganizationsSettlementAccountID,
                }),
                HelperServices.getContractorAccountList(paymentRegister.data.ContractorPayeeID),
                HelperServices.getTransactionSubCountInfo(paymentRegister.data.AllowedTransactionID),
            ]);

            console.log(paymentRegister.data);
            setPaymentRegister(paymentRegister.data);
            paymentRegister.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(paymentRegister.data.Tables);
            if (paymentRegister.data.Tables.length > 0) {
                setDisabledTables(true);
            };

            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setAllowedTransactionList(allowedTransactionList.data);
            setContractorAccountList(contractorAccountList.data);
            setSignList1(signList1.data);
            setSignList2(signList2.data);
            setItemOfExpenseList(itemOfExpenseList.data);
            setTransactionSubCountInfo(transactionSubCountInfo.data)

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...paymentRegister.data,
                    Date: paymentRegister.data.Date ? moment(paymentRegister.data.Date, 'DD.MM.YYYY') : null,
                });
                selectedMoneyMeansMovementChange(paymentRegister.data.MoneyMeansMovementID, moneyMeansMovementList)

                let accountcode = ''
                setShowpayrollsheet(false)
                let row = contractorAccountList.data.find(a => a.ID === paymentRegister.data.ContractorAccountID)
                accountcode = row.Code
                if (paymentRegister.data.PayrollSheetID > 0 && (accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('22628') || accountcode.startsWith('23106')) && (paymentRegister.data.OrganizationIsFullBudget === true)) {
                    setShowpayrollsheet(true);
                }

            } else {
                mainForm.setFieldsValue({
                    ...paymentRegister.data,
                    AllowedTransactionID: paymentRegister.data.AllowedTransactionID === 0 ? null : paymentRegister.data.AllowedTransactionID,
                    ContractorAccountID: paymentRegister.data.ContractorAccountID === 0 ? null : paymentRegister.data.ContractorAccountID,
                    MoneyMeansMovementID: paymentRegister.data.MoneyMeansMovementID === 0 ? null : paymentRegister.data.MoneyMeansMovementID,
                    Date: paymentRegister.data.Date ? moment(paymentRegister.data.Date, 'DD.MM.YYYY') : null,
                    FirstSign: signList1.data.length === 1 ? signList1.data[0].FIO : null,
                    SecondSign: signList2.data.length === 1 ? signList2.data[0].FIO : null,
                });
            }
            allowedTransactionChange(paymentRegister.data.AllowedTransactionID)
            contractorChange()
            setLoader(false)
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const allowedTransactionChange = (id) => {
        // console.log(id);
        const fetchData = async () => {
            const [transactionSubCountInfo, moneyMeansMovementList] = await Promise.all([
                HelperServices.getTransactionSubCountInfo(id),
                HelperServices.getMoneyMeansMovementList(),
            ]);
            setTransactionSubCountInfo(transactionSubCountInfo.data)
            setMoneyMeansMovementList(moneyMeansMovementList.data);

            console.log(transactionSubCountInfo.data.DbSubCountInfo);
            if (transactionSubCountInfo.data.DbSubCountInfo.SubCount2ID === 11) {
                setShowContract(true);
                mainForm.setFieldsValue({
                    [`RequestReceivingCashID`]: null,
                    [`PayrollSheetID`]: null,
                });
            } else {
                mainForm.setFieldsValue({
                    [`ContractID`]: null,
                });
                setShowContract(false);
            }

            selectedMoneyMeansMovementChange(mainForm.getFieldValue(['MoneyMeansMovementID']), moneyMeansMovementList)
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    };

    const contractorChange = () => {
        const fetchData = async () => {
            const [contractorAccountList, contractList] = await Promise.all([
                HelperServices.getContractorAccountList(mainForm.getFieldValue(['ContractorPayeeID'])),
                HelperServices.getContractList(mainForm.getFieldValue(['ContractorPayeeID'])),
            ]);
            setContractorAccountList(contractorAccountList.data)
            setContractList(contractList.data);
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    }

    const onMainFormFinish = (values) => {
        values.AcademicYearStart = values.AcademicYearStart?.format("YYYY");
        values.AcademicYearEnd = values.AcademicYearEnd?.format("YYYY");
        values.Date = values.Date?.format("DD.MM.YYYY");
        paymentRegister.RequestReceivingCashID = null;
        paymentRegister.PayrollSheetID = null;
        paymentRegister.PaymentTypeCode = null;
        paymentRegister.PayrollSheetCashID = null;
        paymentRegister.IncomeSettlementAccount = null;
        if (paymentRegister.FinanceYear === 0) {
            paymentRegister.FinanceYear = values.Date.substring(6, 10);
        }
        console.log({
            ...paymentRegister, ...values,
            Tables: Tables,
        });
        setLoader(true);
        PaymentRegisterServices.update({
            ...paymentRegister, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/PaymentRegister`);
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

    const selectedMoneyMeansMovementChange = useCallback((id, listMMM) => {
        let currentMMMList = listMMM?.data ? listMMM.data : moneyMeansMovementList;

        let selectedMMM = currentMMMList.find((mmm) => mmm.ID === id)
        setMMMKindID(selectedMMM?.MoneyMeansMovementsKindID)

    }, [moneyMeansMovementList])

    const calculationPaymentTypeCode = (requestreceivingcashtype) => {
        if (mainForm.getFieldValue(['ContractorAccountID']) === 2745) {
            mainForm.setFieldsValue({
                [`PaymentTypeCode`]: '08102',
            });
        } else if (!showContract && MMMKindID === 2
            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
            && mainForm.getFieldValue(['ContractorAccountID']) !== 2745
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
        if (accountcode.startsWith('22628') || accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('23106')) {
            setShowpayrollsheet(true);
        }
        setConstat(accountcode.startsWith('23108') || accountcode.startsWith('22613') || accountcode.startsWith('23106'))
        calculationPaymentTypeCode(requestreceivingcashtype)
    }

    const getTableListForFill = () => {
        mainForm.validateFields().then(values => {
            values.Date = values.Date.format("DD.MM.YYYY");
            values.StartDate = values.StartDate.format("DD.MM.YYYY");
            values.EndDate = values.EndDate.format("DD.MM.YYYY");
            console.log(values);
            PaymentRegisterServices.getTableListForFill({
                ...values
            })
                .then((res) => {
                    if (res.status === 200) {
                        setTables(res.data)
                        setLoader(false);
                    }
                })
                .catch((err) => {
                    Notification('error', err);
                    setLoader(false);
                });
        })
    }

    return (
        <Card title={t("PaymentRegister")}>
            <Spin spinning={loader} size='large'>
                <Form
                    // {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                    initialValues={{
                        EndDate: moment().add(30, "days"),
                        StartDate: moment().subtract(30, "days"),
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
                        <Col md={3}>
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
                        <Col md={3}>
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
                                    name="ContractorAccountID"
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
                        {(mainForm.getFieldValue(['ContractorAccountID']) === 2745) && (
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
                                            style={{ width: '100%' }}
                                            placeholder={t("IncomeSettlementAccount")}
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        {showContract && (
                            <>
                                <Col md={4}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                        {t("Contract")}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Item
                                        // label={t("MoneyMeansMovement")}
                                        name="Contract"
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
                                            {contractList.map((taxItem) => (
                                                <Option key={taxItem.ID} value={taxItem.ID}>
                                                    {taxItem.Name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
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
                            </>
                        )}
                    </Row>
                    <Row gutter={[15, 0]}>
                        {(MMMKindID === 2 && showContract === false) ? (
                            <>
                                {(mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004") && (
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
                                                                params: { SettlementAccountID: paymentRegister.OrganizationsSettlementAccountID },
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
                        {(showpayrollsheet === true) && (
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
                                                        params: { SettlementAccountID: paymentRegister.OrganizationsSettlementAccountID },
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
                            !showContract && MMMKindID === 2
                            && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                            && mainForm.getFieldValue(['ContractorAccountID']) !== 2745
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
                                                maxLength={5}
                                                style={{ width: '100%' }}
                                                placeholder={t("PaymentTypeCode")}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col md={4}></Col>
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
                    <Tabs type="card">
                        <TabPane tab={t("ListOfPaymentOrders")} key="1">
                            <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                                <Form.Item
                                    label={t("StartDate")}
                                    name="StartDate"
                                    style={{ width: '100%', marginBottom: 8 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <DatePicker
                                        format="DD.MM.YYYY" style={{ width: '100%' }}
                                        placeholder={t('StartDate')} className={'addonInput'}
                                    // onChange={onChangeDate}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("EndDate")}
                                    name="EndDate"
                                    style={{ width: '100%', marginBottom: 8 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <DatePicker
                                        format="DD.MM.YYYY" style={{ width: '100%' }}
                                        placeholder={t('EndDate')} className={'addonInput'}
                                    // onChange={onChangeDate}
                                    />
                                </Form.Item>
                                <Form.Item style={{ width: '100%', marginBottom: 16 }} >
                                    <Button
                                        // disabled={fillSubCalculationButton}
                                        // loading={fillSubCalculationLoader}
                                        onClick={getTableListForFill}
                                        type="primary"
                                    >
                                        {t('Tuldirish')}
                                    </Button>
                                </Form.Item>
                            </Space>
                            <PaymentOrderTable
                                data={Tables}
                                tableHeaders={transactionSubCountInfo.DbSubCountInfo}
                                editTableData={editTableData}
                                itemOfExpenseList={itemOfExpenseList}
                                setDisabledTables={setDisabledTables}
                                mainForm={mainForm}
                                subAccountCode={subAccountCode}
                            />
                        </TabPane>
                    </Tabs>
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

export default React.memo(UpdatePaymentRegister);