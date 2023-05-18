import { Button, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import FormaSetCommonServices from '../../../../../services/References/Global/FormaSetCommon/FormaSetCommon.services';
import classes from "./FormaSetCommon.module.css";

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
// import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';


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

const UpdateFormaSetCommon = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [FormaSetCommon, setFormaSetCommon] = useState([]);
    const [unitsOfMeasureList, setUnitsOfMeasureList] = useState([]);
    const [formaSetCommonType, setFormaSetCommonTypeList] = useState([]);
    const [status, setStatus] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [FormaSetCommon, unitsOfMeasureList, formaSetCommonType, status] = await Promise.all([
                FormaSetCommonServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getChapterList(),
                HelperServices.getTreasuryBranchList(),
                HelperServices.getStateList()

            ]);
            setFormaSetCommon(FormaSetCommon.data);
            setUnitsOfMeasureList(unitsOfMeasureList.data);
            setFormaSetCommonTypeList(formaSetCommonType.data);
            setStatus(status.data)


            // }

            mainForm.setFieldsValue({
                ...FormaSetCommon.data,

            });
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);


    const onMainFormFinish = (values) => {
        // console.log({ ...values, Tables: FormaSetCommonTables });
        setLoader(true);
        FormaSetCommonServices.update({
            ...FormaSetCommon, ...values,
            // Tables: FormaSetCommonTables
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/FormaSetCommon`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    return (
        <Card title={t("FormaSetCommon")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={12} md={16}>
                            <Form.Item
                                label={t("FunctionalItemOfExpenseName")}
                                name="FunctionalItemOfExpenseID"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {formaSetCommonType.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("ChapterName")}
                                name="ChapterID"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {unitsOfMeasureList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={4} md={8}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("OrganizationTypeCode")}
                                    name="OrganizationTypeCode"
                                    style={{ width: "100%" }}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </Col>

                        <Col xl={16} md={16}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("OrganizationTypeName")}
                                    name="OrganizationTypeName"
                                    style={{ width: "100%" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <TextArea rows={2} />

                                </Form.Item>
                            </div>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t('StateID')}
                                name="StateID"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={t("StateID")}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                // onChange={statusChangeHandler}

                                >
                                    {status.map(item => {
                                        return (
                                            <Option key={item.ID} value={item.ID} >{item.DisplayName}</Option>)
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {/* <Form
                    component={false}
                >
                    <div style={{ textAlign: 'center' }}>
                        <h5>{t("SettlementAccounts")}</h5>
                    </div>
                    <Table
                        size='middle'
                        pagination={false}
                        className="main-table"
                        rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                        columns={columns}
                        dataSource={FormaSetCommonTables}
                        loading={loader}
                        scroll={{
                            x: "max-content",
                            y: '90vh'
                        }}
                        components={{
                            header: {
                                row: () => <StaffTableHeader
                                    addData={addTableDataHandler}
                                />
                            },
                            body: {
                                cell: EditableCell
                            }
                        }}
                    />
                </Form> */}
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

            {/* <CSSTransition
                mountOnEnter
                unmountOnExit
                in={tableListModal}
                timeout={300}
            >
                <TableDataHistoryModal
                    visible={tableListModal}
                    params={historyParams}
                    onCancel={() => {
                        setTableListModal(false);
                    }}
                    getOrganizationName={tableListModal}
                />
            </CSSTransition> */}
        </Card>
    )
}

export default UpdateFormaSetCommon;