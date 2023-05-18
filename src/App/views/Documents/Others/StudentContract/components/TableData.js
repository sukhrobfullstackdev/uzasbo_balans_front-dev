import React from 'react'
import { Dropdown, Menu, Modal, Space, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import StudentContractServices from '../../../../../../services/Documents/StudentContract/StudentContract.services';
import { Notification } from '../../../../../../helpers/notifications';

const TableData = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const studentContractList = useSelector((state) => state.studentContractList);
    let loading = studentContractList?.listBegin;
    let pagination = studentContractList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 100,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            width: 150,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("AcademicYearStart"),
            dataIndex: "AcademicYearStart",
            key: "AcademicYearStart",
            sorter: true,
            width: 150,
        },
        {
            title: t("AcademicYearEnd"),
            dataIndex: "AcademicYearEnd",
            key: "AcademicYearEnd",
            sorter: true,
            width: 150,
        },
        {
            title: t("ListOfPositionName"),
            dataIndex: "ListOfPositionName",
            key: "ListOfPositionName",
            sorter: true,
            width: 120
        },
        {
            title: t("FacultyName"),
            dataIndex: "FacultyName",
            key: "FacultyName",
            sorter: true,
            width: 150
        },
        {
            title: t("StudyGroupName"),
            dataIndex: "StudyGroupName",
            key: "StudyGroupName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("settlementAccountCode"),
            dataIndex: "SettlementAccountCode",
            key: "SettlementAccountCode",
            sorter: true,
            width: 150
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ErrorMessage"),
            dataIndex: "ErrorMessage",
            key: "ErrorMessage",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 110,
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
                            placement="bottom"
                            overlay={<Menu items={[
                                {
                                    key: 'accept',
                                    label: (
                                        <span onClick={() => acceptHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Accept")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'cancel',
                                    label: (
                                        <span onClick={() => cancelHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Cancel")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'delete',
                                    label: (
                                        <span onClick={() => deleteModalHandler(record.ID)}>
                                            <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                                            {t("Delete")}
                                        </span>
                                    ),
                                },
                            ]} />}
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


    const acceptHandler = (id) => {
        Modal.confirm({
            title: t('Accept'),
            icon: <CheckCircleOutlined />,
            content: t('acceptText'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                StudentContractServices.Accept(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                        }
                    }).catch((err) => {
                        Notification('error', err);
                    })
            }
        });
    };

    const cancelHandler = (id) => {
        Modal.confirm({
            title: t('Cancel'),
            icon: <InfoCircleOutlined />,
            content: t('cancelText'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                StudentContractServices.cancel(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                        }
                    }).catch((err) => {
                        Notification('error', err);
                    })
            }
        });
    };

    const deleteModalHandler = (id) => {
        Modal.confirm({
            title: t('Delete'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                StudentContractServices.delete(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                        }
                    }).catch((err) => {
                        Notification('error', err);
                    })
            }
        });
    };

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            loading={loading}
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
                        history.push(`${match.path}/edit/${record.ID}`);
                    },
                };
            }}
        />
    )
}

export default TableData;