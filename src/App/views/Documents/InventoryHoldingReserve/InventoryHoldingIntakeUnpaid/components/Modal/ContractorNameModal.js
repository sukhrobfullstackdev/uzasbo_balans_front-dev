import React, { useEffect, useState } from 'react'
import { Form, Modal, Table, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";

import HelperServices from '../../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../../helpers/notifications';

const ContractorNameModal = (props) => {
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

  const fetchData = async () => {
    const [tableData] = await Promise.all([
      HelperServices.getContractorSubCountList(
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

  const columns = [
    {
      title: t("id"),
      dataIndex: 'ID',
      width: 80,
      sorter: true
    },
    {
      title: t("Name"),
      dataIndex: 'Name',
      width: 250,
      sorter: true
    },
  ];

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

  const onSearch = (event) => {
    setName(event);
  };

  const setRowClassName = (record) => {
    return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
  }

  return (
    <Modal
      width={800}
      title={t("ContractorName")}
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
            rowKey={record => record.ID}
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
                  props.onSelect({ id: record.ID, name: record.Name });
                  props.onCancel();
                },
                onClick: () => {
                  setRowData({ id: record.ID, name: record.Name });
                },
              };
            }}
          />
        </Form>
      </Fade>
    </Modal >
  )
}

export default ContractorNameModal;