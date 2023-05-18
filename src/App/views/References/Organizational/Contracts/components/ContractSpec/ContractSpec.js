import React, { useMemo, useState, useCallback } from 'react';
import { Button, Space, Tooltip, Table } from 'antd';
import { useTranslation } from "react-i18next";
import { CSSTransition } from 'react-transition-group';

// import ContractsApis from '../../../../../../../services/References/Organizational/Contracts/Contracts';
import UpdateModal from './UpdateContractSpecTableData';
import ContractsApis from '../../../../../../../services/References/Organizational/Contracts/Contracts';
import { Notification } from '../../../../../../../helpers/notifications';

const defaultRowData = {
  "ID": 0,
  "Status": 1,
  "Quantity": 0,
  "Price": 0,
  "Sum": 0,
  "GuaranteePeriod": null,
  "DateOfIssue": null,
  "ExpirationDate": null,
  "SplitTables": [
    {
      "ID": 0,
      "OwnerID": 0,
      "Quarter1": 0,
      "Month1": 0,
      "Month2": 0,
      "Month3": 0,
      "Quarter2": 0,
      "Month4": 0,
      "Month5": 0,
      "Month6": 0,
      "Quarter3": 0,
      "Month7": 0,
      "Month8": 0,
      "Month9": 0,
      "Quarter4": 0,
      "Month10": 0,
      "Month11": 0,
      "Month12": 0,
      "Sum": 0,
      "Status": 0
    }
  ],
  "CV2Tables": []
}

const ContractSpec = ({ setData, mainForm, ...props }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [rowData, setRowData] = useState({});
  const [tableData, setTableData] = useState(props.tableData);

  const fillHandler = useCallback(() => {
    setLoading(true);
    ContractsApis.fillWithLot({
      Ticket: mainForm.getFieldValue('Ticket'),
      OrganizationsSettlementAccountID: mainForm.getFieldValue('OrganizationsSettlementAccountID')
    })
      .then(res => {
        setTableData(res.data);
      })
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))
  }, [mainForm])

  const deleteRowHandler = useCallback((row) => {
    const obj = { ...row }
    obj.Status = 3;
    const newData = [...tableData];
    if (row.ID === 0) {
      const index = newData.findIndex((item) => row.key === item.key);
      newData.splice(index, 1, obj);
    } else {
      const index = newData.findIndex((item) => row.ID === item.ID);
      newData.splice(index, 1, obj);
    }
    setTableData(newData);
    setData(newData);
  }, [tableData, setData])

  const columns = useMemo(() => [
    {
      title: t("number"),
      dataIndex: "Number",
      width: 80
    },
    {
      title: t("ENKTCode"),
      dataIndex: "ENKTCode",
      // width: 120
    },
    {
      title: t("ENKTValue"),
      dataIndex: "ENKTValue",
      // width: 80,
    },
    {
      title: t("quantity"),
      dataIndex: "Quantity",
      // width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t("price"),
      dataIndex: "Price",
      // width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t("sum"),
      dataIndex: "Sum",
      // width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t("itemOfExpensesCode"),
      dataIndex: "ItemOfExpensesCode",
      // width: 150,
    },
    {
      title: t("mark"),
      dataIndex: "Mark",
      // width: 80,
    },
    {
      title: (
        <Tooltip title={t('add')}>
          <Button
            type='primary'
            onClick={() => {
              setUpdateModalVisible(true);
              defaultRowData.Number = tableData.filter(item => item.Status !== 3).length + 1;
              setRowData(defaultRowData);
            }}>
            <i className="feather icon-plus" aria-hidden="true" />
          </Button>
        </Tooltip>
      ),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setUpdateModalVisible(true);
                  setRowData(record);
                }}
              >
                <i className='feather icon-edit action-icon' />
              </span>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <span onClick={() => deleteRowHandler(record)}>
                <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ], [t, deleteRowHandler, tableData]);

  // Update Modal
  const saveDataHandler = useCallback((values) => {
    setUpdateModalVisible(false);
    const newData = [...tableData];
    if (values.ID !== 0) {
      const index = newData.findIndex((item) => values.ID === item.ID);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...values });
    } else {
      const index = newData.findIndex((item) => values.key === item.key);
      if (index < 0) {
        newData.splice(0, 0, values);
      } else {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...values });
      }
    }
    setTableData(newData);
    setData(newData);
  }, [tableData, setData])
  // Update Modal end

  return (
    <>
      <Space size='middle' className='btns-wrapper mt-0 mb-3'>
        {props.ticket !== '' &&
          <Button
            type="dashed"
            onClick={fillHandler}
            disabled={tableData.filter(item => item.Status !== 3).length > 0}
          >
            {t('fillWithLot')}
          </Button>}
      </Space>
      <Table
        bordered
        size='middle'
        loading={loading}
        pagination={false}
        rowClassName="table-row"
        className="main-table"
        rowKey={(record) => record.ID === 0 ? record.key : record.ID}
        columns={columns}
        dataSource={tableData.filter(item => item.Status !== 3)}
        scroll={{
          x: "max-content",
          y: '90vh'
        }}
      />

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={updateModalVisible}
        timeout={300}
      >
        <UpdateModal
          visible={updateModalVisible}
          onCancel={useCallback(() => setUpdateModalVisible(false), [])}
          rowData={rowData}
          onSave={saveDataHandler}
        />
      </CSSTransition>
    </>
  );
};

export default ContractSpec;
