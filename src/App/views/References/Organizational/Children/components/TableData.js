import React, { useState } from 'react';
import { Space, Table, Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, Link } from 'react-router-dom';

import ChildrenServices from '../../../../../../services/References/Organizational/Children/Children.services';
import { setListPagination, getListStartAction } from '../_redux/getListSlice';
import commonApis from '../../../../../../services/common/commonApis';

const TableData = ({ tableData, total, match }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const childrenList = useSelector((state) => state.childrenList);
  let storeLoading = childrenList?.listBegin;
  let tablePagination = childrenList?.paginationData;
  let tableFilterData = childrenList?.filterData;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      width: 80,
    },
    {
      title: t("Group"),
      dataIndex: "Department",
      key: "Department",
      width: 150,
      sorter: true,
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      key: "Code",
      width: 150,
      sorter: true,
    },
    {
      title: t("Таб.№"),
      dataIndex: "Number",
      key: "Number",
      width: 150,
      sorter: true,
    },
    {
      title: t("FullName"),
      dataIndex: "Name",
      key: "Name",
      sorter: true,
      width: 300,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("DateOfBirth"),
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      width: 150,
      sorter: true,
    },
    {
      title: t("Address"),
      dataIndex: "Address",
      key: "Address",
      sorter: true,
      width: 150,
    },
    {
      title: t("docType"),
      dataIndex: "DocumentType",
      key: "DocumentType",
      sorter: true,
      width: 150,
    },
    {
      title: t("Seria"),
      dataIndex: "DocumentSeries",
      key: "DocumentSeries",
      sorter: true,
      width: 150,
    },
    {
      title: t("docNum"),
      dataIndex: "DocumentNumber",
      key: "DocumentNumber",
      sorter: true,
      width: 150,
    },
    {
      title: t("contactNum"),
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      sorter: true,
      width: 150,
    },
    {
      title: t("workScheduleType"),
      dataIndex: "WorkSheduleKind",
      key: "WorkSheduleKind",
      sorter: true,
      width: 150,
    },
    {
      title: t("ChildHoursType"),
      dataIndex: "ChildHoursType",
      key: "ChildHoursType",
      sorter: true,
      width: 150,
    },
    {
      title: t("ChildrenGroupType"),
      dataIndex: "ChildrenGroupType",
      key: "ChildrenGroupType",
      sorter: true,
      width: 150,
    },
    {
      title: t("MoreThanOneChild"),
      dataIndex: "MoreThanOneChild",
      key: "MoreThanOneChild",
      sorter: true,
      width: 150,
    },
    {
      title: t("NoPayment"),
      dataIndex: "NoPayment",
      key: "NoPayment",
      sorter: true,
      width: 150,
    },
    {
      title: t("IsRent"),
      dataIndex: "IsRent",
      key: "IsRent",
      sorter: true,
      width: 150,
    },
    {
      title: t("dateOfAcceptance"),
      dataIndex: "DateOfReception",
      key: "DateOfReception",
      sorter: true,
      width: 150,
    },
    {
      title: t("dateOfLastDay"),
      dataIndex: "DateOfDismissal",
      key: "DateOfDismissal",
      sorter: true,
      width: 170,
    },
    {
      title: t("comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 150,
    },
    {
      title: t("foodPayment"),
      dataIndex: "IsEmployee",
      key: "IsEmployee",
      sorter: true,
      width: 150,
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
                  key: 'clone',
                  label: (
                    <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                      <i className="far fa-clone action-icon" />&nbsp;
                      {t("clone")}
                    </Link>
                  ),
                },
                {
                  key: 'print',
                  label: (
                    <span onClick={() => printHandler(record.ID)}>
                      <i className="feather icon-printer action-icon" />&nbsp;
                      {t("Print")}
                    </span>
                  ),
                },
                {
                  key: 'delete',
                  label: (
                    <span onClick={() => deleteHandler(record.ID)}>
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

  const printHandler = (id) => {
    setConfirmLoading(true);
    ChildrenServices.printById(id)
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "UZAsbo_Children.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => Notification('error', err))
      .finally(() => setConfirmLoading(false))
  };

  const deleteHandler = (id) => {
    setConfirmLoading(true);
    commonApis.delete('Children', { id })
      .then(() => {
        dispatch(getListStartAction({
          ...tablePagination,
          ...tableFilterData,
        }))
      })
      .catch(err => Notification('error', err))
      .finally(() => setConfirmLoading(false))
  };

  return (
    <Table
      bordered
      size="middle"
      columns={columns}
      dataSource={tableData}
      loading={storeLoading || confirmLoading}
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
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: tablePagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            history.push(`${location.pathname}/edit/${record.ID}`);
          },
        };
      }}
    />
  )
}

export default TableData;