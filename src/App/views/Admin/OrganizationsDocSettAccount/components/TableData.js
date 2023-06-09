import React, { useState } from 'react'
import { Table, Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.OrganizationsDocSettAccountList);
    const storeLoading = tableList.listBegin;
    const userListPagination = tableList.paginationData;
    const tableData = tableList.listSuccessData?.rows;
    const total = tableList.listSuccessData?.total;

    const [loading] = useState(false);

    const columns = [
        // {
        //     title: t("id"),
        //     dataIndex: "ID",
        //     key: "ID",
        //     sorter: true,
        //     // width: 100,
        // },
        {
            title: t("OblastName"),
            dataIndex: "OblastName",
            key: "OblastName",
            // width: 100,
            sorter: true,
        },
        {
            title: t("RegionName"),
            dataIndex: "RegionName",
            key: "RegionName",
            // width: 150,
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            // width: 100,
            sorter: true,
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            // width: 100,
            sorter: true,
        },
        {
            title: t("ContactInfo"),
            dataIndex: "ContactInfo",
            key: "ContactInfo",
            // width: 100,
            sorter: true,
        },
        {
            title: t("Director"),
            dataIndex: "Director",
            key: "Director",
            // width: 150,
            sorter: true,
        },
        {
            title: t("Accounter"),
            dataIndex: "Accounter",
            key: "Accounter",
            // width: 150,
            sorter: true,
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
                                {/* &nbsp;
                                {t('Edit')} */}
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
            rowClassName="table-row"
            className="main-table"
            columns={columns}
            dataSource={tableData}
            loading={storeLoading || loading}
            onChange={handleTableChange}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            onRow={(record) => onTableRow(record)}
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