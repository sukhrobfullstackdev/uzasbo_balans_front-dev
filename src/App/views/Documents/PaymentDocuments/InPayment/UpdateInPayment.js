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
import CommonModal from './components/CommonModal';
import InpaymentServices from '../../../../../services/Documents/PaymentDocuments/Inpayment/Inpayment.services';
import PaymentOrderTable from './components/PaymentOrderTable';

const { Option } = Select;
const { TextArea } = Input;

const UpdateInPayment = (props) => {
    // console.log(props.location.search);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [inPayment, setInPayment] = useState([]);
    const [moneyMeansMovementList, setMoneyMeansMovementList] = useState([]);
    const [allowedTransactionList, setAllowedTransactionList] = useState([]);
    const [contractorAccountList, setContractorAccountList] = useState([]);
    const [subAccDBList, setSubAccDBList] = useState([]);
    const [subAccCRList, setSubAccCRList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
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
    const [subaccdbiscurrency, setSubaccdbiscurrency] = useState(false);
    const [subacccriscurrency, setSubacccriscurrency] = useState(false);
    const [lastcurrencycourse, setLastcurrencycourse] = useState(0);
    const [showRequest, setShowRequest] = useState(false);
    const [creditAccID, setCreditAccID] = useState(0);
    const [MMMKindID, setMMMKindID] = useState(0);
    const [ItemOfExpensesID, setItemOfExpensesID] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [inPayment, moneyMeansMovementList, currencyList, signList1, signList2, itemOfExpenseList] = await Promise.all([
                InpaymentServices.getById(
                    props.match.params.id ? [`${props.location.search}&id=${props.match.params.id}`] : props.location.search
                ),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getCurrencyList(),
                HelperServices.getOrgSignList(1),
                HelperServices.getOrgSignList(2),
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
            setSignList1(signList1.data);
            setSignList2(signList2.data);
            setItemOfExpenseList(itemOfExpenseList.data);
            setTransactionSubCountInfo(transactionSubCountInfo.data)

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...inPayment.data,
                    Date: inPayment.data.Date ? moment(inPayment.data.Date, 'DD.MM.YYYY') : null,
                });
                selectedSubAccCRChange(inPayment.data.SubAccDbID, subAccDBList)
                selectedMoneyMeansMovementChange(inPayment.data.MoneyMeansMovementID, moneyMeansMovementList, subAccDBList, subAccCRList)
            } else {
                mainForm.setFieldsValue({
                    ...inPayment.data,
                    AllowedTransactionID: inPayment.data.AllowedTransactionID === 0 ? null : inPayment.data.AllowedTransactionID,
                    SubAccDbID: inPayment.data.SubAccDbID === 0 ? null : inPayment.data.SubAccDbID,
                    ContractorsSettlementAccountID: inPayment.data.ContractorsSettlementAccountID === 0 ? null : inPayment.data.ContractorsSettlementAccountID,
                    MoneyMeansMovementID: inPayment.data.MoneyMeansMovementID === 0 ? null : inPayment.data.MoneyMeansMovementID,
                    Date: inPayment.data.Date ? moment(inPayment.data.Date, 'DD.MM.YYYY') : null,
                    FirstSign: signList1.data.length === 1 ? signList1.data[0].FIO : null,
                    SecondSign: signList2.data.length === 1 ? signList2.data[0].FIO : null,
                });
            }
            allowedTransactionChange(inPayment.data.AllowedTransactionID, inPayment.data)
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const allowedTransactionChange = (id, paymOrd) => {
        let orgSettAcc = paymOrd?.OrganizationsSettlementAccountID ? paymOrd.OrganizationsSettlementAccountID : inPayment.OrganizationsSettlementAccountID;
        // console.log(id, orgSettAcc);
        const fetchData = async () => {
            const [transactionSubCountInfo, moneyMeansMovementList, subAccDBList, subAccCRList] = await Promise.all([
                HelperServices.getTransactionSubCountInfo(id),
                HelperServices.getMoneyMeansMovementList(),
                HelperServices.getInpaymentSubAccDBList({ OrganizationsSettlementAccountID: orgSettAcc }),
                HelperServices.getInpaymentSubAccCrList({ AllowedTransactionID: id }),
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
        InpaymentServices.update({
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

    const selectedSubAccCRChange = useCallback((id, list) => {
        let currentList = list?.data ? list.data : subAccCRList;
        let selected = currentList?.find((db) => db.ID === id)
        setCreditAccID(selected?.AccID)
    }, [subAccCRList])

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

    const fillRows = () => {
        const fetchData = async () => {
            const [newInPayment] = await Promise.all([
                InpaymentServices.getById(`?Id=0&OrganizationsSettlementAccountID=${inPayment.OrganizationsSettlementAccountID}&IsClone=false&treasDocId=${mainForm.getFieldValue(['TreasDocID'])}`),
            ]);
            if (newInPayment.data === null) {
                Notification('error', "Поступления не найден.")
            } else if (newInPayment.data.Number === -1) {
                Notification('error', "Поступление уже добавлено.")
            } else {
                // setInPayment(newInPayment.data)
                mainForm.setFieldsValue({
                    ...newInPayment.data,
                    Date: newInPayment.data.Date ? moment(newInPayment.data.Date, 'DD.MM.YYYY') : null,
                });

                if ((newInPayment.data.OrganizationAccountCode.substring(0, 4) === "4005" || newInPayment.data.OrganizationAccountCode.substring(0, 4) === "4008")
                    && (newInPayment.data.SubCount1ID === 0 || newInPayment.data.SubCount1ID === undefined)) {
                    Notification('error', "Тўлов мақсадида боланинг шахсий ҳисоб коди (мисол учун 001-000236876) кўрсатилган бўлганда, тушумни импорт қилиш пайтида унинг Ф.И.Ш.и ҳам автомат танланган бўларди. Боланинг шахсий ҳисоб кодини банклар томонидан тўловни ўтказиш чоғида кўрсатиб кетилишини назоратга олишингизни, ота-оналарга бу бўйича маълумот бериб боришингизни ва квитанция формасини уларга ҳар ой тарқатишингизни сўраймиз.\r\nЕсли бы в деталях платежа был бы указан личный код ребёнка (например 001-000236876), то во время импортирования поступления его Ф.И.О. выбралось бы автоматически. Просим вас проследить за тем, чтобы во время проведения платежа банком, они указывали личный код ребёнка, также просим вас распространить данную информацию родителям и каждый месяц раздавать им квитанции.")
                }
                if (newInPayment.data.OrganizationAccountCode.substring(0, 4) === "4009" && newInPayment.data.SubCount1ID === 0) {
                    Notification('error', "Тўлов мақсадида талабанинг шахсий ҳисоб коди (мисол учун 002-000236876) кўрсатилган бўлганда, тушумни импорт қилиш пайтида унинг Ф.И.Ш.и ҳам автомат танланган бўларди. Талабанинг шахсий ҳисоб кодини банклар томонидан тўловни ўтказиш чоғида кўрсатиб кетилишини назоратга олишингизни, тўловчиларга бу бўйича маълумот бериб боришингизни сўраймиз.\r\nЕсли бы в деталях платежа был бы указан личный код студента (например 002-000236876), то во время импортирования поступления его Ф.И.О. выбралось бы автоматически. Просим вас проследить за тем, чтобы во время проведения платежа банком, они указывали личный код студента, также просим вас распространить данную информацию плательщикам.")
                }
            }
            if (newInPayment.data.SumInWords === "") {
                setItemOfExpensesID(254);
            }

            contractorChange()
            selectedSubAccCRChange(newInPayment.data.SubAccDbID, subAccDBList)
            courseChange(mainForm.getFieldValue(['CurrencyID']))
        }

        fetchData().catch(err => {
            Notification('error', err)
        });
    }

    return (
        <Card title={t("Inpayment")}>
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
                                {t('TreasDocID')}
                            </div>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                // label={t('Number')}
                                name="TreasDocID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    className={'addonInput'} disabled={disabledTables}
                                    style={{ width: '100%' }}
                                    placeholder={t("TreasDocID")}
                                    addonAfter={
                                        <Button
                                            type="primary" disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={fillRows}
                                        >
                                            {t("Import")}
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col md={2}>
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
                                <InputNumber disabled={disabledTables}
                                    style={{ width: '100%' }}
                                    placeholder={t("Number")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={2}>
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
                                <DatePicker disabled={disabledTables}
                                    format="DD.MM.YYYY" style={{ width: '100%' }}
                                    placeholder={t('Date')} className={'addonInput'}
                                // onChange={onChangeDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={2}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('paymentOrderID')}
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Item
                                // label={t('Number')}
                                name="PaymentOrderID"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber disabled
                                    style={{ width: '100%' }}
                                    placeholder={t("PaymentOrderID")}
                                />
                            </Form.Item>
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
                                    onSelect={selectedSubAccCRChange}
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
                                {t("PayerName")}
                            </div>
                        </Col>
                        <Col md={16}>
                            <Form.Item
                                // label={t("Payee")}
                                name="PayerName"
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
                                                Name: 'PayerName',
                                                ID: 'PayerID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("PayerID")}
                                name="PayerID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
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
                        {(MMMKindID === 1 && creditAccID !== 45 && showRequest) ? (
                            <>
                                {(
                                    inPayment.OrganizationState === 1
                                    && inPayment.OrganizationIsFullBudget === true
                                    && inPayment.OrganizationsSettlementAccountOutOfBalance === false
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 3) !== "200"
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 3) !== "300"
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
                                                                    params: { SettlementAccountID: inPayment.OrganizationsSettlementAccountID },
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
                        {(MMMKindID === 1 && creditAccID !== 45 && showRequest) ? (
                            <>
                                {(
                                    inPayment.OrganizationState === 1
                                    && inPayment.OrganizationIsFullBudget === true
                                    && inPayment.OrganizationsSettlementAccountOutOfBalance === false
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 4) !== "4004"
                                    && mainForm.getFieldValue(['OrganizationAccountCode'])?.substring(0, 3) !== "300"
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
                                                                    Endpoint: 'GetPlasticCardSheetForInpaymentList',
                                                                    params: { SettlementAccountID: inPayment.OrganizationsSettlementAccountID },
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
                            </>
                        ) : null}
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
                        tableHeaders={transactionSubCountInfo.CrSubCountInfo}
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

export default React.memo(UpdateInPayment);