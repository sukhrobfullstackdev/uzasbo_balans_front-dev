import { Button, Col, Form, Input, Row, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import IncomeUNCServices from '../../../../../services/References/Global/IncomeUNC/IncomeUNC.services';
// import classes from "./IncomeUNC.module.css";

import Card from "../../../../components/MainCard";
// import HelperServices from '../../../../../services/Helper/helper.services';
// import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';


const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TextArea } = Input;
// const { Option } = Select;

const UpdateIncomeUNC = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [IncomeUNC, setIncomeUNC] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [IncomeUNC] = await Promise.all([
                IncomeUNCServices.getById(props.match.params.id ? props.match.params.id : 0)

            ]);
            setIncomeUNC(IncomeUNC.data);

            mainForm.setFieldsValue({
                ...IncomeUNC.data,

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
        IncomeUNCServices.update({
            ...IncomeUNC, ...values,
        })
            .then((res) => {
                if (res.status === 200 || res.status === 400) {
                    setLoader(false);
                    history.push(`/IncomeUNC`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    return (
        <Card title={t("IncomeUNC")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={3} md={16}>

                        </Col>

                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("code")}
                                name="Code"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input placeholder={t('code')} />

                            </Form.Item>
                        </Col>

                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("StateID")}
                                name="StateID"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Input placeholder={t('StateID')} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xl={18} md={16}>
                            <Form.Item
                                label={t("name")}
                                name="Name"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <TextArea rows={3} placeholder={t("Name")} />
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

export default UpdateIncomeUNC;