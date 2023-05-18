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
import CommonModal from './components/CommonModal';
import TreasuryMemOrderServices from '../../../../../services/Documents/PaymentDocuments/TreasuryMemOrder/TreasuryMemOrder.services';

const { Option } = Select;
const { TextArea } = Input;

const UpdateTreasuryMemOrder = (props) => {
    // console.log(props.location.search);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [treasuryMemOrder, setTreasuryMemOrder] = useState([]);
    const [moneyMeansMovementList, setMoneyMeansMovementList] = useState([]);
    const [treasuryMemOrderTypeList, setTreasuryMemOrderTypeList] = useState([]);
    const [allowedTransactionList, setAllowedTransactionList] = useState([]);
    const [subAccDBList, setSubAccDBList] = useState([]);
    const [subAccCRList, setSubAccCRList] = useState([]);
    const [signList1, setSignList1] = useState([]);
    const [signList2, setSignList2] = useState([]);
    const [itemOfExpenseList, setItemOfExpenseList] = useState([]);
    const [transactionSubCountInfo, setTransactionSubCountInfo] = useState({});

    const [contractorSubCountModal, setContractorSubCountModal] = useState(false);
    const [contractorSubCountParams, setContractorSubCountParams] = useState(null);
    const [commonModal, setCommonModal] = useState(false);
    const [commonParams, setCommonParams] = useState(null);

    const [Tables, setTables] = useState([]);
    const [disabledTables, setDisabledTables] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [MMMKindID, setMMMKindID] = useState(0);
    const [isInvoice, setIsInvoice] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [treasuryMemOrder, moneyMeansMovementList, treasuryMemOrderTypeList, signList1, signList2, itemOfExpenseList] = await Promise.all([
                TreasuryMemOrderServices.getById(
                    props.match.params.id ? [`${props.location.search}&id=${props.match.params.id}`] : props.location.search
                ),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getTreasuryMemOrderTypeList(),
                HelperServices.getOrgSignList(1),
                HelperServices.getOrgSignList(2),
                HelperServices.getItemOfExpenseList(),
            ]);

            const [allowedTransactionList, subAccDBList, subAccCRList,, transactionSubCountInfo] = await Promise.all([
                HelperServices.getAllowedTransactionList({
                    TableID: treasuryMemOrder.data.TableID, OrganizationAccountID: treasuryMemOrder.data.OrganizationsSettlementAccountID,
                }),
                HelperServices.getSubAccDBList({ AllowedTransactionID: treasuryMemOrder.data.AllowedTransactionID }),
                HelperServices.getSubAccCRList({ OrganizationsSettlementAccountID: treasuryMemOrder.data.OrganizationsSettlementAccountID }),
                HelperServices.getContractorAccountList(treasuryMemOrder.data.ContractorPayeeID),
                HelperServices.getTransactionSubCountInfo(treasuryMemOrder.data.AllowedTransactionID),
            ]);

            console.log(treasuryMemOrder.data);
            setTreasuryMemOrder(treasuryMemOrder.data);
            treasuryMemOrder.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(treasuryMemOrder.data.Tables);
            if (treasuryMemOrder.data.Tables.length > 0) {
                setDisabledTables(true);
            };

            setMoneyMeansMovementList(moneyMeansMovementList.data);
            setTreasuryMemOrderTypeList(treasuryMemOrderTypeList.data);
            setAllowedTransactionList(allowedTransactionList.data);
            setSubAccDBList(subAccDBList.data);
            setSubAccCRList(subAccCRList.data);
            setSignList1(signList1.data);
            setSignList2(signList2.data);
            setItemOfExpenseList(itemOfExpenseList.data);
            setTransactionSubCountInfo(transactionSubCountInfo.data)

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...treasuryMemOrder.data,
                    Date: treasuryMemOrder.data.Date ? moment(treasuryMemOrder.data.Date, 'DD.MM.YYYY') : null,
                });
                selectedMoneyMeansMovementChange(treasuryMemOrder.data.MoneyMeansMovementID, moneyMeansMovementList)
                invoiceChange(treasuryMemOrder.data.ContractorsSettlementAccount)

            } else {
                mainForm.setFieldsValue({
                    ...treasuryMemOrder.data,
                    AllowedTransactionID: treasuryMemOrder.data.AllowedTransactionID === 0 ? null : treasuryMemOrder.data.AllowedTransactionID,
                    SubAccDbID: treasuryMemOrder.data.SubAccDbID === 0 ? null : treasuryMemOrder.data.SubAccDbID,
                    ContractorsSettlementAccountID: treasuryMemOrder.data.ContractorsSettlementAccountID === 0 ? null : treasuryMemOrder.data.ContractorsSettlementAccountID,
                    MoneyMeansMovementID: treasuryMemOrder.data.MoneyMeansMovementID === 0 ? null : treasuryMemOrder.data.MoneyMeansMovementID,
                    Date: treasuryMemOrder.data.Date ? moment(treasuryMemOrder.data.Date, 'DD.MM.YYYY') : null,
                    FirstSign: signList1.data.length === 1 ? signList1.data[0].FIO : null,
                    SecondSign: signList2.data.length === 1 ? signList2.data[0].FIO : null,
                });
            }
            allowedTransactionChange(treasuryMemOrder.data.AllowedTransactionID, treasuryMemOrder.data)
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const allowedTransactionChange = (id, paymOrd) => {
        let orgSettAcc = paymOrd?.OrganizationsSettlementAccountID ? paymOrd.OrganizationsSettlementAccountID : treasuryMemOrder.OrganizationsSettlementAccountID;
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
                });
            } else {
                setShowRequest(true);
            }

            selectedMoneyMeansMovementChange(mainForm.getFieldValue(['MoneyMeansMovementID']), moneyMeansMovementList)
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    };

    const onMainFormFinish = (values) => {
        values.AcademicYearStart = values.AcademicYearStart?.format("YYYY");
        values.AcademicYearEnd = values.AcademicYearEnd?.format("YYYY");
        values.Date = values.Date?.format("DD.MM.YYYY");
        treasuryMemOrder.RequestReceivingCashID = null;
        treasuryMemOrder.PayrollSheetID = null;
        treasuryMemOrder.PaymentTypeCode = null;
        treasuryMemOrder.PayrollSheetCashID = null;
        treasuryMemOrder.IsPrePayment = null;
        treasuryMemOrder.IncomeSettlementAccount = null;
        treasuryMemOrder.Invoice = null;
        if (treasuryMemOrder.FinanceYear === 0) {
            treasuryMemOrder.FinanceYear = values.Date.substring(6, 10);
        }
        console.log({
            ...treasuryMemOrder, ...values,
            Tables: Tables,
        });
        setLoader(true);
        TreasuryMemOrderServices.update({
            ...treasuryMemOrder, ...values,
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

    const openCommonModal = (params) => {
        setCommonParams(params);
        setCommonModal(true);
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

    const invoiceChange = useCallback((e) => {
        if (e === '401410860354017033232011002' ||
            e === '401410860034017033232011002' ||
            e === '401410860064017033232011002' ||
            e === '401410860084017033232011002' ||
            e === '401410860104017033232011002' ||
            e === '401410860124017033232011002' ||
            e === '401410860144017033232011002' ||
            e === '401410860184017033232011002' ||
            e === '401410860244017033232011002' ||
            e === '401410860224017033232011002' ||
            e === '401410860304017033232011002' ||
            e === '401410860334017033232011002' ||
            e === '401410860274017033232011002' ||
            e === '401410860262877033232011002') {
            setIsInvoice(1);
        } else {
            setIsInvoice(0);
            mainForm.setFieldsValue({
                [`Invoice`]: '',
            });
        }

    }, [mainForm])

    return (
        <Card title={t("TreasuryMemOrder")}>
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
                            <Form.Item
                                // label={t('orgSettAcc')}
                                name="ContractorsSettlementAccount"
                            >
                                <Input
                                    style={{ width: '100%' }} disabled
                                    placeholder={t("ContractorsSettlementAccount")}
                                    onChange={invoiceChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}></Col>
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
                                {t("TreasuryMemOrderType")}
                            </div>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                // label={t("MoneyMeansMovement")}
                                name="TreasuryMemOrderTypeID"
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
                                    {treasuryMemOrderTypeList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {(isInvoice === 1 && MMMKindID === 2) && (
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
                    </Row>
                    <Row gutter={[15, 0]}>
                        {(MMMKindID === 2 && showRequest === true) && (
                            <>
                                {(
                                    treasuryMemOrder.OrganizationState === 1
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                                    && treasuryMemOrder.OrganizationsSettlementAccountOutOfBalance === false
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
                                                                    params: { SettlementAccountID: treasuryMemOrder.OrganizationsSettlementAccountID },
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
                        )}
                        {(
                            treasuryMemOrder.ContractorsSettlementAccount?.indexOf('700110860262877950600262001') === 0
                            || treasuryMemOrder.ContractorsSettlementAccount?.indexOf('700110860262877950600262002') === 0
                            || treasuryMemOrder.ContractorsSettlementAccount?.indexOf('700110860262877950600262003') === 0
                        ) && (
                                <>
                                    <Col md={4}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                            {t("Ticket")}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Item
                                            // label={t("PayrollSheet")}
                                            name="Ticket"
                                            style={{ width: "100%" }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("Please input valid"),
                                                },
                                            ]}>
                                            <Input
                                                className={'addonInput'}
                                                placeholder={t("Ticket")}
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
                    // fetch={refreshContractorAccountList}
                    onCancel={() => {
                        setContractorSubCountModal(false);
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

export default React.memo(UpdateTreasuryMemOrder);