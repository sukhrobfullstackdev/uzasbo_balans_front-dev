import { Button, Col, Form, Input, Row, Select, Space, Spin, Table, InputNumber, Tabs, Tooltip, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import MainCard from "../../../../components/MainCard";
import { useHistory } from 'react-router-dom';
import CurrencyIncomeCashOrderServices from "../../../../../services/Documents/CashAccounting/CurrencyIncomeCashOrder/CurrencyIncomeCashOrderservices";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import StaffTableHeader from "./modals/StaffTableHeader";
import moment from 'moment';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    values,
    map,
    CurrencySum,
    index,
    settlementAccountList,
    children,
    onEnter,
    onPressEnter,
    inputRef,
    form,
    ...restProps
}) => {

    let inputNode;
    if (dataIndex === 'CurrencySum') { 
        inputNode = <InputNumber

            onPressEnter={onPressEnter}
            onBlur={onEnter}
            style={{ width: '80%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
        />;
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                //  rules={[
                //    {
                //      required: true,
                //     message: `Please Input ${title}!`,
                //    },
                //  ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
let tableRowChanged = false;

const UpdateCurrencyIncomeCashOrder = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [TableForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [allowTrans, setAllowedTrans] = useState([]);
    const [docId] = useState(props.match.params.id ? props.match.params.id : 0);
    const [documentList, setDocumentList] = useState([]);
    const [accDbList, setAccDBList] = useState([]);
    const [movementsKindList, setMovementsKindList] = useState([]);
    const [modalLink, setModalLink] = useState({});
    const [editingKey, setEditingKey] = useState("");
    const [disabledActions, setDisabledActions] = useState(false);
    const [settlementAddTableModalData, setAddSettlementTableModalData] = useState([]);
    const [currency, setCurrency] = useState([]);

    const [CurrencySum, setCurrencySum] = useState();


    useEffect(() => {
        const fetchData = async () => {

            const [allowedTrans, documentList, accDbList, SubAccCr, currency] = await Promise.all([
                CurrencyIncomeCashOrderServices.getById(props.match.params.id ? [`?id=${props.match.params.id}`] : props.location.search),

                HelperServices.getTransactionSubCountSubAccDB(),
                HelperServices.getAllowedTransactionICOAllList(),
                HelperServices.getInpaymentSubAccCRList(),
                HelperServices.getCurrency(),
            ]);
            console.log(allowedTrans.data.SubAccCr)
            if (props.match.params.id ) { 
                const allowTrans = await HelperServices.getTransactionSubCountInfo(allowedTrans.data.AllowedTransactionID)
                setModalLink(allowTrans.data)
                const allowTran5 = await HelperServices.getInpaymentSubAccCRList(allowedTrans.data.AllowedTransactionID)
                setMovementsKindList(allowTran5.data)
                const currencyList = await HelperServices.getLastCurrency(allowedTrans.data.CurrencyID, moment(new Date()).format('DD.MM.YYYY'))
                setCurrencySum(currencyList.data);
                mainForm.setFieldsValue({
                    CourseSum: currencyList.data,                     
                });
            }
            // if (props.match.params.id) {
                
            // }
            setCurrency(currency.data)
            setDocumentList(documentList.data);
            
            setAllowedTrans(allowedTrans.data);
            setAccDBList(accDbList.data);
            setMovementsKindList(SubAccCr.data);
            setAddSettlementTableModalData(allowedTrans.data.Tables)

            
            if (allowedTrans.data.Tables.length !== 0) {
                setDisabledActions(true);
            }
            mainForm.setFieldsValue({
                ...allowedTrans.data,
                AllowedTransactionID: props.location.search.length ===5 ? null : allowedTrans.data.AllowedTransactionID,
                SubAccDbID: props.location.search.length ===5  ? null : allowedTrans.data.SubAccDbID,
                SubAccCrID: props.location.search.length ===5  ? null : allowedTrans.data.SubAccCr,
                CurrencyID: props.location.search.length ===5  ? null : allowedTrans.data.CurrencyID,
            });
            setLoader(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [props.match.params.id, props.location.search, mainForm]);


    const onMainFormFinish = (values) => {
        setLoader(true);

        CurrencyIncomeCashOrderServices.update({
            ...allowTrans, ...values,
            Tables: settlementAddTableModalData
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/CurrencyIncomeCashOrder`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };
    const organizationHandler = divisionId => {
        mainForm.setFieldsValue({
            SubAccCr: null,
        });
        HelperServices.getInpaymentSubAccCRList(divisionId)
            .then(res => {
                setMovementsKindList(res.data);
            })
            .catch(err => Notification('error', err));
        HelperServices.getTransactionSubCountInfo(divisionId)
            .then(res => {
                setModalLink(res.data);
            })
            .catch(err => Notification('error', err));
    }

    const CurrencyHandler = (id) => {
        // console.log(id);
        HelperServices.getLastCurrency(id, moment(new Date()).format('DD.MM.YYYY'))
            .then(res => {
                setCurrencySum(res.data);
                mainForm.setFieldsValue({
                    CourseSum: res.data
                })
            })
            .catch(err => console.log(err));

    }


    const TablesDeleteHandler = (row) => {
        const obj = { ...row }
        obj.Status = 3;
        const newData = [...settlementAddTableModalData];

        let Sum = mainForm.getFieldValue('Sum');
        mainForm.setFieldsValue({
            Sum: Sum - +obj.Sum
        });

        let CurrencySum = mainForm.getFieldValue('CurrencySum');

        mainForm.setFieldsValue({
            CurrencySum: CurrencySum + -obj.CurrencySum
        })

        const index = newData.findIndex((item) => row.ID === item.ID);
        if (index === 0) {
            setDisabledActions(false)
        }
        newData.splice(index, 1, obj);

        setAddSettlementTableModalData(newData);

    }

    const addTableDataHandler = (data) => {
        if (data !== 0) {
            setDisabledActions(true);
        }
        setAddSettlementTableModalData([...settlementAddTableModalData, data]);
        let Sum = mainForm.getFieldValue('Sum');

        mainForm.setFieldsValue({
            Sum: Sum + +data.Sum
        })
        let CurrencySum = mainForm.getFieldValue('CurrencySum');

        mainForm.setFieldsValue({
            CurrencySum: CurrencySum + +data.CurrencySum
        })
    };

    const isEditing = (values) => values.ID === editingKey;

    const edit = (values) => {
        TableForm.setFieldsValue({
            ...values,
        });
        setEditingKey(values.ID);
    };

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const save = async (key) => {

        try {
            const row = await TableForm.validateFields();
            const newData = [...settlementAddTableModalData];
            const index = newData.findIndex((item) => key === item.ID);
            if (index > -1) {
                const item = newData[index];
                row.Sum = row.CurrencySum * CurrencySum;
                if (item.Status === 0) {
                    item.Status = 2;
                } else if (item.Status !== 0) {
                    item.Status = 1;
                }
                newData.splice(index, 1, { ...item, ...row });
                if (tableRowChanged) {
                    tableRowChanged = false;
                }
                setAddSettlementTableModalData(newData);
                let Sum = 0;
                
                    newData.forEach(item => {
                        Sum += +item.Sum
                        mainForm.setFieldsValue({
                            Sum: Sum
                        })
                    })
                

                setEditingKey("");
            } else {
                newData.push(row);
                setAddSettlementTableModalData(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
            tableRowChanged = false;
        }
    };


    const columns = [
        {
            title: t("SubCountCr1Name"),
            dataIndex: "SubCountCr1Name",
            sorter: true,
            width: 400,
            //editable: true,
        },
        {
            title: t("SubCountCr2Name"),
            dataIndex: "SubCountCr2Name",
            key: "SubCountCr2Name",
            sorter: true,
            width: 400,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            sorter: true,
            width: 200,
            align: "right",
        },
        {
            title: t("CurrencySum"),
            dataIndex: "CurrencySum",
            key: "CurrencySum",
            sorter: true,
            width: 200,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            align: "right",
        },
        {
            title: t('actions'),
            key: 'action',
            align: 'center',
            width: 100,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t('Edit')}>
                            <span
                                onClick={() => {
                                    edit(record);
                                }}
                            >
                                <i className={`feather icon-edit action-icon`} />
                            </span>
                        </Tooltip>
                        <Tooltip title={t('Delete')}>
                            <Popconfirm
                                title={t('delete')}
                                okText={t('yes')}
                                cancelText={t('cancel')}
                                onConfirm={() => {
                                    TablesDeleteHandler(record);
                                }}
                            >
                                <span>
                                    <i className={`feather icon-trash-2 action-icon `} />
                                </span>
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                )
            },
        },
    ];
    const roleBasedColumns = columns.filter(item => {
        return item.dataIndex !== 'OrganizationsSettlementAccountID';
    });

    const mergedColumns = roleBasedColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (values) => ({
                values,
                inputType: "number",
                dataIndex: col.dataIndex,
                title: col.title,
                CurrencySum: col.CurrencySum,
                editing: isEditing(values),
                onEnter: () => save(values.ID),
                onPressEnter: () => save(values.ID),
            })
        };
    });

    return (
        <MainCard title={t("CurrencyIncomeCashOrder")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("Number")}
                                name="Number"
                                style={{ width: "100%" }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("Date")}
                                name="Date"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={8}>
                            <Form.Item
                                label={t("LimitOperType")}
                                name="AllowedTransactionID"
                                style={{ width: "100%" }}

                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("LimitOperType")}
                                    onChange={organizationHandler}
                                    disabled={disabledActions}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                >
                                    {accDbList.map((accDb) => (
                                        <Option key={accDb.ID} value={accDb.ID}>
                                            {accDb.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={8}>
                            <Form.Item
                                label={t("SubAccDb")}
                                name="SubAccDbID"
                                style={{ width: "100%" }}

                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("SubAccDb")}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                >
                                    {documentList.map((document) => (
                                        <Option key={document.ID} value={document.ID}>
                                            {document.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={8}>
                            <Form.Item
                                label={t("SubAccCr")}
                                name="SubAccCrID"
                                style={{ width: "100%" }}

                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("SubAccCr")}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                >
                                    {movementsKindList.map((movementsKindList) => (
                                        <Option key={movementsKindList.ID} value={movementsKindList.ID}>
                                            {movementsKindList.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={8}>
                            <Form.Item
                                label={t("Currency")}
                                name="CurrencyID"
                                style={{ width: "100%" }}

                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    onSelect={CurrencyHandler}
                                    placeholder={t("Currency")}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }

                                >
                                    {currency.map((currency) => (
                                        <Option key={currency.ID} value={currency.ID}>
                                            {currency.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("TakeOver")}
                                name="TakeOver"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("Sum")}
                                name="Sum"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                 <InputNumber
                                    disabled
                                    placeholder={t("Sum")}
                                    className="sum-input"
                                    style={{ color: 'black', width: '100%', textAlign: "right" }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("CurrencySum")}
                                name="CurrencySum"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <InputNumber
                                     disabled
                                    placeholder={t("Salary")}
                                    className="sum-input"
                                    style={{ color: 'black', width: '100%', textAlign: "right" }}
                                    decimalSeparator=','
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("CourseSum")}
                                name="CourseSum"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                 <InputNumber
                                    disabled
                                    placeholder={t("CourseSum")}
                                    className="sum-input"
                                    style={{ color: 'black', width: '100%', textAlign: "right" }}
                                    decimalSeparator=','
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                />
                            </Form.Item>
                        </Col>

                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("Matter")}
                                name="Matter"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={24} lg={12}>
                            <Form.Item
                                label={t("Comment")}
                                name="Comment"
                                disabled
                                rules={[
                                    {
                                        required: true,
                                        message: t('inputValidData'),
                                    },
                                ]}
                            >
                                <TextArea rows={2} placeholder={t("Comment")} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Form
                    form={TableForm}
                    component={false}
                    onValuesChange={onTableValuesChange}
                >
                    <Tabs defaultActiveKey="1">

                        <TabPane tab={t('Tables')} key="1" >
                            <Table
                                size='middle'
                                pagination={false}
                                disabled={disabledActions}
                                className="main-table"
                                rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                columns={mergedColumns}
                                dataSource={settlementAddTableModalData.filter(item => item.Status !== 3)}

                                loading={loader}
                                scroll={{
                                    x: "max-content",
                                    y: '90vh'
                                }}

                                components={{
                                    header: {
                                        row: () => <StaffTableHeader
                                            modalLink={modalLink}
                                            doc={docId}
                                            CurrencySum={CurrencySum}
                                            addData={addTableDataHandler}
                                        />
                                    },
                                    body: {
                                        cell: EditableCell
                                    }
                                }}
                                onRow={(values) => {
                                    return {
                                        onDoubleClick: () => {
                                            edit(values);
                                        },
                                    };
                                }}
                            />
                        </TabPane>

                    </Tabs>
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

        </MainCard>
    )
}

export default React.memo(UpdateCurrencyIncomeCashOrder);