import { Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const premanetAssetsList = useSelector((state) => state.premanetAssetsList);
  let loading = premanetAssetsList?.listBegin;
  let pagination = premanetAssetsList?.paginationData;

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
      width: 250,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("InventoryNumber"),
      dataIndex: "InventoryNumber",
      key: "InventoryNumber",
      width: 150,
      sorter: true,
    },
    {
      title: t("UnitsOfMeasure"),
      dataIndex: "UnitsOfMeasure",
      key: "UnitsOfMeasure",
      width: 150,
      sorter: true,
    },
    {
      title: t("SubAcc"),
      dataIndex: "SubAcc",
      key: "SubAcc",
      sorter: true,
      width: 150,
    },
    {
      title: t("AgeingSubAcc"),
      dataIndex: "AgeingSubAcc",
      key: "AgeingSubAcc",
      sorter: true,
      width: 150,
    },
    {
      title: t("RetireAgeingSubAcc"),
      dataIndex: "RetireAgeingSubAcc",
      key: "RetireAgeingSubAcc",
      sorter: true,
      width: 150,
    },
    {
      title: t("ItemOfExpense"),
      dataIndex: "ItemOfExpense",
      key: "ItemOfExpense",
      sorter: true,
      width: 150,
    },
    {
      title: t("RetireReappSubAcc"),
      dataIndex: "RetireReappSubAcc",
      key: "RetireReappSubAcc",
      sorter: true,
      width: 150,
    },
    {
      title: t("PAGroup"),
      dataIndex: "PAGroup",
      key: "PAGroup",
      sorter: true,
      width: 250,
    },
    {
      title: t("PASubGroup"),
      dataIndex: "PASubGroup",
      key: "PASubGroup",
      sorter: true,
      width: 150,
    },
    {
      title: t("AgeingRate"),
      dataIndex: "AgeingRate",
      key: "AgeingRate",
      sorter: true,
      width: 150,
    },
    {
      title: t("DeliveryDate"),
      dataIndex: "DeliveryDate",
      key: "DeliveryDate",
      sorter: true,
      width: 150,
    },
    {
      title: t("ImplementationDate"),
      dataIndex: "ImplementationDate",
      key: "ImplementationDate",
      sorter: true,
      width: 150,
    },
    {
      title: t("RetirementDate"),
      dataIndex: "RetirementDate",
      key: "RetirementDate",
      sorter: true,
      width: 150,
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 250,
      render: record => <div className='ellipsis-2'>{record}</div>
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
              <span onClick={() => {
                history.push(`${match.path}/edit/${record.ID}`);
              }}>
                <i className="feather icon-edit action-icon" />
              </span>
            </Tooltip>
            <Tooltip title={t("clone")}>
              <span onClick={() => {
                history.push(`${match.path}/edit/${record.ID}?IsClone=true`);
              }}>
                <i className="far fa-clone action-icon" />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  // const [confirmLoading, setConfirmLoading] = React.useState(false);

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
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: pagination.PageNumber,
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

export default TableData;