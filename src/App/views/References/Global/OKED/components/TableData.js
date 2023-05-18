import { Table, Space, Tooltip, Popconfirm } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

import OKEDServices from "../../../../../../services/References/Global/IncomeUNC copy/OKED.services";

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const tableList = useSelector((state) => state.OKEDList);
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
            // width: 100,
            align:'center'
        },

        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            // width: 300,
            render: record => <div className="ellipsis-2">{record}</div>
        },

        {
            title: t("code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
            width: 70,
            align:'center'
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
                        <Tooltip title={t("Delete")}>
                            <Popconfirm
                                title={t("delete")}
                                onConfirm={() => deleteHandler(record.ID)}
                            >
                                <span >
                                    <i className="feather icon-trash-2 action-icon" />
                                </span>
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];


    function handleTableChange(pagination, __, sorter) {
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

    const deleteHandler = (id) => {
        OKEDServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => Notification('error', err));
    };




    return (
        <Table
            bordered
            size="middle"
            rowClassName={(record, index) => (record.IsGroup === true ? "table-bold" : "")}
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