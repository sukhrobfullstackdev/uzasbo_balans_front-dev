import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import RoleServices from '../../../../../services/Admin/Roles/Role.services';

const RoleModulesModal = (props) => {

    const { t } = useTranslation();

    const roleModalColumns = [
        {
            title: t('ID'),
            dataIndex: 'ID',
            width: 80,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t('module'),
            dataIndex: 'Code',
            sorter: (a, b) => a.Code.localeCompare(b.Code),
        },
        {
            title: t('Name'),
            dataIndex: 'Name',
            sorter: (a, b) => a.Name.localeCompare(b.Name),
        },
    ];

    const [loading, setLoading] = useState(false);
    const [userRoleModules, setUserRoleModules] = useState({});
    const [modulesLeft, setModulesLeft] = useState([]);
    const [modulesLeftFilter, setModulesLeftFilter] = useState([]);
    const [modulesRight, setModulesRight] = useState([]);
    const [modulesRightFilter, setModulesRightFilter] = useState([]);

    useEffect(() => {
        getRoleModules(props.id);
    }, [props.id]);

    const getRoleModules = (id) => {
        setLoading(true);
        RoleServices.getRoleModules(id)
            .then(response => {
                setLoading(false);
                // console.log(response.data);
                setUserRoleModules(response.data);
                setModulesLeft(response.data.ModulesLeft);
                setModulesLeftFilter(response.data.ModulesLeft);
                setModulesRight(response.data.ModulesRight);
                setModulesRightFilter(response.data.ModulesRight);
            }).catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    const onSearchLeft = (event) => {
        const filteredModels = modulesLeftFilter.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setModulesLeft(filteredModels);
    };

    const onSearchRight = (event) => {
        const filteredModels = modulesRightFilter.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setModulesRight(filteredModels);
    };

    const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
    const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
    const [selectedModulesLeft, setSelectedModulesLeft] = useState([]);
    const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

    const [selectedButtonRight, setSelectedButtonRight] = useState(true);
    const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
    const [selectedModulesRight, setSelectedModulesRight] = useState([]);
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
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedModulesLeft(selectedRows);
            setRowKeysLeft(selectedRowKeys);
            if (selectedRows.length > 0) {
                setSelectedButtonLeft(false);
            } else {
                setSelectedButtonLeft(true);
            }
        },
        getCheckboxProps: (record) => ({
            name: record.Name,
        }),
    };

    const rowSelectionRight = {
        selectedRowKeys: selectedRowKeysRight,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedModulesRight(selectedRows);
            setRowKeysRight(selectedRowKeys);
            if (selectedRows.length > 0) {
                setSelectedButtonRight(false);
            } else {
                setSelectedButtonRight(true);
            }
        },
        getCheckboxProps: (record) => ({
            name: record.Name,
        }),
    };

    const handleSubmitSelectedRowsLeft = () => {
        setSelectedButtonLeftLoading(true);
        const checkedSelectedModulesLeft = selectedModulesLeft.map(item => {
            item.Check = true
            return item;
        });

        RoleServices.updateModulesLeft({ ID: props.id, ModulesLeft: checkedSelectedModulesLeft })
            .then(response => {
                getRoleModules(props.id);
                setSelectedButtonLeft(true);
                setSelectedButtonLeftLoading(false);
            }).catch(error => {
                Notification('error', error)
            });
    }

    const handleSubmitSelectedRowsRight = () => {
        setSelectedButtonRightLoading(true);
        const checkedSelectedModulesRight = selectedModulesRight.map(item => {
            item.Check = true
            return item;
        });

        RoleServices.updateModulesRight({ ID: props.id, ModulesRight: checkedSelectedModulesRight })
            .then(response => {
                getRoleModules(props.id);
                setSelectedButtonRight(true);
                setSelectedButtonRightLoading(false);
            }).catch(error => {
                Notification('error', error)
            });
    }

    return (
        <Modal
            width={1190}
            title={t("modules")}
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
                        dataSource={modulesLeft}
                        loading={loading}
                        scroll={{ y: "40vh" }}
                        rowKey={record => record.ID}
                        pagination={false}
                        showSorterTooltip={false}
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
                        type="primary" icon={<ArrowRightOutlined />}
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
                        dataSource={modulesRight}
                        loading={loading}
                        scroll={{ y: "40vh" }}
                        rowKey={record => record.ID}
                        pagination={false}
                        showSorterTooltip={false}
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

export default RoleModulesModal;