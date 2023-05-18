import React, { useCallback, useMemo } from 'react'
import { Table } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useHistory } from "react-router-dom";

import { setListPagination, getListStartAction } from '../_redux/getListSlice';
// import { Notification } from '../../../../../helpers/notifications';
// import TurnoverSheetApis from '../../../../../services/Report/InventoryAccounting/TurnoverSheet/TurnoverSheetApis'

const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const location = useLocation();
  // const history = useHistory();
  const tableList = useSelector((state) => state.turnoverSheetList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

  const storeLoading = tableList.listBegin;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const columns = useMemo(() => [
    {
      title: t("subAccCode"),
      dataIndex: "SubAccCode",
      sorter: true,
      width: 80
    },
    {
      title: t("DepartmentName"),
      dataIndex: "DepartmentName",
      sorter: true,
      width: 150,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("responsiblePersonName"),
      dataIndex: "ResponsiblePersonName",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("inventoryNumber"),
      dataIndex: "InventoryNumber",
      sorter: true,
      width: 80,
    },
    {
      title: t("inventoryHoldingName"),
      dataIndex: "InventoryHoldingName",
      sorter: true,
      width: 150,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("itemOfExpenseCode"),
      dataIndex: "ItemOfExpenseCode",
      sorter: true,
      width: 110,
    },
    {
      title: t("unitsOfMeasureName"),
      dataIndex: "UnitsOfMeasureName",
      sorter: true,
      width: 90,
    },
    {
      title: t("price"),
      dataIndex: "Price",
      sorter: true,
      width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("beginDebitQuantity"),
      dataIndex: "BeginDebitQuantity",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("beginDebitAmount"),
      dataIndex: "BeginDebitAmount",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("debitQuantity"),
      dataIndex: "DebitQuantity",
      sorter: true,
      width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("debitAmount"),
      dataIndex: "DebitAmount",
      sorter: true,
      width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("endCreditQuantity"),
      dataIndex: "EndCreditQuantity",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("endCreditAmount"),
      dataIndex: "EndCreditAmount",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("endDebitQuantity"),
      dataIndex: "EndDebitQuantity",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("endDebitAmount"),
      dataIndex: "EndDebitAmount",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
  ], [t]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
        OrderType: order?.slice(0, -3),
        SortColumn: field,
        PageNumber: pagination.current,
        PageLimit: pagination.pageSize,
      })
    );
    dispatch(getListStartAction({
      ...tableFilterData,
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    }))
  }, [dispatch, tableFilterData])

  // const onTableRow = (record) => {
  //   return {
  //     onDoubleClick: () => {
  //       history.push(`${location.pathname}/edit/${record.ID}`);
  //     },
  //   };
  // }

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
      rowKey={() => Math.random().toString()}
      showSorterTooltip={false}
      // onRow={(record) => onTableRow(record)}
      scroll={{
        x: "max-content",
        y: '50vh'
      }}
      pagination={{
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: tablePagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default GetListTable;