import React from 'react';
import { Modal, Form, Input, Button, Spin } from "antd";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Notification } from "../../../../../helpers/notifications";
import RoleServices from '../../../../../services/Admin/Roles/Role.services';
import { setListPagination } from '../_redux/rolesSlice';
import { useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

const AddRoleModal = () => {

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
        // console.log('Success:', values);
        setLoading(true);
        RoleServices.updateRole({ ID: "0", name: values.name })
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
                        // <Button
                        //     onClick={handleOk}
                        // >
                        //     {t("verify")}
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
                            id="editRole"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                // name: `${role.Name}`,
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

export default AddRoleModal;