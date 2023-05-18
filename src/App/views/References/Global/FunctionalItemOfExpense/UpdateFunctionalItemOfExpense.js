import { Button, Col, Form, InputNumber, Input, Row, Space, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import FunctionalItemOfExpenseServices from "../../../../../services/References/Global/FunctionalItemOfExpense/FunctionalItemOfExpense.services";
// import classes from "./FunctionalItemOfExpense.module.css";

import Card from "../../../../components/MainCard";
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

const { TextArea } = Input;

const UpdateFunctionalItemOfExpense = (props) => {
    const { t } = useTranslation();
    // const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [funcItems, setFuncItem] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [funcItems] = await Promise.all([
                FunctionalItemOfExpenseServices.getById(props.match.params.id ? props.match.params.id : 0),

            ]);
            setFuncItem(funcItems.data);

            // }

            mainForm.setFieldsValue({
                ...funcItems.data,

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
        FunctionalItemOfExpenseServices.update({
            ...funcItems, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/FunctionalItemOfExpense`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <Card title={t("FunctionalItemOfExpense")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={4} md={8}>
                            {/* <div className={classes.EmployeeEnrolmentModal}> */}
                                <Form.Item
                                    label={t("code")}
                                    name="Code"
                                    
                                >
                                    <InputNumber style={{ width: "100%" }}/>
                                </Form.Item>
                            {/* </div> */}
                        </Col>

                        <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("Code1")}
                                    name="Code1"
                                    
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <InputNumber style={{ width: "100%" }}/>

                                </Form.Item>
                        </Col>

                        <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("Code2")}
                                    name="Code2"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <InputNumber style={{ width: "100%" }}/>

                                </Form.Item>
                        </Col>

                        <Col xl={4} md={16}>
                                <Form.Item
                                    label={t("Code3")}
                                    name="Code3"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <InputNumber style={{ width: "100%" }}/>

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

                        <Col xl={18} lg={12}>
                            <Form.Item
                                label={t("name")}
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: t('inputValidData'),
                                    },
                                ]}
                            >
                                <TextArea rows={1} placeholder={t("Name")} />
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

export default UpdateFunctionalItemOfExpense;