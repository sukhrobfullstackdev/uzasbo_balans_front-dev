import React, { useState } from "react";
import { Form, Select, Input, Button } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const TableHeader = (props) => {
  const { t } = useTranslation();
  const [addStaffForm] = Form.useForm();

  const addStaffHandler = () => {
    addStaffForm.validateFields()
      .then(values => {
        values.key = Math.random().toString();
        values.ID = 0;
        props.addData(values);
      })
  }

  return (
    <Form
      {...layout}
      form={addStaffForm}
      component={false}
      initialValues={{
        ID: 0,
      }}
    >
      <tr>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('id')}
            name='ID'
            rules={[
              {
                required: true,
                message: t("inputValidData"),
              },
            ]}
          >
            <Input
              placeholder={t('id')}
              disabled
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('AllowedTransactionID')}
            name='AllowedTransactionID'
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
              placeholder={t("AllowedTransactionID")}
              // style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.movementsKindList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
            </Select>
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('MoneyMeansMovementsKindID')}
            name='MoneyMeansMovementsKindID'
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input
              placeholder={t('MoneyMeansMovementsKindID')}
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('Source')}
            name='Source'
            rules={[
              {
                required: true,
                message: t("inputValidData"),
              },
            ]}
          >
            <Input
              placeholder={t('Source')}
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('TreasOperCode')}
            name='TreasOperCode'
            rules={[
              {
                required: true,
                message: t("inputValidData"),
              },
            ]}
          >
            <Input
              placeholder={t('TreasOperCode')}
            />
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
