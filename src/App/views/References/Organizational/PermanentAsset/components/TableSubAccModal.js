import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../services/Helper/helper.services';

const TableSubAccModal = (props) => {
  const { t } = useTranslation();

  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [tableData] = await Promise.all([
        HelperServices.getSubAcc(props.params.AccID),
      ]);
      setFilteredTableData(tableData.data);
      setTableData(tableData.data);
      setTableLoading(false);
    };

    fetchData().catch(err => {
      Notification('error', err);
      setTableLoading(false);
    });
  }, [props.params]);

  const selectRow = () => {
    props.onSelect(rowData);
    if (rowData !== null) {
      props.onCancel();
    }
  };

  const setRowClassName = (record) => {
    return record.ID === rowData?.ID ? 'table-row clicked-row' : 'table-row';
  }

  const columns = [
    {
      title: t("id"),
      dataIndex: 'ID',
      width: 100,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t("Code"),
      width: 100,
      dataIndex: 'Code',
      sorter: (a, b) => a.Code.localeCompare(b.Code),
    },
    {
      title: t("Name"),
      dataIndex: 'Name',
      width: 250,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: t("AccCod"),
      width: 100,
      dataIndex: 'AccCod',
      sorter: (a, b) => a.AccCod.localeCompare(b.AccCod),
    },
  ];
  
  const onSearch = (event) => {
    const filteredTable = tableData.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredTableData(filteredTable);
  };

  return (
    <Modal
      width={768}
      title={t("SubAcc")}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          {t("close")}
        </Button>,
        <Button
          disabled={!rowData}
          type="primary"
          onClick={selectRow}
          key="select"
        >
          {t("select")}
        </Button>,
      ]}
    >
      <Input
        placeholder={`${t('search')} (${t('Name')})`}
        onChange={onSearch}
      />
      <Table
        bordered
        size="middle"
        rowClassName={setRowClassName}
        className="main-table mt-4"
        columns={columns}
        dataSource={filteredTableData}
        loading={tableLoading}
        rowKey={record => record.ID}
        showSorterTooltip={false}
        pagination={false}
        scroll={{
          x: "max-content",
          y: "50vh",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              props.onSelect({
                ID: record.ID, Code: record.Code, Name: props.params.Name
              });
              props.onCancel();
            },
            onClick: () => {
              setRowData({ ID: record.ID, Code: record.Code, Name: props.params.Name });
            },
          };
        }}
      />
    </Modal>
  )
}

export default TableSubAccModal;