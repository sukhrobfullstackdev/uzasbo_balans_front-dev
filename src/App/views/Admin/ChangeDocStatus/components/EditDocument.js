import { Tooltip, Modal, Form, Input, Button, Spin, Select } from "antd";
import React, { useRef } from 'react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import { Notification } from "../../../../../helpers/notifications";
import ChangeDocStatusServices from "../../../../../services/Admin/ChangeDocStatus/ChangeDocStatus.services";
import { documetType } from "./documentConstants";
import { setListPagination } from "../_redux/changeDocStatusSlice";
import { CSSTransition } from "react-transition-group";

const { Option } = Select;

const EditDocument = ({ id }) => {
    const editForm = useRef(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const paginationData = useSelector((state) => state.changeDocSatus.paginationData);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState({});

    const showModal = () => {
        setIsModalVisible(true);
    };

    const getDocument = (id) => {
        setLoading(true);
        ChangeDocStatusServices.getDocument(id)
            .then(response => {
                setDocument(response.data);
                editForm.current.resetFields()
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                // console.log(error);
                Notification('error', error);
            });
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
                Notification('success', t("edited"));
                dispatch(
                    setListPagination(paginationData)
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
            <Tooltip title={t("editDocument")}>
                <span onClick={() => {
                    showModal();
                    getDocument(id);
                }}>
                    <i className="feather icon-edit action-icon" />
                </span>
            </Tooltip>
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
                            ref={editForm}
                            id="editRole"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                organizationID: document.OrganizationID,
                                organizationINN: document.OrganizationINN,
                                tableID: document.TableID,
                                documentID: document.DocumentID,
                                comment: document.Comment,
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
                                name="tableID"
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
                                    {documetType.map((type) => {
                                        return (
                                            <Option
                                                key={type.value} value={type.value}
                                            >
                                                {type.content}
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

export default EditDocument;