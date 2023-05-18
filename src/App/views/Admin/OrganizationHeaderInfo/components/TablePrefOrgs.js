import { Table} from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/orgHeaderInfoSlice';

const TablePrefOrgs = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const orgHeaderInfoList = useSelector((state) => state.orgHeaderInfoList);
    let loading = orgHeaderInfoList?.listBegin;
    let pagination = orgHeaderInfoList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("OrganizationName"),
            dataIndex: "OrganizationName",
            key: "OrganizationName",
            sorter: true,
            width: 130,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("HeaderINN"),
            dataIndex: "HeaderINN",
            key: "HeaderINN",
            // width: 150,
            sorter: true,
        },
        
        {
            title: t("HeaderOrganizationName"),
            dataIndex: "HeaderOrganizationName",
            key: "HeaderOrganizationName",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            sorter: true,
            // width: 120
        },
        {
            title: t("ChapterCode"),
            dataIndex: "ChapterCode",
            key: "ChapterCode",
            sorter: true,
            width: 100
        },
        {
            title: t("ChapterName"),
            dataIndex: "ChapterName",
            key: "ChapterName",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("StartDate"),
            dataIndex: "StartDate",
            key: "StartDate",
            sorter: true,
            // width: 100
        },
        {
            title: t("EndDate"),
            dataIndex: "EndDate",
            key: "EndDate",
            sorter: true,
            // width: 100
        },

        // {
        //     title: t("actions"),
        //     key: "action",
        //     align: "center",
        //     fixed: 'right',
        //     width: 110,
        //     render: (record) => {
        //         return (
        //             <Space size="middle">
        //                 <Tooltip title={t("Organization Edit")}>
        //                     <span onClick={() => {
        //                         history.push(`${match.path}/edit/${record.ID}`);
        //                     }}>
        //                         <i className="feather icon-edit action-icon" />
        //                     </span>
        //                 </Tooltip>
                        
        //             </Space>
        //         );
        //     },
        // },

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

    }

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            loading={loading}
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

export default TablePrefOrgs