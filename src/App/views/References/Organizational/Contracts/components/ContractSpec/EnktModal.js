import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Table, Form, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../../helpers/notifications';
import { initialMainTablePagination } from '../../../../../../../helpers/helpers';

const EnktModal = (props) => {
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
        HelperServices.getENKTList(initialMainTablePagination),
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

  const getTableData = useCallback((payload) => {
    setPagination(prevState => ({ ...prevState, ...payload }));
    setTableLoading(true);
    HelperServices.getENKTList(payload)
      .then(res => {
        setTableData(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false))
  }, [])

  const columns = [
    {
      title: t("ENKTCode"),
      dataIndex: 'Code',
      width: 100,
      sorter: true
    },
    {
      title: t("locale"),
      dataIndex: 'Locale',
      width: 100,
      sorter: true
    },
    {
      title: t("Value"),
      dataIndex: 'Value',
      width: 200,
      sorter: true,
      render: record => <div className='ellipsis-2'>{record}</div>
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
      Name: values?.Name?.trim(),
      Code: values?.Code?.trim()
    })
    getTableData({
      ...initialMainTablePagination,
      Name: values?.Name?.trim(),
      Code: values?.Code?.trim()
    });
  }, [getTableData])

  return (
    <Modal
      width={800}
      title={t("ENKTCode")}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button
          type='danger'
          key='clear'
          onClick={() => props.onSelect({ code: null, value: null })}
        >
          {t('clear')}
        </Button>,
        <Button
          type='primary'
          key='confirm'
          onClick={() => props.onSelect(rowData)}
        >
          {t('confirm')}
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
            label={t('name')}
            name='Name'
          >
            <Input
              placeholder={t("name")}
            />
          </Form.Item>
          <Form.Item
            label={t("ENKTCode")}
            name='Code'
          >
            <Input
              placeholder={t("ENKTCode")}
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
        rowKey={(record) => record.ID}
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
          y: "40vh",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              props.onSelect({ code: record.Code, value: record.Value });
            },
            onClick: () => {
              setRowData({ code: record.Code, value: record.Value, id: record.ID });
            },
          };
        }}
      />
    </Modal >
  )
}

export default EnktModal;