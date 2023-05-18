import { Button, Col, Form, Input, Row, Select, Space, Spin, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import CurrencyCourseServices from "../../../../../services/References/Global/CurrencyCourse/CurrencyCourse.services";
import classes from "./CurrencyCourse.module.css";
import moment from "moment";

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
    const [currencyList, setCurrencyList] = useState([]);
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [infoBanks, setInfoBank] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [infoBanks, currencyLs] = await Promise.all([
                CurrencyCourseServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getCurrencyList(),
            ]);
            setInfoBank(infoBanks.data);
            setCurrencyList(currencyLs.data.rows);

            mainForm.setFieldsValue({
                ...infoBanks.data,
                Date: moment(infoBanks.data.Date, 'DD.MM.YYYY'),
                CurrencyID: infoBanks.data.ID === 0 ? null : infoBanks.data.CurrencyID,
                Course: infoBanks.data.ID === 0 ? null : infoBanks.data.Course,

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
        CurrencyCourseServices.update({
            ...infoBanks, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/CurrencyCource`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    return (
        <Card title={t("CurrencyCourse")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                    <Col xl={4} lg={12}>
                    <Form.Item
                      label={t("currency")}
                      name="CurrencyID"
                      rules={[
                        {
                          required: true,
                          message: t('pleaseSelect'),
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        placeholder={t("currency")}
                        //onChange={currencyChangeHandler}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {currencyList.map((item) => (
                          <Option key={item.ID} value={item.ID}>
                            {item.Name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                        <Col xl={4} md={16}>
                            <Form.Item
                                label={t("Date")}
                                name="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col xl={4} md={8}>
                            <div className={classes.EmployeeEnrolmentModal}>
                                <Form.Item
                                    label={t("Course")}
                                    name="Course"
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

export default UpdateInfoBank;