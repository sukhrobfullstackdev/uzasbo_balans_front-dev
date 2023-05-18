import React, { useState } from 'react'
import { DatePicker, Dropdown, Menu, Modal, Select, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction, setMainLoader } from '../_redux/getListSlice';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Notification } from '../../../../../../helpers/notifications';
import ProtocolModal from '../../../../../components/ProtocolModal';
import FoodstuffIntakeServices from "./../../../../../../services/Documents/AccountingForFood/FoodstuffIntake/FoodstuffIntake.services";


const TableData = ({ tableData, total, match, reduxList, OrganizationAccountID }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

    const [tableLoading, setTableLoading] = useState(false);


    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            sorter: true,
            width: 80,
            // render: (_, record) => {
            //   if (record.StatusID === 2 || record.StatusID === 8) {
            //     return record.ID;
            //   }
            //   return <span style={{ color: 'red' }}>{record.ID}</span>
            // }
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            sorter: true,
            width: 80
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            sorter: true,
            width: 120
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            sorter: true,
            width: 100,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("Contractor"),
            dataIndex: "Contractor",
            sorter: true,
            width: 140,
        },
        {
            title: t("Department"),
            dataIndex: "Department",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ResponsiblePerson"),
            dataIndex: "ResponsiblePerson",
            sorter: true,
            width: 80,
        },
        {
            title: t("Warrant"),
            dataIndex: "Warrant",
            sorter: true,
            width: 140,
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            sorter: true,
            render: (_, record) => {
                if (record.Status === 'Проведено') {
                    return (
                        <Tag color='#87d068'>
                            {record.Status}
                        </Tag>
                    );
                }
                return (
                    <Tag color='#f50'>
                        {record.Status}
                    </Tag>
                );
            }
        },
        {
            title: t("IntakeDetails"),
            dataIndex: "IntakeDetails",
            sorter: true,
            width: 160,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <span onClick={() => {
                                history.push(`${location.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>
                        <Dropdown
                            overlay={<Menu>

                                <Menu.Item key="Accept">
                                    <span onClick={() => acceptHandler(record.ID, record.Date)}>
                                        <i className="far fa-check-circle action-icon" />&nbsp;
                                        {t("Accept")}
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="NotAccept">
                                    <span onClick={() => declineHandler(record.ID)}>
                                        <i className="far fa-times-circle action-icon" />&nbsp;
                                        {t("NotAccept")}
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="clone">
                                    <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                                        <i className="far fa-clone action-icon" />&nbsp;
                                        {t("clone")}
                                    </Link>
                                </Menu.Item>

                                <Menu.Item key="delete">
                                    <span onClick={() => deleteModalHandler(record.ID)}>
                                        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                                        {t("Delete")}
                                    </span>
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

    };

    const deleteRowHandler = id => {
        setTableLoading(true);
        FoodstuffIntakeServices.delete(id)
            .then(res => {
                if (res.status === 200) {
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination   ,
                    }));
                    setTableLoading(false);
                }
            })
            .catch(err => {
                setTableLoading(false);
                Notification('error', err);
            })
    }

    const acceptHandler = (id) => {
        setTableLoading(true);
        FoodstuffIntakeServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('accepted'));
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination,
                    }));
                    setTableLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setTableLoading(false);
            });
    };

    const declineHandler = (id) => {
        setTableLoading(true);
        FoodstuffIntakeServices.cancel(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('warning', t('canceled'));
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination,
                    }));
                    setTableLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setTableLoading(false);
            });
    };



    const deleteModalHandler = (id) => {
        Modal.confirm({
            title: t('delete') + id,
            icon: <ExclamationCircleOutlined />,
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => deleteRowHandler(id),
        });
    }

    return (
        <>
            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={tableData}
                loading={loading || tableLoading}
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
                    ...pagination,
                    total: total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            history.push(`${match.path}/edit/${record.ID}?OrganizationAccountID=${OrganizationAccountID}`);
                        },
                    };
                }}
            />
        </>
    )
}

export default TableData;