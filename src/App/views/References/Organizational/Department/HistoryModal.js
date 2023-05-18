import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { useTranslation } from "react-i18next";

import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";

const HistoryModal = (props) => {
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const tableDt = await HelperServices.GetTableDataHistory(props.id, 134, props.columnName);
      setTableData(tableDt.data.rows);
      setTableLoading(false);
    }
    fetchData().catch(err => {
      setTableLoading(false);
      Notification('error', err);
    });
  }, [props.id, props.columnName]);

  const columns = [
    {
      title: t('Value'),
      dataIndex: "Value",
    },
    {
      title: t('username'),
      dataIndex: "Username",
    },
    {
      title: t('DateOfCreated'),
      dataIndex: "DateOfCreated",
    },
  ];

  return (
    <Modal
      title={t("history")}
      visible={props.visible}
      cancelText={t("cancel")}
      onCancel={props.onCancel}
      width={900}
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Table
        bordered
        size='middle'
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record) => record.ID}
        pagination={false}
        rowClassName="table-row"
        scroll={{
          x: "50vh",
          y: "50vh",
        }}
      />
    </Modal >
  )
}

export default HistoryModal;