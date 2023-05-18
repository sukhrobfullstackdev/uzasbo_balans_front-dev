import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Table, Input, Form, Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import resPersonApis from '../../../services/References/Organizational/ResponsiblePerson/ResponsiblePerson.services'
import { Notification } from '../../../helpers/notifications';
import { initialMainTablePagination } from '../../../helpers/helpers';

const DepartmentModal = (props) => {
  const { t } = useTranslation();

  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(initialMainTablePagination);
  const [filterData, setFilterData] = useState({});
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [tableDt] = await Promise.all([
        resPersonApis.getList(initialMainTablePagination),
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
      title: t("name"),
      dataIndex: 'Name',
      sorter: true,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      sorter: true,
      width: 120,
      render: (_, record) => (record.StateID === 1 ?
        <Tag color='#f50'>
          {record.State}
        </Tag> :
        <Tag color='#87d068'>
          {record.State}
        </Tag>
      )
    },
  ];

  const getTableData = useCallback((payload) => {
    setPagination(prevState => ({ ...prevState, ...payload }));
    setTableLoading(true);
    resPersonApis.getList(payload)
      .then(res => {
        setTableData(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false))
  }, [])

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

  const onSearch = useCallback((e) => {
    setFilterData({ Name: e.trim() });
    getTableData({
      Name: e.trim(),
      ...initialMainTablePagination
    })
  }, [getTableData]);

  return (
    <Modal
      width={800}
      title={t("responsiblePerson")}
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

export default DepartmentModal;