import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row,  Space, Spin,  DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import MainCard from "../../../../components/MainCard";
import PermanentAssetReappraisalServices from '../../../../../services/Documents/AccountingofFixedAssets/PermanentAssetReappraisal/PermanentAssetReappraisal.services';
import { Notification } from '../../../../../helpers/notifications';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdatePermanentAssetReappraisal = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [allowTrans, setAllowedTrans] = useState([]);
    const [docId] = useState(props.match.params.id ? props.match.params.id : 0);

    useEffect(() => {
        const fetchData = async () => {
            const [allowedTrans,] = await Promise.all([
                PermanentAssetReappraisalServices.getById(docId ? docId : 0),             
            ]);

            setAllowedTrans(allowedTrans.data);
            
            mainForm.setFieldsValue({
                ...allowedTrans.data,
                Date: moment(allowedTrans.data.Date, 'DD.MM.YYYY'),
            });
            setLoader(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [docId, mainForm]);


    const onMainFormFinish = (values) => {
        setLoader(true);
        PermanentAssetReappraisalServices.update({
            ...allowTrans, ...values,
            //values.Date = values.Date.format("DD.MM.YYYY"),
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/PermanentAssetReappraisal`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <MainCard title={t("PermanentAssetReappraisal")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={3} md={16}>
                            <Form.Item
                                label={t("Number")}
                                name="Number"
                                style={{ width: "100%" }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("Date")}
                      name="Date"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: "100%" }}
                        placeholder={t("Date")}
                      />
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
        </MainCard>
    )
}

export default React.memo(UpdatePermanentAssetReappraisal);