import { Button, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import InfoBankServices from "../../../../../services/References/Global/InfoBank/InfoBank.services";
import classes from "./InfoBank.module.css";

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

const UpdateInfoBank = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [infoBanks, setInfoBank] = useState([]);
    const [bankList, setBankList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [infoBanks, infoBankList] = await Promise.all([
                InfoBankServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getBankParentCodeList(),

            ]);   
            setInfoBank(infoBanks.data);
            setBankList(infoBankList.data);

            mainForm.setFieldsValue({
                ...infoBanks.data,

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
        InfoBankServices.update({
            ...infoBanks, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/InfoBank`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <Card title={t("InfoBank")}>
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
                                    label={t("BankCode")}
                                    name="Code"
                                    style={{ width: "100%" }}
                                    >
                                    <Input />
                                </Form.Item>
                            </div>
                        </Col>

                        <Col xl={12} md={16}>
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

                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("Banks")}
                                name="StateID"
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
                                    {bankList.map((accs) => (
                                        <Option key={accs.ID} value={accs.ID}>
                                            {accs.Name}
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

export default UpdateInfoBank;