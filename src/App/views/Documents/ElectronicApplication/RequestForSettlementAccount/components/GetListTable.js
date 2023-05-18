import React, { useCallback, useState } from 'react'
import { Table, Tag, Space, Modal, Dropdown, Menu } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { setListPagination, getListStartAction } from '../_redux/getListSlice';
import CommonApis from '../../../../../../services/common/commonApis';
import { Notification } from '../../../../../../helpers/notifications';

const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const docName = location.pathname.split('/')[1]

  const tableList = useSelector((state) => state.requestForSettlementAccountList);
  const filterData = tableList?.filterData;
  const paginationData = tableList?.paginationData;
  const storeLoading = tableList.listBegin;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);

  const deleteRowHandler = id => {
    setLoading(true);
    CommonApis.delete(docName, { id })
      .then(() => dispatch(getListStartAction({
        ...filterData,
        ...paginationData,
      })))
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))
  }

  const deleteModalHandler = (id) => {
    Modal.confirm({
      title: t('delete') + id,
      icon: <ExclamationCircleOutlined />,
      okText: t('yes'),
      cancelText: t('cancel'),
      onOk: () => deleteRowHandler(id),
    });
  }

  const confirmHandler = useCallback((id) => {
    setLoading(true);
    CommonApis.get(docName, 'Confirm', { ID: id })
      .then(() => dispatch(getListStartAction({
        ...filterData,
        ...paginationData,
      })))
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))
  }, [docName, dispatch, filterData, paginationData])

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 80,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 8) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      sorter: true,
    },
    {
      title: t("Name"),
      dataIndex: "Name",
      sorter: true,
      // width: 200,
      render: (record) => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("orgSettAcc"),
      dataIndex: "Code",
      sorter: true,
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 9) {
          return (
            <Tag color='#87d068'>
              {record.Status}
            </Tag>
          );
        }
        return (
          <Tag color='#f50'>
            {record.Status}
          </Tag>
        );
      }
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
            <Dropdown
              placement="bottom"
              overlay={<Menu items={[
                {
                  key: 'edit',
                  label: (
                    <Link to={`${location.pathname}/edit/${record.ID}`}>
                      <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                      {t('Edit')}
                    </Link>
                  ),
                },
                {
                  key: 'confirm',
                  label: (
                    <span onClick={() => confirmHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon"></i>&nbsp;
                      {t("confirm")}
                    </span>
                  ),
                },
                {
                  key: 'delete',
                  label: (
                    <span onClick={() => deleteModalHandler(record.ID)}>
                      <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                      {t("Delete")}
                    </span>
                  ),
                },
              ]} />}
            >
              <i className='feather icon-list action-icon' aria-hidden="true" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination, _, sorter,) => {
    const { field, order } = sorter;
    dispatch(setListPagination({
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
        x: "max-content",
        y: '50vh'
      }}
      pagination={{
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: paginationData.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default GetListTable;