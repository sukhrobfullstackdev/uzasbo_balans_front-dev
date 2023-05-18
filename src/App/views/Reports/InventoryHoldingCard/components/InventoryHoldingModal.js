import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Table, Input, Form, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import InventoryHoldingApis from '../../../../../services/References/Organizational/InventoryHolding/InventoryHolding.services';
import { Notification } from '../../../../../helpers/notifications';
import { initialMainTablePagination } from '../../../../../helpers/helpers';

const InventoryHoldingModal = (props) => {
  const { t } = useTranslation();

  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(initialMainTablePagination);
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [tableDt] = await Promise.all([
        InventoryHoldingApis.getList(initialMainTablePagination),
      ]);
      setTableData(tableDt.data.rows);
      setPagination(prevState => {
        return ({ ...prevState, total: tableDt.data.total })
      })
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
      title: t("inventoryNumber"),
      dataIndex: 'InventoryNumber',
      width: 100,
      sorter: true,
    },
    {
      title: t("name"),
      dataIndex: 'Name',
      width: 200,
      sorter: true,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("unitsOfMeasure"),
      dataIndex: 'UnitsOfMeasure',
      width: 100,
      sorter: true,
    },
    {
      title: t("itemOfExpense"),
      dataIndex: 'ItemOfExpense',
      width: 100,
      sorter: true,
    },
    {
      title: t("inventoryHoldingType"),
      dataIndex: 'InventoryHoldingType',
      width: 150,
      sorter: true,
    }
  ];

  const getTableData = useCallback((payload) => {
    setPagination(prevState => ({ ...prevState, ...payload }));
    setTableLoading(true);
    InventoryHoldingApis.getList(payload)
      .then(res => {
        setTableData(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false))
  }, [])

  const tableChangeHandler = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    getTableData({
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    })
  }

  const setRowClassName = (record) => {
    return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
  }

  const onSearch = useCallback((e) => {
    getTableData({
      Name: e.trim(),
      ...initialMainTablePagination
    })
  }, [getTableData]);

  return (
    <Modal
      width={900}
      title={t("inventoryHolding")}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button
          type='danger'
          key='clear'
          onClick={() => props.onOk({ id: null, name: null })}
        >
          {t('clear')}
        </Button>,
        <Button
          type='primary'
          key='confirm'
          onClick={() => props.onOk(rowData)}
        >
          {t('confirm')}
        </Button>
      ]}
    >
      <Form>
        <div className="main-table-filter-wrapper">
          <Form.Item>
            <Input.Search
              enterButton
              placeholder={t("search")}
              onSearch={onSearch}
            />
          </Form.Item>
        </div>
      </Form>
      <Table
        bordered
        size="middle"
        rowClassName={setRowClassName}
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        rowKey={record => record.ID}
        showSorterTooltip={false}
        onChange={tableChangeHandler}
        pagination={{
          pageSize: pagination.PageLimit,
          total: pagination.total,
          current: pagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
        scroll={{
          x: "max-content",
          y: "50vh",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              props.onOk({ id: record.ID, name: record.Name });
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

export default InventoryHoldingModal;