import { Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.orgSettleAccList);
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      width: 100,
    },
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      sorter: true,
      width: 180,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("SettleCode"),
      dataIndex: "Code",
      key: "Code",
      sorter: true,
      // width: 100,
    },
    {
      title: t("OldCode"),
      dataIndex: "OldCode",
      key: "OldCode",
      width: 150,
      sorter: true,
    },
    {
      title: t("CashSubAcc"),
      dataIndex: "CashSubAcc",
      key: "CashSubAcc",
      sorter: true,
      width: 100,
    },
    {
      title: t("ActualSubAcc"),
      dataIndex: "ActualSubAcc",
      key: "ActualSubAcc",
      sorter: true,
      width: 100,
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 150,
    },
    {
      title: t("OpenDate"),
      dataIndex: "OpenDate",
      key: "OpenDate",
      sorter: true,
      width: 150,
    },
    {
      title: t("CloseDate"),
      dataIndex: "CloseDate",
      key: "CloseDate",
      sorter: true,
      width: 100,
    },
    {
      title: t("DateOfCentr"),
      dataIndex: "DateOfCentr",
      key: "DateOfCentr",
      sorter: true,
      width: 110,
    },
    {
      title: t("OutOfBalance"),
      dataIndex: "OutOfBalance",
      key: "OutOfBalance",
      sorter: true,
      width: 110,
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

  function handleTableChange(pagination, _, sorter) {
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
      loading={storeLoading}
      onChange={handleTableChange}
      rowKey={(record) => record.ID}
      showSorterTooltip={false}
      onRow={(record) => onTableRow(record)}
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