import React, { useState } from 'react'
import { Space, Table, Tag, Tooltip, Dropdown, Menu } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setListPagination } from '../_redux/usersSlice';
import UserRoleModal from './Modals/UserRoleModal';
import UNSModal from './Modals/UNSModal';
import UserRegionModal from './Modals/UserRegionModal';
import UserSettlementModal from './Modals/UserSettlementModal';
import UserOrgModal from './Modals/UserOrgModal';
import UserAttachOrgModal from './Modals/UserAttachOrgModal';
// import { Notification } from '../../../../../../helpers/notifications';
// import UserServices from '../../../../../../services/Admin/User/User.services';
import { CSSTransition } from 'react-transition-group';

const TableUsers = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const loading = useSelector((state) => state.userList?.listBegin);
    const userListPagination = useSelector((state) => state.userList?.paginationData);

    const [confirmLoading] = React.useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [docID, setDocID] = useState(null);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 130,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("fullname"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            width: 150,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("VerifyEDS"),
            dataIndex: "VerifyEDS",
            key: "VerifyEDS",
            sorter: true,
            width: 120
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            sorter: true,
            width: 120
        },
        {
            title: t("status"),
            dataIndex: "State",
            key: "State",
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
            title: t("Organization"),
            dataIndex: "Organization",
            key: "Organization",
            sorter: true,
            width: 120,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrganizationID"),
            dataIndex: "OrganizationID",
            key: "OrganizationID",
            sorter: true,
            width: 110,
        },
        {
            title: t("LastAccessTime"),
            dataIndex: "LastAccessTime",
            key: "LastAccessTime",
            sorter: true,
            width: 150,
        },
        {
            title: t("LastIP"),
            dataIndex: "LastIP",
            key: "LastIP",
            sorter: true,
            width: 110,
        },
        {
            title: t("Email"),
            dataIndex: "Email",
            key: "Email",
            sorter: true,
            width: 110,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 120,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <span onClick={() => {
                                history.push(`${match.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>


                        <Dropdown
                            overlay={<Menu>
                                <Menu.Item key="roleChange" onClick={() => showRoleModal(record.ID)}>
                                    <div>
                                        <i className="feather icon-sliders action-icon" />&nbsp;
                                        {t("role")}
                                    </div>

                                </Menu.Item>

                                <Menu.Item key="UNS">

                                    <UNSModal id={record.ID} />

                                </Menu.Item>

                                <Menu.Item key="Region">

                                    <UserRegionModal id={record.ID} />

                                </Menu.Item>

                                <Menu.Item key="Settlement">

                                    <UserSettlementModal id={record.ID} />

                                </Menu.Item>

                                <Menu.Item key="Org">

                                    <UserOrgModal id={record.ID} />

                                </Menu.Item>

                                <Menu.Item key="AttachOrg">

                                    <UserAttachOrgModal id={record.ID} />

                                </Menu.Item>

                            </Menu>}
                            placement="bottomCenter"
                        >
                            <i className='feather icon-list action-icon' aria-hidden="true" />
                        </Dropdown>

                    </Space>
                );
            },
        },

    ];



    function handleTableChange(pagination, filters, sorter, extra) {
        const { field, order } = sorter;
        // console.log(pagination);

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );
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
                    current: userListPagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            history.push(`${match.path}/edit/${record.ID}`);
                        },
                    };
                }}
            />

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserRoleModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UNSModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserRegionModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserAttachOrgModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserSettlementModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserOrgModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>
        </>
    )
}

export default TableUsers;