import React, { useState } from "react";
import { Form, Select, Input, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const TableHeader = (props) => {

  // const [BankID, setBankID] = useState('');
  // const [Code, setCode] = useState('');
  // const [Name, setName] = useState('');

  const { t } = useTranslation();
  const [addStaffForm] = Form.useForm();

  const addStaffHandler = () => {
    addStaffForm.validateFields()
      .then(values => {
        values.key = Math.random().toString();
        values.ID = 0;
        values.Status = 1;
        // values.BankID = BankID;
        // values.Code = Code;
        // values.Name = Name;
        props.addData(values);
      })
  }

  return (
    <Form
      {...layout}
      form={addStaffForm}
      component={false}
      initialValues={{
        Salary: 0,
        CorrCoefficient: 1,
        OrderNumber: 1,
      }}
    >
      <tr>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('Name')}
            name='Name'
            rules={[
              {
                required: true,
                message: t("inputValidData"),
              },
            ]}
          >
            <Input
              placeholder={t('Name')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('accountname')}
            name='Code'
            rules={[
              {
                required: true,
                message: t("inputValidData"),
              },
            ]}
          >
            <Input
              placeholder={t('Code')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('BankCode')}
            name='BankID'
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
              placeholder={t("BankCode")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.bankList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
            </Select>
          </Form.Item>
        </th>
        
        <th className='ant-table-cell' style={{ textAlign: 'center' }}>
          <Button
            type='primary'
            shape="circle"
            icon={<i className="feather icon-plus" aria-hidden="true" />}
            htmlType='submit'
            onClick={addStaffHandler}
          />
        </th>
      </tr >
    </Form >
  );
};

export default React.memo(TableHeader);
