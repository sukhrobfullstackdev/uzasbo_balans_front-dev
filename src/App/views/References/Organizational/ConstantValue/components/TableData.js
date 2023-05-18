import React, { useCallback } from 'react';
import { Space, Table, Tooltip, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';

import { setListPagination, getListStartAction, setTableLoading } from '../_redux/getListSlice';
import CommonApis from '../../../../../../services/common/commonApis';
import { Notification } from '../../../../../../helpers/notifications';

const TableData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.ConstantValueList);
  const storeLoading = tableList.listBegin;
  const tablePagination = tableList.paginationData;
  const tableFilterData = tableList.filterData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
    },
    {
      title: t("Name"),
      dataIndex: "DisplayName",
      key: "DisplayName",
      sorter: true,
      // width: 100,
    },
    {
      title: t("Value"),
      dataIndex: "Value",
      key: "Value",
      sorter: true,
      // width: 150,
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t("Edit")}>
              <Link to={`${location.pathname}/edit/${record.ID}`}>
                <i className='feather icon-edit action-icon' aria-hidden="true" />
              </Link>
            </Tooltip>
            <Tooltip title={t("Delete")}>
              <Popconfirm
                title={t('delete')}
                okText={t('yes')}
                cancelText={t('cancel')}
                onConfirm={() => deleteHandler(record.ID)}
              >
                <i className="feather icon-trash-2 action-icon" />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  function handleTableChange(pagination, _, sorter,) {
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

  const deleteHandler = useCallback((id) => {
    dispatch(setTableLoading(true));
    CommonApis.delete('ConstantValue', { id })
      .then(() => {
        dispatch(
          getListStartAction({
            ...tablePagination,
            ...tableFilterData,
          }))
      })
      .catch(err => {
        Notification('error', err)
        dispatch(setTableLoading(false))
      })
  }, [dispatch, tablePagination, tableFilterData])

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
        current: tablePagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default React.memo(TableData);