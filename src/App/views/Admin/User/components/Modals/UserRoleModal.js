import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Admin/User/User.services';

const UserRoleModal = (props) => {

    const { t } = useTranslation();

    const roleModalColumns = [
        {
            title: t('id'),
            dataIndex: 'ID',
            width: 80,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t('Name'),
            dataIndex: 'Name',
            sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
    ];

    const [userRoleLoading, setUserRoleLoading] = useState(false);
    const [userRolesModel, setUserRolesModel] = useState([]);
    const [userRolesModelFilter, setUserRolesModelFilter] = useState([]);
    const [userRolesModel1, setUserRolesModel1] = useState([]);
    const [userRolesModel1Filter, setUserRolesModel1Filter] = useState([]);

    useEffect(() => {
        getUserRole(props.id);
    }, [props.id]);

    const getUserRole = (id) => {
        setUserRoleLoading(true);
        UserServices.getRole(id)
            .then(response => {
                setUserRoleLoading(false);
                // setUserRole(response.data);
                setUserRolesModel(response.data.RolesModel);
                setUserRolesModelFilter(response.data.RolesModel);
                setUserRolesModel1(response.data.RolesModel1);
                setUserRolesModel1Filter(response.data.RolesModel1);
            }).catch(error => {
                setUserRoleLoading(false);
                Notification('error', error);
            });
    };

    const onSearchLeft = (event) => {
        const filteredModels = userRolesModelFilter.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setUserRolesModel(filteredModels);
    };

    const onSearchRight = (event) => {
        const filteredModels = userRolesModel1Filter.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setUserRolesModel1(filteredModels);
    };

    const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
    const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
    const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
    const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

    const [selectedButtonRight, setSelectedButtonRight] = useState(true);
    const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
    const [selectedModelsRight, setSelectedModelsRight] = useState([]);
    const [selectedRowKeysRight, setRowKeysRight] = useState([]);

    const resetTableLeft = () => {
        setRowKeysLeft([]);
    };

    const resetTableRight = () => {
        setRowKeysRight([]);
    };

    const rowSelectionLeft = {
        selectedRowKeys: selectedRowKeysLeft,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedModelsLeft(selectedRows);
            setRowKeysLeft(selectedRowKeys);
            if (selectedRows.length > 0) {
                setSelectedButtonLeft(false);
            } else {
                setSelectedButtonLeft(true);
            }
        },
    };

    const rowSelectionRight = {
        selectedRowKeys: selectedRowKeysRight,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedModelsRight(selectedRows);
            setRowKeysRight(selectedRowKeys);
            if (selectedRows.length > 0) {
                setSelectedButtonRight(false);
            } else {
                setSelectedButtonRight(true);
            }
        },
    };

    const handleSubmitSelectedRowsLeft = () => {
        setSelectedButtonLeftLoading(true);
        const checkedSelectedModelsLeft = selectedModelsLeft.map(item => {
            item.Check = true
            return item;
        });

        UserServices.updateRole({ ID: props.id, RolesModel: checkedSelectedModelsLeft })
            .then(response => {
                getUserRole(props.id);
                setSelectedButtonLeft(true);
                setSelectedButtonLeftLoading(false);
            }).catch(error => {
                Notification('error', error)
            });
    }

    const handleSubmitSelectedRowsRight = () => {
        setSelectedButtonRightLoading(true);
        const checkedSelectedModelsRight = selectedModelsRight.map(item => {
            item.Check = true
            return item;
        });

        UserServices.updateRole1({ ID: props.id, RolesModel1: checkedSelectedModelsRight })
            .then(response => {
                getUserRole(props.id);
                setSelectedButtonRight(true);
                setSelectedButtonRightLoading(false);
            }).catch(error => {
                Notification('error', error)
            });
    }

    return (
        <Modal
            width={1000}
            title={t("role")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={false}
        >
            <Row>
                <Col span={11}>
                    <Input
                        onChange={onSearchLeft}
                        placeholder={t("Search")}
                    />
                    <Table
                        bordered
                        size="middle"
                        rowClassName="table-row"
                        className="main-table mt-4"
                        columns={roleModalColumns}
                        dataSource={userRolesModel}
                        loading={userRoleLoading}
                        scroll={{ y: "40vh" }}
                        rowKey={record => record.ID}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelectionLeft,
                        }}
                    />
                </Col>
                <Col span={2} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <Button
                        style={{ margin: "8px" }}
                        disabled={selectedButtonLeft}
                        loading={selectedButtonLeftLoading}
                        className="d-flex justify-content-center align-items-center"
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        onClick={() => {
                            handleSubmitSelectedRowsLeft();
                            resetTableLeft();
                        }}
                    />
                    <Button
                        style={{ margin: "8px" }}
                        disabled={selectedButtonRight}
                        loading={selectedButtonRightLoading}
                        className="d-flex justify-content-center align-items-center"
                        type="primary" icon={<ArrowLeftOutlined />}
                        onClick={() => {
                            handleSubmitSelectedRowsRight();
                            resetTableRight();
                        }}
                    />
                </Col>
                <Col span={11}>
                    <Input
                        onChange={onSearchRight}
                        placeholder={t("Search")}
                    />
                    <Table
                        bordered
                        size="middle"
                        rowClassName="table-row"
                        className="main-table mt-4"
                        columns={roleModalColumns}
                        dataSource={userRolesModel1}
                        loading={userRoleLoading}
                        scroll={{ y: "40vh" }}
                        rowKey={record => record.ID}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelectionRight,
                        }}
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default UserRoleModal;