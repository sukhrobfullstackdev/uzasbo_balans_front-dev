import { Table } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.currencyList);
    console.log(tableList);
    const storeLoading = tableList.listBegin;
    const userListPagination = tableList.paginationData;
    const tableData = tableList.listSuccessData?.rows;
    const total = tableList.listSuccessData?.total;

    const [loading] = useState(false);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
            align:'center'
        },
        {
            title: t("inventoryNumber"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            align:'center'
            // width: 180,
            // render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("currency"),
            dataIndex: "Code",
            key: "Code",
            align:'center',
            // width: 150,
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            // width: 150,
            sorter: true,
        },
        // {
        //     title: t("status"),
        //     dataIndex: "State",
        //     key: "State",
        //     width: "12%",
        //     render: (status) => {
        //         if (status === "Актив") {
        //             return (
        //                 <Tag color="#87d068" key={status}>
        //                     {status}
        //                 </Tag>
        //             );
        //         } else if (status === "Пассив") {
        //             return (
        //                 <Tag color="#f50" key={status}>
        //                     {status}
        //                 </Tag>
        //             );
        //         }
        //     },
        // },


    ];

    // const [confirmLoading, setConfirmLoading] = React.useState(false);

    function handleTableChange(pagination, _, sorter) {
        const { field, order } = sorter;
        console.log(field);
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
        <Table
            bordered
            size="middle"
            rowClassName="table-row"
            className="main-table"
            columns={columns}
            dataSource={tableData}
            loading={storeLoading || loading}
            onChange={handleTableChange}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            // onRow={(record) => onTableRow(record)}
            // summary={records => tableSummaryHandler(records)}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            pagination={{
                pageSize: Math.ceil(tableData?.length / 10) * 10,
                total: total,
                current: userListPagination.PageNumber,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
        />
    )
}

export default React.memo(TableData);