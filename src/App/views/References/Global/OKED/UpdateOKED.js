import { Button, Col, Form, Input, Row, Space, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import OKEDServices from '../../../../../services/References/Global/IncomeUNC copy/OKED.services';
// import classes from "./OKED.module.css";

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

const UpdateOKED = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [OKED, setOKED] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [OKED] = await Promise.all([
                OKEDServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getChapterList(),
                HelperServices.getTreasuryBranchList(),
                HelperServices.getStateList()

            ]);
            setOKED(OKED.data);

            // }

            mainForm.setFieldsValue({
                ...OKED.data,

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
        OKEDServices.update({
            ...OKED, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/OKED`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    return (
        <Card title={t("OKED")}>
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

                        <Col xl={14} md={16}>
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
                                 <Input placeholder={t('name')} />
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

                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("ParentID")}
                                name="ParentID"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                 <Input placeholder={t('ParentID')} />
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

export default UpdateOKED;