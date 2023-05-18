import { Space, Table, Tooltip } from 'antd';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.FormaSetCommonList);
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
            width: 80,
            align:'center'
        },
        {
            title: t("FunctionalItemOfExpenseChapterCode"),
            dataIndex: "FunctionalItemOfExpenseChapterCode",
            key: "FunctionalItemOfExpenseChapterCode",
            sorter: true,
            // width: 100,
        },
        {
            title: t("OrgUnitCode"),
            dataIndex: "OrganizationTypeCode",
            key: "OrganizationTypeCode",
            sorter: true,
            width: 140,
            align:'center'
            // render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrganizationTypeName"),
            dataIndex: "OrganizationTypeName",
            key: "OrganizationTypeName",
            // width: 150,
            sorter: true,
        },
        {
            title: t("State"),
            dataIndex: "State",
            key: "State",
            sorter: true,
            width: 100,
        },
        {
            title: t("DateOfCreated"),
            dataIndex: "DateOfCreated",
            key: "DateOfCreated",
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


    function handleTableChange(pagination, __, sorter) {
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