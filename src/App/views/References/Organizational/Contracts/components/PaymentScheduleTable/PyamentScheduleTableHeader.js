import React, { useCallback, useState } from "react";
import { Form, Select, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";

import classes from '../../Contracts.module.css'
// import { addSum } from "../../_redux/contractsSlice";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const PaymentScheduleTableHeader = (props) => {
  // console.log('tableheader');
  const { addTableData } = props;

  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [sum, setSumm] = useState(0);

  const addStaffHandler = useCallback(() => {
    form.validateFields()
      .then(values => {
        values.key = Math.random().toString();
        values.ID = 0;
        values.Status = 1;
        values.Sum = sum;
        addTableData(values);
      })
  }, [form, addTableData, sum])

  const monthBlurHandler = useCallback((e) => {
    const formValues = form.getFieldsValue();
    const sum = formValues.Month1 + formValues.Month2 + formValues.Month3 + formValues.Month4 + formValues.Month5 + formValues.Month6 + formValues.Month7 + formValues.Month8 + formValues.Month9 + formValues.Month10 + formValues.Month11 + formValues.Month12;
    setSumm(sum);
    // dispatch(addSum(sum));
  }, [form])

  return (
    <Form
      {...layout}
      form={form}
      component={false}
      initialValues={{
        Month1: 0,
        Month2: 0,
        Month3: 0,
        Month4: 0,
        Month5: 0,
        Month6: 0,
        Month7: 0,
        Month8: 0,
        Month9: 0,
        Month10: 0,
        Month11: 0,
        Month12: 0,
      }}
    >
      <tr>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('itemOfExpenseList')}
            name='ItemOfExpensesID'
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
              placeholder={t("itemOfExpenseList")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.itemOfExpenseList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
            </Select>
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('january')}
            name='Month1'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('january')}
              style={{ width: "100%" }}
              decimalSeparator=','
              parser={value => value.replace(/\$\s?|( *)/g, '')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('february')}
            name='Month2'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('february')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('march')}
            name='Month3'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('march')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('april')}
            name='Month4'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('april')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('may')}
            name='Month5'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('may')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('june')}
            name='Month6'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('june')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('july')}
            name='Month7'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('july')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('august')}
            name='Month8'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('august')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('september')}
            name='Month9'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('september')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('october')}
            name='Month10'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('october')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('november')}
            name='Month11'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('november')}
              style={{ width: "100%" }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('december')}
            name='Month12'
          >
            <InputNumber
              onBlur={monthBlurHandler}
              placeholder={t('december')}
              style={{ width: "100%", textAlign: 'right' }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          {t('sum')}
          {/* <Form.Item
            label={t('sum')}
          >
            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(sum)}
          </Form.Item> */}
        </th>
        <th className={`ant-table-cell ant-table-cell-fix-right ant-table-cell-fix-right-first ${classes['fixed-th']}`}>
          <Button
            type='primary'
            // shape="circle"
            icon={<i className="feather icon-plus" aria-hidden="true" />}
            htmlType='submit'
            onClick={addStaffHandler}
          />
        </th>
      </tr>
    </Form >
  );
};

export default React.memo(PaymentScheduleTableHeader);
