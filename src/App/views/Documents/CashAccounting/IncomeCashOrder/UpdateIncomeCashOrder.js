import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Space, Spin, Table, InputNumber, Tabs, Tooltip, DatePicker, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import MainCard from "../../../../components/MainCard";
import IncomeCashOrderServices from "../../../../../services/Documents/CashAccounting/IncomeCashOrder/IncomeCashOrderservices";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import StaffTableHeader from "./modals/StaffTableHeader";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    values,
    map,
    Sum,
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
    if (dataIndex === 'Sum') {
        inputNode = <InputNumber

            onPressEnter={onPressEnter}
            onBlur={onEnter}

            style={{ width: '100%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        //className='edit-sum-input'
        // ref={(Input) => {Input && Input.focus() }}
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
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
};

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
let tableRowChanged = false;

const UpdateIncomeCashOrder = (props) => {
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
    const [allowedTransaction, setAllowedTransaction] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const [disabledActions, setDisabledActions] = useState(false);
    const [disabledActionsBtn, setDisabledActionsBtn] = useState(false);
    const [settlementAddTableModalData, setAddSettlementTableModalData] = useState([]);
    const [showTariffScale, setShowTariffScale] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            const [allowedTrans, documentList, accDbList,] = await Promise.all([
                IncomeCashOrderServices.getById(
                    props.match.params.id ? [`?id=${props.match.params.id}`] : props.location.search
                ),
                //IncomeCashOrderServices.getById(docId ? docId : 0),
                HelperServices.getTransactionSubCountSubAccDBList(),
                HelperServices.getAllowedTransactionICOAll(),
            ]);

            if (props.match.params.id || props.location.search) {
                const allowTrans = await HelperServices.getTransactionSubCountInfo(allowedTrans.data.AllowedTransactionID)
                setModalLink(allowTrans.data)
                const allowTran5 = await HelperServices.getInpaymentSubAccCRList(allowedTrans.data.AllowedTransactionID)
                setMovementsKindList(allowTran5.data)
            }

            if (allowedTrans.data.Tables.length !== 0) {
                setDisabledActions(true);
            }
            if (allowedTrans.data.StatusID === 2) {
                setDisabledActionsBtn(true);
            } 

            if (allowedTrans.data.AllowedTransactionID === 70) {
                setShowTariffScale(true);
            }
            

            setAllowedTransaction(allowedTrans.data.AllowedTransactionID)
            setDocumentList(documentList.data);
            setAccDBList(accDbList.data);
            setAllowedTrans(allowedTrans.data);
            setAddSettlementTableModalData(allowedTrans.data.Tables)  
            mainForm.setFieldsValue({
                ...allowedTrans.data,
                Date: moment(allowedTrans.data.Date, 'DD.MM.YYYY'),
                AllowedTransactionID: props.location.search.length ===5  ? null : allowedTrans.data.AllowedTransactionID,
                SubAccDbID: props.location.search.length ===5  ? null : allowedTrans.data.SubAccDbID,
                SubAccCrID: props.location.search.length ===5  ? null : allowedTrans.data.SubAccCrID,
            });
            setLoader(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [ props.location.search, props.match.params.id, mainForm]);


   
    const onMainFormFinish = (values) => {
        mainForm.validateFields()
        setLoader(true);
        
        IncomeCashOrderServices.update({
            ...allowTrans, ...values,
            //values.Date = values.Date.format("DD.MM.YYYY"),
            Tables: settlementAddTableModalData
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/IncomeCashOrder`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const organizationHandler = divisionId => {
        if (divisionId === 70) {
            setShowTariffScale(true);
        }
        if (divisionId !== 70) {
            setShowTariffScale(false);
        }
        mainForm.setFieldsValue({
            SubAccCrID: null,
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


    const addTableDataHandler = (data) => {
        if (data !== 0) {
            setDisabledActions(true);
        }
        setAddSettlementTableModalData([...settlementAddTableModalData, data]);
        let Sum = mainForm.getFieldValue('Sum');

        mainForm.setFieldsValue({
            Sum: Sum + +data.Sum
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
            Notification('Validate Failed:', errInfo);
            tableRowChanged = false;
        }
    };

    const TablesDeleteHandler = (row) => {
        const obj = { ...row }
        obj.Status = 3;
        const newData = [...settlementAddTableModalData];

        let Sum = mainForm.getFieldValue('Sum');
        mainForm.setFieldsValue({
            Sum: Sum - +obj.Sum
        });

        const index = newData.findIndex((item) => row.ID === item.ID);
        if (index === 0) {
            setDisabledActions(false)
        }
        newData.splice(index, 1, obj);
        setAddSettlementTableModalData(newData);
    }

    const columns = [
        {
            title: t("SubCountCr1Name"),
            dataIndex: "SubCountCr1Name",
            sorter: true,
            width: 500,
        },
        {
            title: t("SubCountCr2Name"),
            dataIndex: "SubCountCr2Name",
            key: "SubCountCr2Name",
            sorter: true,
            width: 500,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            sorter: true,
            width: 250,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            align: "right",
        },
        {
            title: t('actions'),
            key: 'action',
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
                Sum: col.Sum,
                editing: isEditing(values),
                onEnter: () => save(values.ID),
                onPressEnter: () => save(values.ID),
            })
        };
    });

    return (
        <MainCard title={t("IncomeCashOrder")}>
            <Spin spinning={loader} size='large'>
                <Form
                    // {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>
                     

                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('Number')}
                            </div>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                //label={t('Number')}
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
                        {/* <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('Date')}
                            </div>
                        </Col> */}
                        <Col xl={4} lg={12}>
                            <Form.Item
                                label={t("Date")}
                                name="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    style={{ width: "100%" }}
                                    placeholder={t("Date")}
                                />
                            </Form.Item>
                        </Col>
                        {showTariffScale === false ? null : (
                            <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("ChequeSN")}
                                    name="ChequeSN"
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
                        )}
                        {showTariffScale === false ? null : (
                            <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("ChequeNumber")}
                                    name="ChequeNumber"
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
                        )}

                        {showTariffScale === true ? null : (
                            <Col xl={4} md={16}>
                                <Form.Item
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: t("Please input valid"),
                                //     },
                                // ]}
                                >
                                </Form.Item>
                            </Col>
                        )}
                        {showTariffScale === true ? null : (
                            <Col xl={4} md={16}>
                                <Form.Item
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: t("Please input valid"),
                                //     },
                                // ]}
                                >
                                </Form.Item>
                            </Col>
                        )}
                        
                         <Col xl={4} md={16}>
                            <Form.Item

                            >
                            </Form.Item>
                        </Col> 
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('LimitOperType')}
                            </div>
                        </Col>
                        <Col xl={16} md={8}>
                            <Form.Item
                               // label={t("LimitOperType")}
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
                        <Col xl={4} md={16}>
                            <Form.Item

                            >
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('SubAccDb')}
                            </div>
                        </Col>
                        <Col xl={8} md={8}>
                            <Form.Item
                                //label={t("SubAccDb")}
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
                                    disabled={disabledActions}
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

                        <Col xl={8} md={8}>
                            <Form.Item
                                label={t("SubAccCr")}
                                name="SubAccCrID"
                                style={{ width: "100%" }}
                                disabled={disabledActions}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    // disabled={ settlementAddTableModalData.filter(item => item.Status !== 3).length === 0}
                                    // disabled={ settlementAddTableModalData.filter(item => item.Status !== 3).length !== 0 || settlementAddTableModalData.filter(item => item.Status === 3).length === 0}
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
                        <Col xl={4} md={16}>
                            <Form.Item

                            >
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('Sum')}
                            </div>
                        </Col>
                        <Col xl={4} md={16}>
                            <Form.Item
                                //label={t("Sum")}
                                name="Sum"
                                style={{ width: "100%", }}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: t("Please input valid"),
                            //     },
                            // ]}
                            >
                                <InputNumber
                                    disabled
                                    placeholder={t("Sum")}
                                    className="sum-input"
                                    style={{ color: 'black', width: '100%', textAlign: "right" }}
                                    decimalSeparator=','
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={14} md={16}>
                            <Form.Item

                            >
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('TakeOver')}
                            </div>
                        </Col>
                        <Col xl={8} md={16}>
                            <Form.Item
                               // label={t("TakeOver")}
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

                      
                        <Col xl={8} md={16}>
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
                        <Col xl={4} md={16}>
                            <Form.Item

                            >
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 30 }}>
                                {t('Comment')}
                            </div>
                        </Col>
                        <Col xl={16} lg={12}>
                            <Form.Item
                               // label={t("Matter")}
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
                                disabled={disabledActionsBtn}
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
                                            allowedTransaction={allowedTransaction}
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
                                    }
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
                    <Button disabled={disabledActionsBtn || settlementAddTableModalData.length === 0}
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

export default React.memo(UpdateIncomeCashOrder);