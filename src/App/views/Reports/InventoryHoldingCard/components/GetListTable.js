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
  const tableList = useSelector((state) => state.inventoryHoldingCardList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

  const storeLoading = tableList.listBegin;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const columns = useMemo(() => [
    {
      title: t("date"),
      dataIndex: "Date",
      sorter: true,
      width: 100
    },
    {
      title: t("number"),
      dataIndex: "Number",
      sorter: true,
      width: 80,
    },
    {
      title: t("responsiblePersonName"),
      dataIndex: "ResponsiblePersonName",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("memorialOrderNumber"),
      dataIndex: "MemorialOrderNumber",
      sorter: true,
      width: 180,
    },
    {
      title: t("detail"),
      dataIndex: "Detail",
      sorter: true,
      width: 150,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("price"),
      dataIndex: "Price",
      sorter: true,
      width: 100,
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
      title: t("creditQuantity"),
      dataIndex: "CreditQuantity",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("creditAmount"),
      dataIndex: "CreditAmount",
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
    {
      title: t("responsiblePersonName"),
      dataIndex: "ResponsiblePersonName",
      sorter: true,
      width: 250,
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

  const tableSummaryHandler = useCallback(records => {
    let totalPrice = 0;
    let totalDebitQuantity = 0;
    let totalDebitAmount = 0;
    let totalCreditQuantity = 0;
    let totalCreditAmount = 0;
    let totalEndDebitQuantity = 0;
    let totalEndDebitAmount = 0;

    records.forEach(item => {
      totalPrice += +item.Price;
      totalDebitQuantity += +item.DebitQuantity;
      totalDebitAmount += +item.DebitAmount;
      totalCreditQuantity += +item.CreditQuantity;
      totalCreditAmount += +item.CreditAmount;
      totalEndDebitQuantity += +item.EndDebitQuantity;
      totalEndDebitAmount += +item.EndDebitAmount;
    });

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell></Table.Summary.Cell>
          <Table.Summary.Cell></Table.Summary.Cell>
          <Table.Summary.Cell></Table.Summary.Cell>
          <Table.Summary.Cell></Table.Summary.Cell>
          <Table.Summary.Cell></Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalPrice)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalDebitQuantity)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalDebitAmount)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalCreditQuantity)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={9}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalCreditAmount)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={10}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalEndDebitQuantity)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={11}>
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalEndDebitAmount)}
          </Table.Summary.Cell>
          <Table.Summary.Cell></Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  }, [])

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
      summary={records => tableSummaryHandler(records)}
      rowKey={() => Math.random().toString()}
      showSorterTooltip={false}
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