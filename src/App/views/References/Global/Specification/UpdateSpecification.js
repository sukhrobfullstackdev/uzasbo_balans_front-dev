import { Button, Col, Form, Input, Row, Space, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import SpecificationServices from '../../../../../services/References/Global/Specification/Specification.services';
import classes from "./Specification.module.css";

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

const UpdateSpecification = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [Specification, setSpecification] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [Specification] = await Promise.all([
                SpecificationServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getChapterList(),
                HelperServices.getTreasuryBranchList(),
                HelperServices.getStateList()

            ]);
            setSpecification(Specification.data);


            // }

            mainForm.setFieldsValue({
                ...Specification.data,

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
        SpecificationServices.update({
            ...Specification, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/Specification`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    return (
        <Card title={t("Specification")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={4} md={8}>

                        </Col>

                        <Col xl={4} md={8}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("code")}
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

                        <Col xl={2} md={16}>
                            <Form.Item
                                label={t("InfoType")}
                                name="Type"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        </Row>

                        <Row gutter={[15, 0]}>
                        
                        <Col xl={4} md={16}>
                            
                        </Col>

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("Parent")}
                                name="Parent"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xl={2} lg={12}>
                            <Form.Item
                                label={t('IsGroup')}
                                name='IsGroup'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                        <Col xl={2} lg={12}>
                            
                        </Col>

                        <Col xl={2} md={16}>
                            <Form.Item
                                label={t("status")}
                                name="State"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Input />
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

export default UpdateSpecification;