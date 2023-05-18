import { Popconfirm, Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import OrganizationServices from '../../../../../services/Admin/Organization/Organization.services';
import { setListPagination } from '../_redux/organizationsSlice';

const TableOrganizations = ({ tableData, total, match }) => {

    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const organizationList = useSelector((state) => state.organizationList);
    let loading = organizationList?.listBegin;
    let organizationListPagination = organizationList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            width: 100,
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 300,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            width: 150,
            sorter: true,
        },
        {
            title: t("Chapter"),
            dataIndex: "Chapter",
            key: "Chapter",
            sorter: true,
            width: 120
        },
        {
            title: t("FinancingLevel"),
            dataIndex: "FinancingLevel",
            key: "FinancingLevel",
            sorter: true,
            width: 120
        },
        {
            title: t("TreasuryBranch"),
            dataIndex: "TreasuryBranch",
            key: "TreasuryBranch",
          
            sorter: true,
            width: 100,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Oblast"),
            dataIndex: "Oblast",
            key: "Oblast",
            sorter: true,
            width: 100,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Region"),
            dataIndex: "Region",
            key: "Region",
            sorter: true,
            width: 100
        },
       
        {
            title: t("Accounter"),
            dataIndex: "Accounter",
            key: "Accounter",
            sorter: true,
            width: 150,
        },
        {
            title: t("OKED"),
            dataIndex: "OKED",
            key: "OKED",
            sorter: true,
            width: 150,
        },
        {
            title: t("IsRecalcNeed"),
            dataIndex: "IsRecalcNeed",
            key: "IsRecalcNeed",
            sorter: true,
            width: 150,
        },
        {
            title: t("RecalcDate"),
            dataIndex: "RecalcDate",
            key: "RecalcDate",
            sorter: true,
            width: 150,
        },
        {
            title: t("HeaderOrganizationName"),
            dataIndex: "HeaderOrganizationName",
            key: "HeaderOrganizationName",
            sorter: true,
            width: 150,
        },
        {
            title: t("CentralOrganization"),
            dataIndex: "CentralOrganization",
            key: "CentralOrganization",
            sorter: true,
            width: 150,
        },
        {
            title: t("OrganizationType"),
            dataIndex: "OrganizationType",
            key: "OrganizationType",
            sorter: true,
            width: 150,
        },
        {
            title: t("State"),
            dataIndex: "State",
            key: "State",
            sorter: true,
            width: 150,
        },
        {
            title: t("IsFullBudget"),
            dataIndex: "IsFullBudget",
            key: "IsFullBudget",
            sorter: true,
            width: 150,
        },
        {
            title: t("Restriction"),
            dataIndex: "Restriction",
            key: "Restriction",
            sorter: true,
            width: 150,
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
                        <Tooltip title={t("Organization Edit")}>
                            <span onClick={() => {
                                history.push(`${match.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>
                        {/* <Tooltip title={t("Organization")}>
                            <span onClick={() => organizationHandler(record.ID)}>
                                <i className="feather icon-power action-icon" />
                            </span>
                        </Tooltip> */}
                        {/* <Popconfirm
                            title='Снять ожидающий запрос ?'
                            onConfirm={() => userJobCleanerHandler(record.ID)}
                            okText={t("yes")}
                            cancelText={t("cancel")}
                        >
                            <span>
                                <i className="feather icon-delete action-icon"></i>
                            </span>
                        </Popconfirm> */}
                    </Space>
                );
            },
        },
    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false); 

    // const userJobCleanerHandler = id => {
    //     setConfirmLoading(true);
    //     OrganizationServices.userJobCleaner(id)
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 Notification('success', this.props.t('edited'));
    //             }
    //         })
    //         .catch((err) => {
    //             setConfirmLoading(true);
    //             Notification('error', err);
    //         });
    // }
    const organizationHandler = id => {
        setConfirmLoading(true);
        OrganizationServices.organizationRestriction(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('send'));
                }
            })
            .catch((err) => {
                setConfirmLoading(true);
                Notification('error', err);
            });
    }

    function handleTableChange(pagination, filters, sorter,) {
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
                pageSize: tableData?.length,
                total: total,
                current: organizationListPagination.PageNumber,
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

export default TableOrganizations;