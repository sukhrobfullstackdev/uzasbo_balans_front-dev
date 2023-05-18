import { Button, Col, Form, Input, Row, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import UserSettlementAccountServices from '../../../../../services/References/Global/UserSettlementAccount/UserSettlementAccount.services';
import classes from "./UserSettlementAccount.module.css";

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

const UpdateUserSettlementAccount = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [UserSettlementAccount, setUserSettlementAccount] = useState([]);
    


    useEffect(() => {
        const fetchData = async () => {
            const [UserSettlementAccount] = await Promise.all([
                UserSettlementAccountServices.getById(props.match.params.id ? props.match.params.id : 0),
             
            ]);
            setUserSettlementAccount(UserSettlementAccount.data);

            mainForm.setFieldsValue({
                ...UserSettlementAccount.data,

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
        UserSettlementAccountServices.update({
            ...UserSettlementAccount, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/UserSettlementAccount`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    return (
        <Card title={t("UserSettlementAccount")}>
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
                                    label={t("UserID")}
                                    name="UserID"
                                    style={{ width: "100%" }}
                                    >
                                    <Input />
                                </Form.Item>
                            </div>
                        </Col>

                        <Col xl={8} md={16}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("OrganizationsSettlementAccountID")}
                                    name="OrganizationsSettlementAccountID"
                                    style={{ width: "100%" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <Input />
                                   
                                </Form.Item>
                                {/* <Form.Item
                                    label={t("ID")}
                                    name="ID"
                                    style={{ width: "100%" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>
                                    <Input />
                                   
                                </Form.Item> */}
                            
                            </div>
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

export default UpdateUserSettlementAccount;