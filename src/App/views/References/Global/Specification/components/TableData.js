import React, { useState } from 'react';
import { Space, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';

import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.SpecificationList);
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
            title: t("code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
            align:'center'
            // width: 100,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            // width: 180,
            // render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Parent"),
            dataIndex: "Parent",
            key: "Parent",
            // width: 150,
            sorter: true,
            align:'center'
        },
        {
            title: t("Status"),
            dataIndex: "State",
            key: "State",
            sorter: true,
            // width: 150,
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
                            <Link to={`${location.pathname}/edit/${record.ID}`}>
                                <i className='feather icon-edit action-icon' aria-hidden="true" />
                            </Link>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    function handleTableChange(pagination, sorter) {
        const { field, order } = sorter;

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    };



    const onTableRow = (record) => {
        if (record.IsGroup) {
            <div className="table-bold">{record}</div>
        }
        return {
            onDoubleClick: () => {
                history.push(`${location.pathname}/edit/${record.ID}`);
            },
        };
    }

    return (
        <Table
            bordered
            size="middle"
            // rowClassName="table-row"
            rowClassName={(record, index) => (record.IsGroup === true ? "table-bold" : "")}
            className="main-table"
            columns={columns}
            dataSource={tableData}
            loading={storeLoading || loading}
            onChange={handleTableChange}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            onRow={(record) => onTableRow(record)
            }
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