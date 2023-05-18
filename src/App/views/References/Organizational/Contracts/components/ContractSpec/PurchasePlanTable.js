import React, { useCallback } from 'react';
import { Table, Form, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const PurchasePlanTable = ({ form, mainForm }) => {
  const { t } = useTranslation();

  const quarter1Handler = useCallback((e) => {
    const jan = form.getFieldValue('Month1');
    const feb = form.getFieldValue('Month2');
    const mar = form.getFieldValue('Month3');
    const quat2 = form.getFieldValue('Quarter2');
    const quat3 = form.getFieldValue('Quarter3');
    const quat4 = form.getFieldValue('Quarter4');

    form.setFieldsValue({
      Quarter1: jan + feb + mar,
      Sum: jan + feb + mar + quat2 + quat3 + quat4
    });

    const Sum = form.getFieldValue('Sum');
    const Price = +mainForm.getFieldValue('Price');

    mainForm.setFieldsValue({
      Quantity: Sum,
      Sum: Price * Sum
    })
  }, [form, mainForm])

  const quarter2Handler = useCallback((e) => {
    const apr = form.getFieldValue('Month4');
    const may = form.getFieldValue('Month5');
    const june = form.getFieldValue('Month6');
    const quat1 = form.getFieldValue('Quarter1');
    const quat3 = form.getFieldValue('Quarter3');
    const quat4 = form.getFieldValue('Quarter4');

    form.setFieldsValue({
      Quarter2: apr + may + june,
      Sum: apr + may + june + quat1 + quat3 + quat4
    });

    const Sum = form.getFieldValue('Sum');
    const Price = +mainForm.getFieldValue('Price');

    mainForm.setFieldsValue({
      Quantity: Sum,
      Sum: Price * Sum
    })
  }, [form, mainForm])

  const quarter3Handler = useCallback(() => {
    const july = form.getFieldValue('Month7');
    const aug = form.getFieldValue('Month8');
    const sep = form.getFieldValue('Month9');
    const quat1 = form.getFieldValue('Quarter1');
    const quat2 = form.getFieldValue('Quarter2');
    const quat4 = form.getFieldValue('Quarter4');

    form.setFieldsValue({
      Quarter3: july + aug + sep,
      Sum: july + aug + sep + quat1 + quat2 + quat4
    });

    const Sum = form.getFieldValue('Sum');
    const Price = +mainForm.getFieldValue('Price');

    mainForm.setFieldsValue({
      Quantity: Sum,
      Sum: Price * Sum
    })
  }, [form, mainForm])

  const quarter4Handler = useCallback(() => {
    const okt = form.getFieldValue('Month10');
    const nov = form.getFieldValue('Month11');
    const dec = form.getFieldValue('Month12');
    const quat1 = form.getFieldValue('Quarter1');
    const quat2 = form.getFieldValue('Quarter2');
    const quat3 = form.getFieldValue('Quarter3');

    form.setFieldsValue({
      Quarter4: okt + nov + dec,
      Sum: okt + nov + dec + quat1 + quat2 + quat3
    });

    const Sum = form.getFieldValue('Sum');
    const Price = +mainForm.getFieldValue('Price');

    mainForm.setFieldsValue({
      Quantity: Sum,
      Sum: Price * Sum
    })
  }, [form, mainForm])

  const columns = [
    {
      title: t("january"),
      dataIndex: "Month1",
      width: 100,
    },
    {
      title: t("february"),
      dataIndex: "Month1",
      width: 100,
    },
    {
      title: t("march"),
      dataIndex: "Month3",
      width: 100,
    },
    {
      title: t("quarter") + ' 1',
      dataIndex: "Quater1",
      width: 100,
    },
    {
      title: t("april"),
      dataIndex: "Month4",
      width: 100,
    },
    {
      title: t("may"),
      dataIndex: "Month5",
      width: 100,
    },
    {
      title: t("june"),
      dataIndex: "Month6",
      width: 100,
    },
    {
      title: t("quarter") + ' 2',
      dataIndex: "Quater1",
      width: 100,
    },
    {
      title: t("july"),
      dataIndex: "Month7",
      width: 100,
    },
    {
      title: t("august"),
      dataIndex: "Month8",
      width: 100,
    },
    {
      title: t("september"),
      editable: true,
      width: 100,
    },
    {
      title: t("quarter") + ' 3',
      dataIndex: "Quater1",
      width: 100,
    },
    {
      title: t("october"),
      dataIndex: "Month10",
      width: 100,
    },
    {
      title: t("november"),
      dataIndex: "Month11",
      width: 100,
    },
    {
      title: t("december"),
      dataIndex: "Month12",
      width: 100,
    },
    {
      title: t("quarter") + ' 4',
      dataIndex: "Quater1",
      width: 100,
    },
    {
      title: t("sum"),
      dataIndex: "Sum",
      width: 100,
    },
  ];

  return (
    <Table
      bordered
      size='middle'
      pagination={false}
      rowClassName="table-row"
      className="main-table"
      rowKey={() => Math.random()}
      columns={columns}
      // dataSource={tableData}
      scroll={{
        x: "max-content",
        // y: '90vh'
      }}
      components={{
        body: {
          row: () => (
            <tr>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month1'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter1Handler}
                    placeholder={t('january')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    parser={value => value.replace(/\$\s?|( *)/g, '')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month2'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter1Handler}
                    placeholder={t('february')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month3'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter1Handler}
                    placeholder={t('march')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Quarter1'
                  className='mb-0'
                >
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month4'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter2Handler}
                    placeholder={t('april')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month5'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter2Handler}
                    placeholder={t('may')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month6'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter2Handler}
                    placeholder={t('june')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Quarter2'
                  className='mb-0'
                >
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month7'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter3Handler}
                    placeholder={t('july')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month8'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter3Handler}
                    placeholder={t('august')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month9'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter3Handler}
                    placeholder={t('september')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Quarter3'
                  className='mb-0'
                >
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month10'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter4Handler}
                    placeholder={t('october')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month11'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter4Handler}
                    placeholder={t('november')}
                    style={{ width: "100%" }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Month12'
                  className='mb-0'
                >
                  <InputNumber
                    onBlur={quarter4Handler}
                    placeholder={t('december')}
                    style={{ width: "100%", textAlign: 'right' }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Quarter4'
                  className='mb-0'
                >
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </td>
              <td className='ant-table-cell'>
                <Form.Item
                  name='Sum'
                  className='mb-0'
                >
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </td>
            </tr>
          )
        }
      }}
    />
  );
};

export default PurchasePlanTable;