import { Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const formaDKPositionList = useSelector((state) => state.formaDKPositionList);
    let loading = formaDKPositionList?.listBegin;
    let pagination = formaDKPositionList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
        },
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            width: 150,
            sorter: true,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 50,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit Contractor")}>
                            <span onClick={() => {
                                history.push(`${match.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
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

    };

    return (
        <Table
            bordered
            size="middle"
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
                pageSize: Math.ceil(tableData?.length / 10) * 10,
                total: total,
                current: pagination.PageNumber,
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

export default TableData