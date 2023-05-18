import { Button, Col, Form, Input, Row, Select, Space, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import InfoAccServices from "../../../../../services/References/Global/InfoAcc/InfoAcc.services";
import classes from "./InfoAcc.module.css";

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
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

const UpdateInfoAcc = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [infoAccs, setInfoAcc] = useState([]);
    const [accList, setAccList] = useState([]);
    const [accSystemList, setAccSystemList] = useState([]);
    const [subCountList, setSubCountList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [infoAccs, accTypeList, accSystemTypeList, subCountList] = await Promise.all([
                InfoAccServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getAccTypeList(),
                HelperServices.getAccSystemTypeList(),
                HelperServices.getSubCountList(),

            ]);   
            setInfoAcc(infoAccs.data);
            setAccList(accTypeList.data);
            setAccSystemList(accSystemTypeList.data);
            setSubCountList(subCountList.data);

            // }

            mainForm.setFieldsValue({
                ...infoAccs.data,
                AccTypeID: infoAccs.data.ID === 0 ? null : infoAccs.data.AccTypeID,
                AccSystemTypeID: infoAccs.data.ID === 0 ? null : infoAccs.data.AccSystemTypeID,

            });
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);


    const onMainFormFinish = (values) => {
        setLoader(true);
        InfoAccServices.update({
            ...infoAccs, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/InfoAcc`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <Card title={t("InfoAcc")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={4} md={8}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("subcode")}
                                    name="Code"
                                    style={{ width: "100%" }}
                                    >
                                    <Input />
                                </Form.Item>
                            </div>
                        </Col>

                        <Col xl={8} md={16}>
                            <div className={classes.EmployeeEnrolmentModal}>
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
                            </div>
                        </Col>

                        <Col xl={2} lg={12}>
                            <Form.Item
                                label={t('IsCurrency')}
                                name='IsCurrency'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                        <Col xl={2} lg={12}>
                            <Form.Item
                                label={t('IsQuantity')}
                                name='IsQuantity'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                        <Col xl={2} lg={12}>
                            <Form.Item
                                label={t('IsOffBalance')}
                                name='IsOffBalance'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("AccType")}
                                name="AccTypeID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {accList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("AccSystemType")}
                                name="AccSystemTypeID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {accSystemList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("SubCount1Name")}
                                name="SubCount1ID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {subCountList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("SubCount2Name")}
                                name="SubCount2ID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {subCountList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("SubCount3Name")}
                                name="SubCount3ID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {subCountList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>
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

export default UpdateInfoAcc;