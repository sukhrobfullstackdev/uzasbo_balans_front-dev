import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';

import HelperServices from '../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../helpers/notifications';

const { Option } = Select;

const EditSettelmentModal = (props) => {
  console.log(props)
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [movementsKindList, setMovementsKindList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ movementsKindList] = await Promise.all([
    HelperServices.getMoneyMeansMovementsKind(props.data.MoneyMeansMovementsKindID),
  ]);

  console.log(movementsKindList.data.DisplayName)

  setMovementsKindList(movementsKindList.data);

    form.setFieldsValue({
      ...props.data,
      ID: props.data.ID,
      AllowedTransactionID: movementsKindList.data ? <div className='ellipsis-2'>{movementsKindList.DisplayName}</div> : '',
      MoneyMeansMovementsKindID: props.data.MoneyMeansMovementsKindID,
      Source: props.data.Source,
      TreasOperCode: props.data.TreasOperCode
    })
  };
  fetchData().catch(err => {
      Notification('error', err);
  });
  }, [form, props.data]);


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
            values.ID = props.data.ID;
            values.Status = values.ID === 0 ? values.Status = 1 : values.Status = 2;
            const newData = [...props.tableData];
            const key = props.data.ID === 0 ? props.data.key : props.data.ID;
            const index = newData.findIndex(item => key === (item.ID === 0 ? item.key : item.ID));
            newData[index] = values;
            props.onEdit(newData);
            props.onCancel();
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
          name="MoneyMeansMovementsKindID"
          // rules={[
          //   {
          //     required: true,
          //     message: t('Please select'),
          //   },
          // ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("AllowedTransactionID")}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {movementsKindList.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.DisplayName}</Option>)
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

export default React.memo(EditSettelmentModal);