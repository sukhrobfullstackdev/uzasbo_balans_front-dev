import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';
import HelperServices from '../../../../../../services/Helper/helper.services';
import ContractorsServices from "./../../../../../../services/References/Organizational/Contractors/Contractors.services";
import { Notification } from '../../../../../../helpers/notifications';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const AccountDetailsModal = (props) => {
    // console.log(props);
    const { ContractorPayeeID } = props.params;
    const { t } = useTranslation();
    const [updateForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [profile, seProfile] = useState([]);
    const [bankList, setBankList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [profile, bankList] = await Promise.all([
                ContractorsServices.getProfile(),
                HelperServices.GetBankList(),
            ]);
            seProfile(profile.data);
            setBankList(bankList.data);
            if (profile.data.ID !== 0) {
                updateForm.setFieldsValue({
                    ...profile.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [])

    const onFinish = (values) => {
        // console.log({ ...profile, ...values })
        ContractorsServices.updateProfile({ ...profile, ...values })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    return (
        <Modal
            width={768}
            title={t("AccountDetails")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    type="primary"
                    form='updateForm'
                    htmlType="submit"
                // onClick={selectRow}
                >
                    {t("save")}
                </Button>,
            ]}
        >
            <Spin size='large' spinning={loader}>
                <Form
                    {...layout}
                    form={updateForm}
                    id="updateForm"
                    onFinish={onFinish}
                    initialValues={{
                        EditName: "Основной",
                        ContractorID: ContractorPayeeID !== 0 ? ContractorPayeeID : null,
                    }}
                >
                    <Row gutter={[15, 0]}>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("Name")}
                                name="EditName"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('Name')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("settlementAccount")}
                                name="SettlementAccount"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('settlementAccount')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("BankCode")}
                                name="BankID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("BankCode")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {bankList.map(item =>
                                        <Option key={item.ID} value={item.ID} >
                                            {item.Code}
                                        </Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={12} md={12}>
                            <Form.Item
                                label={t("Contractor")}
                                name="ContractorID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }} disabled
                                    placeholder={t('Contractor')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default AccountDetailsModal;