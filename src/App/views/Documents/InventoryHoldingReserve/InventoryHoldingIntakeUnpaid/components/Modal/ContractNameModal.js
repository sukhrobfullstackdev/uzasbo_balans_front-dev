import React, { useEffect, useState } from 'react'
import { Form, Modal, Table, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";

import HelperServices from '../../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../../helpers/notifications';


const ContractNameModal = (props) => {
  const { Endpoint, params } = props.params
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [Name, setName] = useState(null);
  const [TableParams, setTableParams] = useState({
    OrderType: null,
    SortColumn: null,
    PageNumber: 1,
    PageLimit: 10,
  });

  const columns = [
    {
      title: t("id"),
      dataIndex: 'ContractID',
      width: 80,
      sorter: (a, b) => a.ContractID - b.ContractID,
    },
    {
      title: t("ContractName"),
      dataIndex: 'ContractName',
      width: 250,
      sorter: (a, b) => a.ContractID - b.ContractID,
    },
    {
      title: t("DebitAmount"),
      dataIndex: 'DebitAmount',
      width: 250,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t("CreditAmount"),
      dataIndex: 'CreditAmount',
      width: 250,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
  ];

  const fetchData = async () => {
    const [tableData] = await Promise.all([
      HelperServices.getContractForSelectList(
        {
          Name: Name,
          ...params,
          ...TableParams,
        },
        Endpoint
      ),
    ]);
    setTableData(tableData.data);
    setTableLoading(false);
  };

  useEffect(() => {
    fetchData().catch(err => {
      Notification('error', err);
      setTableLoading(false);
    });
  }, [props.params, Name, TableParams]);




  const onSearch = (event) => {
    setName(event);
  };

  const setRowClassName = (record) => {
    return record.ContractID === rowData.id ? 'table-row clicked-row' : 'table-row';

  }

  function handleTableChange(pagination, filters, sorter, extra) {
    const { field, order } = sorter;
    setTableLoading(true);
    setTableParams({
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    });
  };


  return (
    <Modal
      width={800}
      title={t("ContractName")}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={() => {
        props.onCancel();
        props.onSelect(rowData);
      }}
    >
      <Fade>

        <Form
          layout='vertical'
          className='table-filter-form'
          form={filterForm}
        // onFinish={filterHandler}
        >
          <div className="main-table-filter-wrapper">

            <Form.Item
              label={t("Name")}
              name="Name"
            >
              <Input.Search
                className="table-search"
                placeholder={t("search")}
                enterButton
                onSearch={onSearch}
              />
            </Form.Item>

          </div>
          <Table
            bordered
            size="middle"
            rowClassName={setRowClassName}
            // className="main-table mt-4"
            columns={columns}
            dataSource={tableData?.rows}
            loading={tableLoading}
            rowKey={record => record.ContractID}
            showSorterTooltip={false}
            onChange={handleTableChange}
            pagination={{
              total: tableData?.total,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            scroll={{
              x: "max-content",
              y: "50vh",
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  props.onSelect({ id: record.ContractID, name: record.ContractName });
                  props.onCancel();
                },
                onClick: () => {
                  setRowData({ id: record.ContractID, name: record.ContractName });
                },
              };
            }}
          />
        </Form>
      </Fade>
    </Modal >
  )
}

export default React.memo(ContractNameModal);