import { Button, Col, Form, Input, Row, Spin, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import TreasOperDateServices from "../../../../../services/References/Global/TreasOperDate/TreasOperDate.services";
import classes from "./TreasOperDate.module.css";

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};


const UpdateTreasOperDate = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [OperDates, setOperDate] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [OperDates] = await Promise.all([
                TreasOperDateServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getBankParentCodeList(),

            ]);   
            setOperDate(OperDates.data);

            // }

            mainForm.setFieldsValue({
                ...OperDates.data,

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
        TreasOperDateServices.update({
            ...OperDates, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/OperDate`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <Card title={t("OperDate")}>
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
                                    label={t("OperDate")}
                                    name="OperDate"
                                    style={{ width: "100%" }}
                                    >
                                    <Input />
                                </Form.Item>
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

export default UpdateTreasOperDate;