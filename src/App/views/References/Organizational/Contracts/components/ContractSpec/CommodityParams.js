import React, { useState, useCallback } from 'react';
import { Table, Form, Tooltip, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../../services/Helper/helper.services';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const CommodityParamsTable = ({ data, enktPropsList, enktCode, setData }) => {
  const [commodityParamsForm] = Form.useForm();
  const { t } = useTranslation();

  const [enktPropsValList, setEnktPropsValList] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [loading, setLoading] = useState(false);

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
  
  const columns = [
    {
      title: t("propertiesName"),
      dataIndex: "PropertiesName",
      // width: 100,
    },
    {
      title: t("propertiesValuesName"),
      dataIndex: "PropertiesValuesName",
      // width: 100,
    },
    {
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Tooltip title={t('Delete')}>
            <span
              onClick={() => deleteRowHandler(record)}
            >
              <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
            </span>
          </Tooltip>
        );
      },
    }
  ];

  const enktPropsChangeHandler = useCallback((_, data) => {
    setLoading(true);
    HelperServices.getENKTPropertiesValuesList({
      language: 'ru_RU',
      Number: data['key'],
      Code: enktCode
    })
      .then(res => {
        setEnktPropsValList(res.data);
        setLoading(false);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }, [enktCode])

  const addTableDataHandler = () => {
    commodityParamsForm.validateFields()
      .then(values => {
        values.ID = 0;
        values.Status = 1;
        values.key = Math.random();
        setTableData(prevValues => [...prevValues, values]);
        setData([...tableData, values]);
        commodityParamsForm.resetFields();
      })
      .catch(err => err);
  }

  return (
    <Form
      form={commodityParamsForm}
      {...layout}
      component={false}
    >
      <Table
        bordered
        size='middle'
        pagination={false}
        loading={loading}
        rowClassName="table-row"
        className="main-table"
        rowKey={(record) => record.ID === 0 ? record.key : record.ID}
        columns={columns}
        dataSource={tableData.filter(item => item.Status !== 3)}
        scroll={{
          x: "max-content",
          // y: '90vh'
        }}
        components={{
          header: {
            row: () => (
              <tr>
                <th className='ant-table-cell' style={{ width: '46%' }}>
                  <Form.Item
                    label={t('enktPropsList')}
                    name='PropertiesName'
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder={t("enktPropsList")}
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      onChange={enktPropsChangeHandler}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {enktPropsList.map(item => <Option key={item.Number} value={item.Value}>{item.Value}</Option>)}
                    </Select>
                  </Form.Item>
                </th>
                <th className='ant-table-cell' style={{ width: '46%' }}>
                  <Form.Item
                    label={t('enktPropsValList')}
                    name='PropertiesValuesName'
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder={t("enktPropsValList")}
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {enktPropsValList.map(item => <Option key={item.ValueNumber} value={item.Value}>{item.Value}</Option>)}
                    </Select>
                  </Form.Item>
                </th>
                <th className='ant-table-cell'>
                  <Form.Item label={t('add')}>
                    <Button type='primary' onClick={addTableDataHandler}>
                      <i className="feather icon-plus" aria-hidden="true" />
                    </Button>
                  </Form.Item>
                </th>
              </tr>
            )
          }
        }}
      />
    </Form>
  );
};

export default CommodityParamsTable;