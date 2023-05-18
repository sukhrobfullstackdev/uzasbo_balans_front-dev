import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space, Spin, DatePicker, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import moment from "moment";
import Fade from "react-reveal/Fade";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';

import MainCard from "../../../../components/MainCard";
import InventoryHoldingIntakeServices from '../../../../../services/Documents/InventoryHoldingReserve/InventoryHoldingIntake/InventoryHoldingIntake.services';
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import WarrantModal from '../../InventoryHoldingReserve/InventoryHoldingIntake/components/Modal/WarrantModal'
import DepartmentModal from '../../InventoryHoldingReserve/InventoryHoldingIntake/components/Modal/DepartmentModal'
import ResponsiblePersonModal from '../../InventoryHoldingReserve/InventoryHoldingIntake/components/Modal/ResponsiblePersonModal'
import classes from "./InventoryHoldingIntake.module.css";
import UpdateTable from './components/UpdateTable';
import UpdateTable2 from './components/UpdateTable2';


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

// const { Option } = Select;
const { TabPane } = Tabs;

const UpdateInventoryHoldingIntake = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { size } = useState([]);
    const [mainForm] = Form.useForm();
    const [docId] = useState(props.match.params.id ? props.match.params.id : 0);
    const [loader, setLoader] = useState(true);
    const [inventHoldIntake, setInventHoldIntake] = useState([]);

    //modals
    const [warrantModal, setWarrantModal] = useState();
    const [departmentModal, setDepartmentModal] = useState();
    const [resPersonModal, setResponsiblePersonModal] = useState();
    //modals end

    //Lists
    const [allowTranslist, setAllowTransList] = useState([]);
    const [allowTranslist2, setAllowTransList2] = useState([]);
    //Lists End

    //Tables
    const [Tables, setTables] = useState([]);
    const [Tables2, setTables2] = useState([]);
    //Tables End


    useEffect(() => {
        const fetchData = async () => {
            const [inventoryHoldingIntake, allowTransInDoc, allowTransInDoc2] = await Promise.all([
                InventoryHoldingIntakeServices.getById(docId),
                HelperServices.getAllowedTransactionInDocument(211),
                HelperServices.getAllowedTransactionInDocument2(114),
            ]);

            setInventHoldIntake(inventoryHoldingIntake.data);
            setAllowTransList(allowTransInDoc.data);
            setAllowTransList2(allowTransInDoc2.data)
            setTables(inventoryHoldingIntake.data.ChargesTables);
            setTables2(inventoryHoldingIntake.data.Tables);

            mainForm.setFieldsValue({
                ...inventoryHoldingIntake.data,
                Date: moment(inventoryHoldingIntake.data.Date, 'DD.MM.YYYY'),
            });

            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [docId, mainForm]);


    const onMainFormFinish = (values) => {
        console.log(values);
        values.ID = props.match.params.id ? props.match.params.id : 0;
        values.Date = values.Date.format("DD.MM.YYYY");
        setLoader(true);
        InventoryHoldingIntakeServices.update({
            ...inventHoldIntake, ...values,
            ChargesTables: Tables,
            Tables: Tables2
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/InventoryHoldingIntake`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const onReset = () => {
        mainForm.setFieldsValue({ Warrant: null });
    };

    const selectWarrantName = useCallback((value) => {
        mainForm.setFieldsValue({ Warrant: value.name });
    }, [mainForm]);

    const selectDepartmentName = useCallback((value) => {
        mainForm.setFieldsValue({ Department: value.name });
    }, [mainForm]);

    const selectResponsiblePersonName = useCallback((value) => {
        mainForm.setFieldsValue({ ResponsiblePerson: value.name });
    }, [mainForm]);

    const editTableData = (data) => {
        console.log(data);
        let totalsum = 0;
        data.map(data => {
            if (data.Status !== 3) {
                totalsum += data.Sum
            }
            return null;
        })
        mainForm.setFieldsValue({
            [`Sum`]: totalsum,
        });
        setTables(data);
    };

    const editTableData2 = (data) => {
        setTables2(data);
    };



    return (
        <Fade>
            <MainCard title={t("InventoryHoldingIntake")}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id="mainForm"
                        onFinish={onMainFormFinish}
                    >
                        <Row justify="center" gutter={[15, 0]}
                        >

                            <Col xl={4} md={16} span={6}>
                                <Form.Item
                                    label={t("number")}
                                    name="Number"
                                    style={{ width: "100%" }}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("DocNumber")}
                                    name="DocNumber"
                                    style={{ width: "100%" }}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xl={4} lg={12}>
                                <Form.Item
                                    name="Date"
                                    label={t("Date")}
                                >
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        // className='datepicker'
                                        style={{ width: '100%' }}
                                        placeholder={t("Date")}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("Sum")}
                                    name="Sum"
                                >
                                    <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row justify="center" gutter={[15, 0]}>
                            <Col xl={8} lg={12}>
                                <div className={classes.EmployeeEnrolmentModal}>
                                    <CSSTransition
                                        mountOnEnter
                                        unmountOnExit
                                        in={warrantModal}
                                        timeout={1000}
                                    >
                                        <WarrantModal
                                            visible={warrantModal}
                                            onCancel={() => setWarrantModal(false)}
                                            onSelect={selectWarrantName}
                                        />
                                    </CSSTransition>

                                    <Form.Item
                                        label={t("Warrant")}
                                        name="Warrant"
                                        style={{ width: "100%" }}
                                        rules={[
                                            {
                                                message: t("Please input valid"),
                                            },
                                        ]}>
                                        <Input disabled
                                            style={{ color: 'black' }} />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setWarrantModal(true);
                                        }}
                                        style={{ marginTop: 38 }}
                                        icon={<SearchOutlined />}
                                        size={size}
                                    />

                                    <Button
                                        type="primary"
                                        onClick={onReset}
                                        style={{ marginTop: 38 }}
                                        icon={<DeleteOutlined />}
                                        size={size}
                                    />

                                </div>
                            </Col>

                            <Col xl={6} lg={12}>
                                <div className={classes.EmployeeEnrolmentModal}>
                                    <CSSTransition
                                        mountOnEnter
                                        unmountOnExit
                                        in={departmentModal}
                                        timeout={1000}
                                    >
                                        <DepartmentModal
                                            visible={departmentModal}
                                            onCancel={() => setDepartmentModal(false)}
                                            onSelect={selectDepartmentName}
                                        />
                                    </CSSTransition>

                                    <Form.Item
                                        label={t("Department")}
                                        name="Department"
                                        style={{ width: "100%" }}
                                        rules={[
                                            {
                                                // required: true,
                                                message: t("Please input valid"),
                                            },
                                        ]}>
                                        <Input disabled
                                            style={{ color: 'black' }} />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setDepartmentModal(true);
                                        }}
                                        style={{ marginTop: 38 }}
                                        icon={<SearchOutlined />}
                                        size={size}
                                    />

                                </div>
                            </Col>

                            <Col xl={6} lg={12}>
                                <div className={classes.EmployeeEnrolmentModal}>
                                    <CSSTransition
                                        mountOnEnter
                                        unmountOnExit
                                        in={resPersonModal}
                                        timeout={1000}
                                    >
                                        <ResponsiblePersonModal
                                            visible={resPersonModal}
                                            onCancel={() => setResponsiblePersonModal(false)}
                                            onSelect={selectResponsiblePersonName}
                                        />
                                    </CSSTransition>

                                    <Form.Item
                                        label={t("ResponsiblePerson")}
                                        name="ResponsiblePerson"
                                        style={{ width: "100%" }}
                                        rules={[
                                            {
                                                // required: true,
                                                message: t("Please input valid"),
                                            },
                                        ]}>
                                        <Input disabled
                                            style={{ color: 'black' }} />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setResponsiblePersonModal(true);
                                        }}
                                        style={{ marginTop: 38 }}
                                        icon={<SearchOutlined />}
                                        size={size}
                                    />

                                </div>
                            </Col>

                        </Row>

                        <Tabs defaultActiveKey="1">
                            <TabPane tab={t('inventHoldFirstTab')} key="1">

                                <UpdateTable
                                    data={Tables}
                                    editTableData={editTableData}
                                    allowTranslist={allowTranslist}

                                />

                            </TabPane>

                            <TabPane tab={t('inventHoldSecondTab')} key="2">

                                <UpdateTable2
                                    data={Tables2}
                                    editTableData={editTableData2}
                                    allowTranslist2={allowTranslist2}

                                />

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
                    </Form>
                </Spin>

            </MainCard >

        </Fade >
    );
}

export default React.memo(UpdateInventoryHoldingIntake);