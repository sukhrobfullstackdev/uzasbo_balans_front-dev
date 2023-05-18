import React, { useState } from 'react'
import { Table, Space, Tooltip } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";

import { setListPagination } from '../_redux/getListSlice';


const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const tableList = useSelector((state) => state.currencyCourseList);
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading] = useState(false);

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 80,
      align:'center'
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      sorter: true,
      align:'center'
      // render: record => <div className="ellipsis-2">{record}</div>
      // width: 80
    },
    {
      title: t("CurrencyName"),
      dataIndex: "CurrencyName",
      sorter: true,
      // width: 80,
    },

    {
      title: t("Course"),
      dataIndex: "Course",
      sorter: true,
      align: 'right',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
      // width: 120
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

  const handleTableChange = (pagination, __, sorter) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
        OrderType: order?.slice(0, -3),
        SortColumn: field,
        PageNumber: pagination.current,
        PageLimit: pagination.pageSize,
      })
    );
  }

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
      scroll={{
        // x: "max-content",
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

export default React.memo(GetListTable);