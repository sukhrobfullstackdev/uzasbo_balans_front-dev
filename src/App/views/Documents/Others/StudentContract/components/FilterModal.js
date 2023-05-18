import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row } from 'antd';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import moment from "moment";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const FilterModal = (props) => {
    console.log(props);
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();

    useEffect(() => {
        filterForm.setFieldsValue({
            ...props.filter,
            date: props.filter.date ? moment(props.filter.date, 'DD.MM.YYYY') : null,
            startyear: props.filter.startyear ? moment(props.filter.startyear, 'YYYY') : null,
            endyear: props.filter.endyear ? moment(props.filter.endyear, 'YYYY') : null,
        });
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
                            label={t("number")}
                            name="number"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("number")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("date")}
                            name="date"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <DatePicker placeholder={t("date")} style={{ width: "100%" }} format="DD.MM.YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Summa")}
                            name="summa"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber placeholder={t("Summa")} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Acad-Start")}
                            name="startyear"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <DatePicker placeholder={t("Acad-Start")} style={{ width: "100%" }} picker="year" />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Acad -End")}
                            name="endyear"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <DatePicker placeholder={t("Acad -End")} style={{ width: "100%" }} picker="year" />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Course")}
                            name="kurs"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("Course")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("faculty")}
                            name="fakultet"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("faculty")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Direction")}
                            name="yonalish"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("Direction")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("Group")}
                            name="group"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("Group")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("settlementAccountCode")}
                            name="accountcode"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber placeholder={t("settlementAccountCode")} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("status")}
                            name="status"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("status")} />
                        </Form.Item>
                    </Col>
                    <Col xl={6} md={12}>
                        <Form.Item
                            label={t("comment")}
                            name="comment"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: false,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input placeholder={t("comment")} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default FilterModal;