import React from 'react';
import { Modal, Form, Input, Button, Spin, Select } from "antd";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Notification } from "../../../../../helpers/notifications";
import { documetType } from './documentConstants';
import { setListPagination } from "../_redux/changeDocStatusSlice";
import ChangeDocStatusServices
    from "../../../../../services/Admin/ChangeDocStatus/ChangeDocStatus.services";
import { CSSTransition } from 'react-transition-group';

const { Option } = Select;

const AddDocument = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        // setDeleteLoading(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log(values);
        setLoading(true);
        ChangeDocStatusServices.updateDocument(values)
            .then(response => {
                setLoading(false);
                Notification('success', t("added"));
                dispatch(
                    setListPagination({
                        PageNumber: 1,
                        PageLimit: 10,
                    })
                );
            }).catch(error => {
                setLoading(false);
                // console.log(error);
                Notification('error', error);
            });
        setIsModalVisible(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
            >
                {t("add")}{" "}
                <i className="feather icon-plus ml-1" />
            </Button>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <Modal
                    width={768}
                    title={t("userRoles")} visible={isModalVisible}
                    onOk={handleOk} onCancel={handleCancel}
                    footer={[
                        <Button key="submit" form="editRole" htmlType="submit" type="primary" onClick={handleOk}>
                            {t("save")}
                        </Button>,
                        <Button key="back" onClick={handleCancel}>
                            {t("close")}
                        </Button>,
                    ]}
                >
                    <Spin spinning={loading} size='large'>
                        <Form
                            name="basic"
                            id="editRole"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                organizationID: `0`,
                                documentID: `0`,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label={t("OrganizationID")}
                                name="organizationID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("OrganizationID")} />
                            </Form.Item>
                            <Form.Item
                                label={t("OrgINN")}
                                name="organizationINN"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("OrgINN")} />
                            </Form.Item>
                            <Form.Item
                                label={t("Document")}
                                name="document"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder={t("docType")}
                                // onChange={filterTypeHandler}
                                >
                                    {documetType.map((type, index) => {
                                        return (
                                            <Option
                                                key={index} value={type.value}
                                            >
                                                {type.value}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("DocumentID")}
                                name="documentID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("DocumentID")} />
                            </Form.Item>
                            <Form.Item
                                label={t("reason")}
                                name="comment"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("reason")} />
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal>
            </CSSTransition>
        </>
    )
};

export default AddDocument;