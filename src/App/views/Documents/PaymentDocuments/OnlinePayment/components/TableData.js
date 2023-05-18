import React from 'react'
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, reduxList, }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    let loading = reduxList?.listBegin;
    let mainLoader = reduxList?.mainLoader;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("PaymentSystem"),
            dataIndex: "PaymentSystemName",
            key: "PaymentSystemName",
            sorter: true,
            width: 150,
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 100,
        },
        {
            title: t("PayedDate"),
            dataIndex: "PayedDate",
            key: "PayedDate",
            sorter: true,
            width: 180,
        },
        {
            title: t("CanceledDate"),
            dataIndex: "CanceledDate",
            key: "CanceledDate",
            width: 180,
            sorter: true,
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 150,
            render: (_, record) => (record.Status ?
                <>
                    {record.Status !== "Оплачен" ?
                        <Tag color='#f50'>
                            {record.TreasStatus}
                        </Tag> :
                        <Tag color='#87d068'>
                            {record.TreasStatus}
                        </Tag>}
                </> :
                <Tag color={'#999'}>
                </Tag>
            )
        },
        {
            title: t("ForMonth"),
            dataIndex: "ForMonth",
            key: "ForMonth",
            sorter: true,
            width: 100,
        },
        {
            title: t("DepartmentName"),
            dataIndex: "DepartmentName",
            key: "PayeeSettlement",
            sorter: true,
            width: 150
        },
        {
            title: t("FullName"),
            dataIndex: "ChildrenName",
            key: "ChildrenName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ForPayment"),
            dataIndex: "ForPayment",
            key: "ForPayment",
            sorter: true,
            width: 100,
        },
        {
            title: t("Payed"),
            dataIndex: "Payed",
            key: "Payed",
            sorter: true,
            width: 100
        },
        {
            title: t("SettlementAccount"),
            dataIndex: "SettlementAccount",
            key: "SettlementAccount",
            sorter: true,
            width: 200,
        },
        {
            title: t("DocumentSeries"),
            dataIndex: "DocumentSeries",
            key: "DocumentSeries",
            sorter: true,
            width: 150,
        },
        {
            title: t("DocumentNumber"),
            dataIndex: "DocumentNumber",
            key: "DocumentNumber",
            sorter: true,
            width: 150,
        },
        {
            title: t("PaymentID"),
            dataIndex: "PaymentID",
            key: "PaymentID",
            sorter: true,
            width: 200,
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

    return (
        <>
            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={tableData}
                loading={loading || mainLoader}
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
                            // history.push(`${match.path}/edit/${record.ID}?OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`);
                        },
                    };
                }}
            />
        </>
    )
}

export default TableData;