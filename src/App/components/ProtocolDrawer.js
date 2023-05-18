import React, { useEffect, useState } from "react";
import { Table, Drawer } from "antd";
import { useTranslation } from "react-i18next";

import HelperServices from "../../services/Helper/helper.services";
import { Notification } from "../../helpers/notifications";

const ProtocolDrawer = ({ visible, id, tableId, ...props }) => {
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        const tableDt = await HelperServices.GetFileLog(id, tableId);
        setTableData(tableDt.data);
      }
      fetchData()
        .catch(err => Notification('error', err))
        .finally(() => setTableLoading(false));
    }
  }, [visible, id, tableId]);

  const columns = [
    {
      title: t('status'),
      dataIndex: "Status",
      width: 110,
    },
    {
      title: t('Description'),
      dataIndex: "Description",
      width: 250,
    },
    {
      title: t('id'),
      dataIndex: "ID",
      width: 110,
    },
    {
      title: t('DateOfCreated'),
      dataIndex: "DateOfCreated",
      width: 120,
    },
  ];

  return (
    <Drawer
      title={t("protocol")}
      visible={visible}
      placement="right"
      className='protocol-drawer'
      onClose={props.onCancel}
    >
      <Table
        bordered
        size='middle'
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={(record) => record.CreatedTime}
        rowClassName="table-row"
        pagination={false}
        scroll={{
          x: "50vh",
          y: "50vh",
        }}
      />
    </Drawer >
  )
}

export default React.memo(ProtocolDrawer);