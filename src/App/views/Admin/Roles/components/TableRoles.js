import { Space, Table, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Notification } from '../../../../../helpers/notifications';
import RoleServices from '../../../../../services/Admin/Roles/Role.services';
import { setListPagination } from '../_redux/rolesSlice';
import EditRoleModal from "./EditRoleModal";
import RoleModulesModal from './RoleModulesModal';

const TableRoles = ({ tableData, total }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.rolesList?.listBegin);
    const rolesListPagination = useSelector((state) => state.rolesList?.paginationData);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [docID, setDocID] = useState(null);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
            render: (status) => {
                if (status === "Актив") {
                    return (
                        <Tag color="#87d068" key={status}>
                            {status}
                        </Tag>
                    );
                } else if (status === "Пассив") {
                    return (
                        <Tag color="#f50" key={status}>
                            {status}
                        </Tag>
                    );
                }
            },
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("modules")}>
                            <span onClick={() => showRoleModal(record.ID)}>
                                <i className="feather icon-command action-icon" />
                            </span>
                        </Tooltip>
                        <EditRoleModal id={record.ID} />
                        <Tooltip title={t("Delete")}>
                            <span onClick={() => removeModule(record.ID)}>
                                <i className="feather icon-trash action-icon" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },

    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        // console.log(field, order?.slice(0, -3));

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    }

    const removeModule = (id) => {
        console.log(id);
        setConfirmLoading(true);
        RoleServices.removeRole(id)
            .then(response => {
                Notification('success', t("edited"));
                setConfirmLoading(false);
                dispatch(
                    setListPagination({
                        PageNumber: 1,
                        PageLimit: 10,
                    })
                );
            }).catch(error => {
                setConfirmLoading(false);
                // console.log(error);
                Notification('error', error);
            });
    };

    const showRoleModal = (id) => {
        setIsModalVisible(true);
        setDocID(id);
    };

    const closeRoleModal = (id) => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Table
                bordered
                size='middle'
                columns={columns}
                dataSource={tableData}
                loading={loading || confirmLoading}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                rowClassName="table-row"
                className="main-table"
                showSorterTooltip={false}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={{
                    pageSize: tableData?.length,
                    total: total,
                    current: rolesListPagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <RoleModulesModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>
        </>
    )
}

export default TableRoles;