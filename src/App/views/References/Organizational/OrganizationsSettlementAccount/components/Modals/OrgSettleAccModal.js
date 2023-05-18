import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Table, Form, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import commonApis from '../../../../../../../services/common/commonApis';
import { Notification } from '../../../../../../../helpers/notifications';
import { initialMainTablePagination } from '../../../../../../../helpers/helpers';

const OrgSettleAccModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(initialMainTablePagination);
  const [filterData, setFilterData] = useState({});
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [tableDt] = await Promise.all([
        commonApis.getList('OrganizationsSettlementAccount', initialMainTablePagination),
      ]);
      setTableData(tableDt.data.rows);
      setPagination(prevState => ({ ...prevState, total: tableDt.data.total }))
    };

    fetchData().catch(err => {
      Notification('error', err);
    })
      .finally(() => setTableLoading(false));
  }, []);

  const getTableData = useCallback((payload) => {
    setPagination(prevState => ({ ...prevState, ...payload }));
    setTableLoading(true);
    commonApis.getList('OrganizationsSettlementAccount', payload)
      .then(res => {
        setTableData(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false))
  }, [])

  const columns = [
    {
      title: t("id"),
      dataIndex: 'ID',
      width: 80,
      sorter: true
    },
    {
      title: t("code"),
      dataIndex: 'Code',
      width: 200,
      sorter: true
    },
    {
      title: t("OrgSettleAcc"),
      dataIndex: 'OldCode',
      width: 200,
      sorter: true,
    },
    {
      title: t("GetSubCashList"),
      dataIndex: 'CashSubAcc',
      width: 100,
      sorter: true,
    },
    {
      title: t("GetSubActualList"),
      dataIndex: 'ActualSubAcc',
      width: 100,
      sorter: true,
    },
  ];

  const tableChangeHandler = (pagination, _, sorter) => {
    const { field, order } = sorter;
    getTableData({
      ...filterData,
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    })
  }

  const setRowClassName = (record) => {
    return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
  }

  const filterHandler = useCallback((values) => {
    setFilterData({
      Code: values?.Code?.trim()
    })
    getTableData({
      ...initialMainTablePagination,
      Code: values?.Code?.trim()
    });
  }, [getTableData])

  return (
    <Modal
      width={900}
      title={t("organizationsSett")}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button
          type='primary'
          key='confirm'
          onClick={() => props.onSelect(rowData)}
        >
          {t('select')}
        </Button>,
        <Button
          type='danger'
          key='clear'
          onClick={() => props.onCancel()}
        >
          {t('close')}
        </Button>
      ]}
    >
      <Form
        layout='vertical'
        form={form}
        onFinish={filterHandler}
      >
        <div className="main-table-filter-wrapper">
          <Form.Item
            label={t("Code")}
            name='Code'
          >
            <Input
              placeholder={t("Code")}
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <i className="feather icon-refresh-ccw" />
            </Button>
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
              props.onSelect({ id: record.ID, code: record.Code, actualSubAcc: record.ActualSubAcc });
            },
            onClick: () => {
              setRowData({ id: record.ID, code: record.Code, actualSubAcc: record.ActualSubAcc });
            },
          };
        }}
      />
    </Modal>
  )
}

export default OrgSettleAccModal;