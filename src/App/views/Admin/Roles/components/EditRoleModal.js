import { Tooltip, Modal, Form, Input, Button, Spin } from "antd";
import React, { useRef } from 'react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { Notification } from "../../../../../helpers/notifications";
import RoleServices from "../../../../../services/Admin/Roles/Role.services";
import { setListPagination } from "../_redux/rolesSlice";

const EditRoleModal = ({ id }) => {
    const editForm = useRef(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState({});

    const showModal = () => {
        setIsModalVisible(true);
    };

    const getRole = () => {
        setLoading(true);
        RoleServices.getRoleModules(id)
            .then(response => {
                setRole(response.data);
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
        // console.log('Success:', values);
        setLoading(true);
        RoleServices.updateRole({ ID: id, name: values.name })
            .then(response => {
                setLoading(false);
                Notification('success', t("edited"));
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
            <Tooltip title={t("editRole")}>
                <span onClick={() => {
                    showModal();
                    getRole(id);
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
                        // <Button
                        //     onClick={handleOk}
                        // >
                        //     Verify
                        // </Button>,
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
                                name: `${role.Name}`,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label={t("Name")}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal>
            </CSSTransition>
        </>
    )
}

export default EditRoleModal;