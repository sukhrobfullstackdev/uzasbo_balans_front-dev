import { Table, Space, Tooltip, Popconfirm } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';
import InfoAccServices from "../../../../../../services/References/Global/InfoAcc/InfoAcc.services";
import { Notification } from '../../../../../../helpers/notifications';

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.infoAccList);
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
            title: t("subcode"),
            dataIndex: "Code",
            key: "Code",
            width: 100,
            sorter: true,
            align:'center'
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            // width: 150,
            sorter: true,
        },
        {
            title: t("IsCurrency"),
            dataIndex: "IsCurrency",
            key: "IsCurrency",
            width: 100,
            sorter: true,
        },
        {
            title: t("IsQuantity"),
            dataIndex: "IsQuantity",
            key: "IsQuantity",
            width: 100,
            sorter: true,
        },
        {
            title: t("IsOffBalance"),
            dataIndex: "IsOffBalance",
            key: "IsOffBalance",
            width: 100,
            sorter: true,
        },
        {
            title: t("AccType"),
            dataIndex: "AccType",
            key: "AccType",
            // width: 150,
            sorter: true,
        },
        {
            title: t("SubCount1Name"),
            dataIndex: "SubCount1Name",
            key: "SubCount1Name",
            width: 150,
            sorter: true,
        },
        {
            title: t("SubCount2Name"),
            dataIndex: "SubCount2Name",
            key: "SubCount2Name",
            width: 150,
            sorter: true,
        },
        {
            title: t("SubCount3Name"),
            dataIndex: "SubCount3Name",
            key: "SubCount3Name",
            width: 150,
            sorter: true,
        },
        {
            title: t("AccSystemTypeName"),
            dataIndex: "AccSystemTypeName",
            key: "AccSystemTypeName",
            width: 180,
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

    const deleteHandler = (id) => {
        InfoAccServices.delete(id)
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