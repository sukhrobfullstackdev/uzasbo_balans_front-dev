import React, { useState } from 'react'
import { DatePicker, Dropdown, Menu, Modal, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import moment from "moment";
import { Link } from 'react-router-dom';

import { setListPagination} from '../_redux/getListSlice';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Notification } from '../../../../../../helpers/notifications';
import InpaymentServices from '../../../../../../services/Documents/PaymentDocuments/Inpayment/Inpayment.services';

const { confirm } = Modal;

const TableData = ({ tableData, total, match, reduxList, OrganizationsSettlementAccountID }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [dateOfAcception, setDateOfAcception] = useState(moment().format("DD.MM.YYYY"))
    const [tableLoading, setTableLoading] = useState(false);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("TreasDocID"),
            dataIndex: "TreasDocID",
            key: "TreasDocID",
            sorter: true,
            width: 160,
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 100,
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
            width: 120,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("PayerName"),
            dataIndex: "PayerName",
            key: "PayerName",
            sorter: true,
            width: 180,
        },
        {
            title: t("orgSettlementAccount"),
            dataIndex: "SettlementAccount",
            key: "SettlementAccount",
            sorter: true,
            width: 220,
        },
        {
            title: t("Db"),
            dataIndex: "SubAccDb",
            key: "SubAccDb",
            sorter: true,
            width: 60,
        },
        {
            title: t("Cr"),
            dataIndex: "SubAccCr",
            key: "SubAccCr",
            sorter: true,
            width: 60,
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
        },
        {
            title: t("PaymentDetails"),
            dataIndex: "PaymentDetails",
            key: "PaymentDetails",
            sorter: true,
            width: 300,
        },
        {
            title: t("paymentOrderID"),
            dataIndex: "PaymentOrderID",
            key: "PaymentOrderID",
            sorter: true,
            width: 120
        },
        {
            title: t("PayrollSheetID"),
            dataIndex: "PayrollSheetID",
            key: "PayrollSheetID",
            sorter: true,
            width: 120,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 90,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Dropdown
                            placement="bottom"
                            overlay={<Menu
                                onClick={(e) => printByType(e, record.ID)}
                                items={[
                                    {
                                        key: '1',
                                        label: t('paymentTableRu'),
                                    },
                                    {
                                        key: '2',
                                        label: t('paymentTableUz'),
                                    },
                                ]}
                            />}
                        >
                            <i className='feather icon-printer action-icon' aria-hidden="true" />
                        </Dropdown>

                        <Dropdown
                            placement="bottom"
                            overlay={<Menu items={[
                                {
                                    key: 'edit',
                                    label: (
                                        <Link to={`${location.pathname}/edit/${record.ID}?OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`}>
                                            <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                                            {t('Edit')}
                                        </Link>
                                    ),
                                },
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
                                    key: 'notAccept',
                                    label: (
                                        <span onClick={() => cancelHandler(record.ID)}>
                                            <i className="feather icon-x-circle action-icon" />&nbsp;
                                            {t("NotAccept")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'clone',
                                    label: (
                                        <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                                            <i className="far fa-clone action-icon" />&nbsp;
                                            {t("clone")}
                                        </Link>
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

    const tableSummaryHandler = records => {
        let totalSum = 0;

        records.forEach(item => {
            totalSum += +item.Sum;
        });

        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalSum)}</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }

    const printByType = (e, id) => {
        loading = true;
        InpaymentServices.printType(id, e.key)
            .then((res) => {
                if (res.status === 200) {
                    loading = false;
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "print.xlsx");
                    document.body.appendChild(link);
                    link.click();
                }
            })
            .catch((err) => {
                Notification('error', err);
                loading = false;
            });
    };

    const acceptHandler = (id) => {
        confirm({
            title: t('Accept'),
            icon: <CheckCircleOutlined />,
            content:
                <Space size="middle" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <DatePicker
                        defaultValue={moment()}
                        style={{ width: "100%" }} format="DD.MM.YYYY"
                        onChange={(e) => setDateOfAcception(e)}
                    />
                </Space>,
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                InpaymentServices.Accept(id, dateOfAcception)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const cancelHandler = (id) => {
        confirm({
            title: t('Cancel'),
            icon: <InfoCircleOutlined />,
            content: t('cancelText'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                InpaymentServices.cancel(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const deleteModalHandler = (id) => {
        confirm({
            title: t('Delete'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                InpaymentServices.delete(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

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
                summary={records => tableSummaryHandler(records)}
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
                            history.push(`${match.path}/edit/${record.ID}?OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`);
                        },
                    };
                }}
            />
        </>
    )
}

export default TableData;