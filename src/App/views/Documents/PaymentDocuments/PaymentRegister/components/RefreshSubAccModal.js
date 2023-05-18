import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { useTranslation } from 'react-i18next';
import HelperServices from '../../../../../../services/Helper/helper.services';
import PaymentOrderServices from '../../../../../../services/Documents/PaymentDocuments/PaymentOrder/PaymentOrder.services';
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

const RefreshSubAccModal = (props) => {
    // console.log(props);
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();

    const [refreshSubAccList, setRefreshSubAccList] = useState([])
    const [subAccDbID, setSubAccDbID] = useState(null)

    const fetchData = async () => {
        const refreshSubAccList = await HelperServices.getSubAccDBListForChangeSubAcc({
            DocumentID: props.params.id, TableID: 129
        })
        setRefreshSubAccList(refreshSubAccList.data)
    }

    useEffect(() => {
        fetchData().catch(err => {
            Notification('error', err)
        })
    }, [])

    const onFinish = () => {
        filterForm.validateFields()
            .then(values => {
                // console.log({ id: props.params.id, SubAccDbID: subAccDbID });
                PaymentOrderServices.changeSubAcc(props.params.id, subAccDbID)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            props.onCancel()
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        props.onCancel()
                    })
            })
    }

    return (
        <Modal
            // width={768}
            title={t("RefreshSubAcc")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    htmlType="submit"
                    form="filterForm"
                    type="primary"
                    onClick={onFinish}
                >
                    {t("OK")}
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
                    <Col xl={24} md={24}>
                        <Form.Item
                            label={t("SubAccDbID")}
                            name="SubAccDbID"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("SubAccDbID")}
                                style={{ width: "100%" }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onSelect={(e) => setSubAccDbID(e)}
                            >
                                {refreshSubAccList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default RefreshSubAccModal