import { Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Notification } from '../../../../../helpers/notifications';
import ChangeDocStatusServices from '../../../../../services/Admin/ChangeDocStatus/ChangeDocStatus.services';
import { setListPagination } from '../_redux/changeDocStatusSlice';
import EditdDocument from './EditDocument';

const TableChangeDocStatus = ({ tableData, total }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.changeDocSatus?.listBegin);
    const docStatusListPagination = useSelector((state) => state.changeDocSatus?.paginationData);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("regionname"),
            dataIndex: "RegionName",
            key: "RegionName",
            sorter: true,
            width: 150
        },
        {
            title: t("OrgName"),
            dataIndex: "OrganizationName",
            key: "OrganizationName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("orgId"),
            dataIndex: "OrganizationID",
            key: "OrganizationID",
            sorter: true,
            width: 120
        },
        {
            title: t("OrgINN"),
            dataIndex: "OrganizationINN",
            key: "OrganizationINN",
            width: 150,
            sorter: true,
        },
        {
            title: t("Document"),
            dataIndex: "Document",
            key: "Document",
            sorter: true,
            width: 150,
            render: (TableId) => {
                if (TableId === 189) {
                    return (
                        <div color="#87d068" key={TableId}>
                            {TableId}
                        </div>
                    );
                } else if (TableId === 203) {
                    return (
                        <div color="#4ef29c" key={TableId}>
                            {TableId}
                        </div>
                    );
                }
                else if (TableId === 205) {
                    return (
                        <div color="#4ef29c" key={TableId}>
                            {TableId}
                        </div>
                    );
                }
            },
        },
        {
            title: t("DocumentID"),
            dataIndex: "DocumentID",
            key: "DocumentID",
            width: 150,
            sorter: true,
        },
        {
            title: t("reason"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 150
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
            render: (status) => {
                if (status === "Проведено") {
                    return (
                        <Tag color="#87d068" key={status}>
                            {status}
                        </Tag>
                    );
                } else if (status === "Создан") {
                    return (
                        <Tag color="#4ef29c" key={status}>
                            {status}
                        </Tag>
                    );
                }
            },
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        {/* <RoleModulesModal id={record.ID} /> */}
                        <EditdDocument id={record.ID} />
                        <Tooltip title={t("approve")}>
                            <span onClick={() => approveDocument(record.ID)}>
                                <i className="feather icon-check-square action-icon" />
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

    }

    const approveDocument = (id) => {
        console.log(id);
        setConfirmLoading(true);
        ChangeDocStatusServices.acceptDocument(id)
        .then(response => {
            Notification('success', t("edited"));
            setConfirmLoading(false);
            dispatch(
                setListPagination({
                    PageNumber: 1,
                    PageLimit: 10,
                })
            );
        }).catch(error => {
            setConfirmLoading(false);
            // console.log(error);
            Notification('error', error);
        });
    };

    return (
        <Table
            bordered
            size='middle'
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
                pageSize: docStatusListPagination.PageLimit,
                total: total,   
                current: docStatusListPagination.PageNumber,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
        />
    )
}

export default TableChangeDocStatus;