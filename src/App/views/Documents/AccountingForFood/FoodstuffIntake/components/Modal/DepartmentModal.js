import { Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../../helpers/notifications';

const defaultPagination = {
  PageNumber: 1,
  PageLimit: 10
}

const DepartmentModal = (props) => {
  const { t } = useTranslation();
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [tableDt] = await Promise.all([
        HelperServices.getDepartmentsList(defaultPagination),
      ]);
      setTableData(tableDt.data.rows);
      setPagination(prevState => ({ ...prevState, total: tableDt.data.total }))
      setTableLoading(false);
    };

    fetchData().catch(err => {
      Notification('error', err);
      setTableLoading(false);
    });
  }, []);
  
  const columns = [
    {
      title: t("id"),
      dataIndex: 'ID',
      width: 80,
      sorter: true
    },
    {
      title: t("Name"),
      dataIndex: 'Name',
      width: 250,
      sorter: true
    },
  ];

  const tableChangeHandler = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    console.log({
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    });
  }

  const setRowClassName = (record) => {
    return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
  }

  return (
    <Modal
      width={800}
      title={t("Department")}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={() => {
        props.onCancel();
        props.onSelect(rowData);
      }}
    >
      <Table
        bordered
        size="middle"
        rowClassName={setRowClassName}
        className="main-table mt-4"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={record => record.ID}
        showSorterTooltip={false}
        onChange={tableChangeHandler}
        pagination={{
          pageSize: Math.ceil(tableData?.length / 10) * 10,
          total: pagination.total,
          current: pagination.pageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
        scroll={{
          x: "max-content",
          y: "50vh",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              props.onSelect({ id: record.ID, name: record.Name });
              props.onCancel();
            },
            onClick: () => {
              setRowData({ id: record.ID, name: record.Name });
            },
          };
        }}
      />
    </Modal >
  )
}

export default DepartmentModal;