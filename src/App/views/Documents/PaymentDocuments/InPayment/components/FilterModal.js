import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import moment from "moment";
import HelperServices from '../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../helpers/notifications';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { Option } = Select;

const FilterModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();

    const [statusList, setStatusList] = useState([])

    const fetchData = async () => {
        const statusList = await HelperServices.getStatusList()
        setStatusList(statusList.data)
    }

    useEffect(() => {
        filterForm.setFieldsValue({
            ...props.filter,
            date: props.filter.date ? moment(props.filter.date, 'DD.MM.YYYY') : null,
            startyear: props.filter.startyear ? moment(props.filter.startyear, 'YYYY') : null,
            endyear: props.filter.endyear ? moment(props.filter.endyear, 'YYYY') : null,
        });
        fetchData().catch(err => {
            Notification('error', err)
        })
    }, [])

    const handleFilter = () => {
        filterForm.validateFields()
            .then(values => {
                values.date = values.date?.format("DD.MM.YYYY");
                values.startyear = values.startyear?.format("YYYY");
                values.endyear = values.endyear?.format("YYYY");
                props.onFilter(values);
            });
        props.onCancel();
    };

    const handleClear = () => {
        filterForm.resetFields();
    };

    const onFinish = (values) => {
        console.log(values);
        props.onFilter(values);
    };

    return (
        <Modal
            width={768}
            title={t("filter")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    onClick={handleClear}
                >
                    {t("clear")}
                </Button>,
                <Button
                    htmlType="submit"
                    form="filterForm"
                    type="primary"
                    onClick={handleFilter}
                >
                    {t("filter")}
                </Button>,
            ]}
        >
            <Form
                {...layout}
                form={filterForm}
                id="mainForm"
                onFinish={onFinish}
            >
                <Row gutter={[15, 0]}>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("TreasDocID")}
                            name="TreasDocID"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("TreasDocID")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Number")}
                            name="Number"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("Number")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("StartSum")}
                            name="StartSum"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber placeholder={t("StartSum")} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("EndSum")}
                            name="EndSum"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber placeholder={t("EndSum")} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>``
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Status")}
                            name="Status"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("Status")}
                                style={{ width: "100%" }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {statusList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.DisplayName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xl={12} md={12}>
                        <Form.Item
                            label={t("PaymentDetails")}
                            name="PaymentDetails"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("PaymentDetails")} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default FilterModal;