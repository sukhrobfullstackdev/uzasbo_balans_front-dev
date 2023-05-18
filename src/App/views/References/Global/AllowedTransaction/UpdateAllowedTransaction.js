import { Button, Col, Form, Input, Row, Select, Space, Spin, Table, Switch, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next';

import Card from "../../../../components/MainCard";
import { useHistory } from 'react-router-dom';
import AllowedTransactionServices from "../../../../../services/References/Global/AllowedTransaction/AllowedTransaction.services";
import { Notification } from '../../../../../helpers/notifications';
import InfoAccServices from "../../../../../services/References/Global/InfoAcc/InfoAcc.services";
import HelperServices from '../../../../../services/Helper/helper.services';
import { CSSTransition } from 'react-transition-group';
import EditSettelmentModal from './components/EditSettelmentModal';
import AddSettelmentModal from './components/AddSettelmentModal';
import classes from './AllowedTransaction.module.css';


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

const UpdateContractors = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [TableForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [allowTrans, setAllowedTrans] = useState([]);
    const [allowTransTables, setAllowTransTables] = useState([]);

    const [documentList, setDocumentList] = useState([]);
    const [accDbList, setAccDBList] = useState([]);
    const [movementsKindList, setMovementsKindList] = useState([]);
    const [accDbID, setAccDbID] = useState();
    const [accCrID, setAccCrID] = useState();

    const [settlementTableModalData, setEditSettlementTableModalData] = useState([]);
    const [settlementAddTableModalData, setAddSettlementTableModalData] = useState([]);

    const [editsettlementTableModalVisible, setEditSettlementTableModalVisible] = useState(false);
    const [addsettlementTableModalVisible, setAddSettlementTableModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [allowedTrans, documentList, accDbList, movementsKindList] = await Promise.all([
                AllowedTransactionServices.getById(props.match.params.id ? props.match.params.id : 0),
                InfoAccServices.getsysTable(),
                InfoAccServices.getInfoAccList2(accDbID, accCrID),
                HelperServices.getMoneyMeansMovementsKind(),
            ]);
            setAccDbID(allowedTrans.data.AccDbID)
            setAccCrID(allowedTrans.data.AccCrID)
            setAllowTransTables(allowedTrans.data.Tables);
            setDocumentList(documentList.data);
            setAccDBList(accDbList.data);
            setAllowedTrans(allowedTrans.data);
            setMovementsKindList(movementsKindList.data);
            setAddSettlementTableModalData(allowedTrans.data.Tables)
            mainForm.setFieldsValue({
                ...allowedTrans.data,
                // AllowedTransactionID: movementsKindList.data.DisplayName
                AccDbID: allowedTrans.data.ID === 0 ? null : allowedTrans.data.AccDbID,
                AccCrID: allowedTrans.data.ID === 0 ? null : allowedTrans.data.AccCrID,
                DocumentID: allowedTrans.data.ID === 0 ? null : allowedTrans.data.DocumentID,

            });
            setLoader(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [props.match.params.id,accCrID, accDbID, mainForm]);


    const onMainFormFinish = (values) => {
        setLoader(true);
        AllowedTransactionServices.update({
            ...allowTrans, ...values,
            Tables: allowTransTables
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/AllowedTransaction`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    // modal 

    const closeFunctionalItemModal = useCallback(() => {
        setAddSettlementTableModalVisible(false)
    }, []);

    const createFunctionalItemHandler = useCallback((values) => {
        console.log(values)
        Notification('success', t('success-msg'));
        setAddSettlementTableModalData((prevState) => [values, ...prevState])
        setAddSettlementTableModalVisible(false);
    }, [t]);

    const editSettlementTableHandler = useCallback((values) => {
        setAddSettlementTableModalData(values)
        setEditSettlementTableModalVisible(false);
        Notification('success', t('edited'));
    }, [t]);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            width: 100,
            sorter: true,
        },
        {
            title: t("AllowedTransactionID"),
            dataIndex: "MoneyMeansMovementsKindID",
            // key: "AllowedTransactionID",
            sorter: true,
            width: 250,
            editable: true,
            render: (MoneyMeansMovementsKindID) => {
                const movementsKindLs = movementsKindList.find(item => item.ID === MoneyMeansMovementsKindID);
                return movementsKindLs ? <div className='ellipsis-2'>{movementsKindLs.DisplayName}</div> : '';
            }
        },
        {
            title: t("AllowedTransactionID"),
            dataIndex: "MoneyMeansMovementsKindID",
            key: "MoneyMeansMovementsKindID",
            width: 250,
            sorter: true,
        },
        {
            title: t("Source"),
            dataIndex: "Source",
            key: "Source",
            sorter: true,
            // width: 150,
        },
        {
            title: t("TreasOperCode"),
            dataIndex: "TreasOperCode",
            key: "TreasOperCode",
            sorter: true,
            // width: 150,
        },
        {
            title: '',
            dataIndex: "",
            key: "",
            sorter: false,
            // width: 50,
        },
        {
            title: t('actions'),
            key: 'action',
            align: 'center',
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t('Edit')}>
                            <span
                                onClick={() => {
                                    setEditSettlementTableModalVisible(true);
                                    setEditSettlementTableModalData(record);
                                }}
                            >
                                <i className={`feather icon-edit action-icon`} />
                            </span>
                        </Tooltip>

                    </Space>
                )
            },
        },

    ];

    return (
        <Card title={t("AllowedTransaction")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={2} md={16}>
                            <Form.Item
                                label={t("id")}
                                name="ID"
                                style={{ width: "100%" }}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("name")}
                                name="Name"
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

                        <Col xl={3} md={16}>
                            <Form.Item
                                label={t("TransName")}
                                name="Code"
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

                        <Col xl={6} md={8}>
                            <Form.Item
                                label={t("AccDb")}
                                name="AccDbID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    placeholder={t("AccDb")}
                                    showSearch
                                    optionFilterProp="children"
                                // onClick={handleAccDb}
                                >
                                    {accDbList.map((accDb) => (
                                        <Option key={accDb.ID} value={accDb.ID}>
                                            {accDb.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={6} md={8}>
                            <Form.Item
                                label={t("AccCr")}
                                name="AccCrID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    placeholder={t("AccCr")}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {accDbList.map((accCr) => (
                                        <Option key={accCr.ID} value={accCr.ID}>
                                            {accCr.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={5} md={8}>
                            <Form.Item
                                label={t("Document")}
                                name="DocumentID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    placeholder={t("Document")}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {documentList.map((document) => (
                                        <Option key={document.ID} value={document.ID}>
                                            {document.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={2} md={16}>
                            <Form.Item
                                label={t("MemorialOrderNumber")}
                                name="MemorialOrderNumber"
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

                        <Col xl={3} lg={12}>
                            <Form.Item
                                label={t('CanFixingTransaction')}
                                name='CanFixingTransaction'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>

                <Form
                    form={TableForm}
                    // onFinish={addClassTableDataHandler}
                    component={false}
                >
                    <Tabs defaultActiveKey="1">

                        <TabPane tab={t('Settelment')} key="1" >
                            <Button
                                style={{ marginBottom: 15 }}
                                type="primary"
                                onClick={() => {
                                    setAddSettlementTableModalVisible(true);
                                }}>
                                {t('add-new')} +
                            </Button>
                            <CSSTransition
                                mountOnEnter
                                unmountOnExit
                                in={addsettlementTableModalVisible}
                                timeout={300}
                            >
                                <AddSettelmentModal
                                    visible={addsettlementTableModalVisible}
                                    tableData={settlementAddTableModalData}
                                    onCancel={closeFunctionalItemModal}
                                    onCreate={createFunctionalItemHandler}

                                />
                            </CSSTransition>
                            <CSSTransition
                                mountOnEnter
                                unmountOnExit
                                in={editsettlementTableModalVisible}
                                timeout={300}
                            >
                                <EditSettelmentModal
                                    visible={editsettlementTableModalVisible}
                                    onCancel={() => setEditSettlementTableModalVisible(false)}
                                    onEdit={editSettlementTableHandler}
                                    tableData={settlementAddTableModalData}
                                    data={settlementTableModalData}

                                />
                            </CSSTransition>

                            <Table
                                size='middle'
                                pagination={false}
                                className="main-table"
                                rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                columns={columns}
                                dataSource={settlementAddTableModalData.filter(item => item.Status !== 3)}
                                loading={loader}
                                scroll={{
                                    x: "max-content",
                                    y: '90vh'
                                }}
                                onRow={(record) => {

                                    return {
                                        onDoubleClick: () => {
                                            setEditSettlementTableModalVisible(true);
                                            setEditSettlementTableModalData(record);
                                        },

                                    }
                                }}
                            />
                        </TabPane>

                        <TabPane tab={t('ItemOfExpensesID')} key="2" >
                            <Row gutter={[15, 0]}>
                                <Col xl={24} lg={12}>
                                    <div className={classes.label}>{t("AccDb")}</div>
                                </Col>
                                <Col xl={12} lg={12}>
                                    <Form.Item
                                        label={t("AllowedItemOfExpenses")}
                                        name="AllowedItemOfExpenses"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t('inputValidData'),
                                    //     },
                                    // ]}
                                    >
                                        <TextArea rows={2} placeholder={t("AllowedItemOfExpenses")} />
                                    </Form.Item>
                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Item
                                        label={t("NotAllowedItemOfExpenses")}
                                        name="NotAllowedItemOfExpenses"
                                    >
                                        <TextArea rows={2} placeholder={t("NotAllowedItemOfExpenses")} />
                                    </Form.Item>
                                </Col>

                            </Row>

                            <Row gutter={[15, 0]}>

                                <Col xl={24} lg={12}>
                                    <div className={classes.label}>{t("AccCr")}</div>
                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Item
                                        label={t("AllowedItemOfExpenses1")}
                                        name="AllowedItemOfExpenses1"
                                    >
                                        <TextArea rows={2} placeholder={t("AllowedItemOfExpenses1")} />
                                    </Form.Item>
                                </Col>

                                <Col xl={12} lg={12}>
                                    <Form.Item
                                        label={t("NotAllowedItemOfExpenses1")}
                                        name="NotAllowedItemOfExpenses1"
                                    >
                                        <TextArea rows={2} placeholder={t("NotAllowedItemOfExpenses1")} />
                                    </Form.Item>
                                </Col>
                            </Row>
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

        </Card>
    )
}

export default React.memo(UpdateContractors);