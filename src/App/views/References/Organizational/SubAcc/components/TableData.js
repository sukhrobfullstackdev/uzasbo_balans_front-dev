import React from 'react';
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
  const tableList = useSelector((state) => state.subAccList);
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      width: 100,
      sorter: true,
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      key: "Code",
      sorter: true,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      sorter: true,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("IsCurrency"),
      dataIndex: "IsCurrency",
      key: "IsCurrency",
      sorter: true,
      width: 80
    },
    {
      title: t("AccCode"),
      dataIndex: "AccCode",
      key: "AccCode",
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
              </Link>
            </Tooltip>
            <Tooltip title={t("clone")}>
              <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                <i className="far fa-clone action-icon" />&nbsp;
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