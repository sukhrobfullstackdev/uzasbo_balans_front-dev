import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../helpers/notifications';

const { Option } = Select;

const AddSettelmentModal = (props) => {
  
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [movementsKindList, setMovementsKindList] = useState([]);
  // const [id, setId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ movementsKindList] = await Promise.all([
    HelperServices.getMoneyMeansMovementsKind(),
  ]);

  setMovementsKindList(movementsKindList.data);

    form.setFieldsValue({
      ...props.data,
      ID: 0,
    })
  };
  fetchData().catch(err => {
      Notification('error', err);
  });
  }, [form, props.data]);

  const idHandler = (id, data) => {
    form.setFieldsValue({
      MoneyMeansMovementsKindID: data ? data['data-moneyMoveId'] : null,
    })
  }


  return (
    <Modal
      visible={props.visible}
      title={t("Settlement")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {
            console.log(values)
            values.ID = 0;
            // values.MoneyMeansMovementsKindID = id.MoneyMeansMovementsKindID
            props.onCreate(values);
            props.onCancel();
            form.resetFields();
          })
          .catch(err => console.log(err));
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >

        <Form.Item
          label={t('ID')}
          name='ID'
        >
          <Input disabled maxLength={7} />
        </Form.Item>

        <Form.Item
          label={t('AllowedTransactionID')}
          name="AllowedTransactionID"
          rules={[
            {
              required: true,
              message: t('Please select'),
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("AllowedTransactionID")}
            showSearch
            onChange={idHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {movementsKindList.map(item => {
              return (
                <Option key={item.ID} value={item.ID} data-moneyMoveId={item.ID}>{item.DisplayName}</Option>)
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('AllowedTransactionID')}
          name="MoneyMeansMovementsKindID"
          
        >
          <Input placeholder={t('AllowedTransactionID')} />
        </Form.Item>

        <Form.Item
          label={t('Source')}
          name="Source"
          
        >
          <Input placeholder={t('Source')} />
        </Form.Item>

        <Form.Item
          label={t('TreasOperCode')}
          name="TreasOperCode"
          
        >
          <Input placeholder={t('TreasOperCode')} />
        </Form.Item>

      </Form>
    </Modal >
  );
};

export default React.memo(AddSettelmentModal);