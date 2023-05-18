import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Table, Form, Popconfirm, Tooltip, Space } from 'antd';
import { useTranslation } from 'react-i18next';
// import { CSSTransition } from 'react-transition-group';
import { useDispatch } from 'react-redux';
import Fade from "react-reveal/Fade";

import PaymentScheduleTableHeader from './PyamentScheduleTableHeader';
import HelperServices from '../../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../../helpers/notifications';
// import EditModal from './EditModal';
import EditableCell from './EditableCell';
import { subractSum, setInitialSum, addSum } from '../../_redux/contractsSlice';

const PaymentScheduleTable = ({ setData, ...props }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(props.tableData);
  const [itemOfExpenseList, setItemOfExpenseList] = useState([]);
  // const [editModalVisible, setEditModalVisible] = useState(false);
  // const [editData, setEditData] = useState({});

  useEffect(() => {
    HelperServices.getItemOfExpenseList()
      .then(res => {
        setLoading(false);
        setItemOfExpenseList(res.data);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }, []);

  const deleteRowHandler = useCallback((row) => {
    const obj = { ...row }
    obj.Status = 3;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    newData.splice(index, 1, obj);
    setTableData(newData);
    setData(newData);
    // dispatch(setPaymentScheduleTableData(newData));
    dispatch(subractSum(obj.Sum));
  }, [dispatch, tableData, setData])

  const defaultColumns = [
    {
      title: t("itemOfExpenseList"),
      dataIndex: "ItemOfExpensesID",
      width: 250,
      render: (value) => {
        const record = itemOfExpenseList.find(item => item.ID === value);
        return record ? <div className='ellipsis-2'>{record.Code}</div> : '';
      }
    },
    {
      title: t("january"),
      dataIndex: "Month1",
      width: 120,
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("february"),
      dataIndex: "Month2",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("march"),
      dataIndex: "Month3",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("april"),
      dataIndex: "Month4",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("may"),
      dataIndex: "Month5",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("june"),
      dataIndex: "Month6",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("july"),
      dataIndex: "Month7",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("august"),
      dataIndex: "Month8",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("september"),
      dataIndex: "Month9",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("october"),
      dataIndex: "Month10",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("november"),
      dataIndex: "Month11",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("december"),
      dataIndex: "Month12",
      editable: true,
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("sum"),
      dataIndex: "Sum",
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: '',
      dataIndex: "",
      key: "add",
      fixed: 'right',
      align: 'center',
      width: 50,
      render: record => (
        <Space>
          {/* <Tooltip title={t('Edit')}>
            <span
              onClick={() => {
                setEditModalVisible(true);
                setEditData(record);
              }}
            >
              <i className='feather icon-edit action-icon' />
            </span>
          </Tooltip> */}
          <Tooltip title={t('Delete')}>
            <Popconfirm
              title={t('delete')}
              onConfirm={() => deleteRowHandler(record)}
              okText={t("yes")}
              cancelText={t("cancel")}
            >
              <span>
                <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
              </span>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    },
  ];

  const handleSave = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    row.Sum = row.Month1 + row.Month2 + row.Month3 + row.Month4 + row.Month5 + row.Month6 + row.Month7 + row.Month8 + row.Month9 + row.Month10 + row.Month11 + row.Month12;
    row.Status = row.ID === 0 ? 1 : 2;
    newData.splice(index, 1, { ...item, ...row });
    let sum = 0;
    for (let item of newData) {
      sum += +item.Sum
    }
    dispatch(setInitialSum(sum));
    setTableData(newData);
    setData(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        form
      })
    };
  });

  const addTableData = useCallback((values) => {
    dispatch(addSum(values.Sum));
    setData([...tableData, values]);
    setTableData(prevState => {
      return [...prevState, values]
    });
  }, [dispatch, setData, tableData])

  const tableSummaryHandler = useCallback(records => {
    let totalSum = 0;

    records.forEach(item => {
      totalSum += +item.Sum;
    });

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell>
          {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalSum)}
        </Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
      </Table.Summary.Row>
    );
  }, [])

  return (
    <Spin spinning={loading} size='large'>
      <Fade>
        <Form
          form={form}
          component={false}
        >
          <Table
            bordered
            size='middle'
            pagination={false}
            rowClassName="table-row"
            className="main-table"
            summary={records => tableSummaryHandler(records)}
            rowKey={(record) => record.key}
            columns={columns}
            dataSource={tableData.filter(item => item.Status !== 3)}
            scroll={{
              x: "max-content",
              // y: '90vh'
            }}
            components={{
              header: {
                row: () => <PaymentScheduleTableHeader
                  itemOfExpenseList={itemOfExpenseList}
                  addTableData={addTableData}
                />
              },
              body: {
                cell: EditableCell
              }
            }}
          />
        </Form>
      </Fade>
      {/* <CSSTransition
        mountOnEnter
        unmountOnExit
        in={editModalVisible}
        timeout={300}
      >
        <EditModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          rowData={editData}
          tableData={tableData}
          onSave={saveDataHandler}
          itemOfExpenseList={itemOfExpenseList}
        />
      </CSSTransition> */}
    </Spin>
  );
};

export default React.memo(PaymentScheduleTable);