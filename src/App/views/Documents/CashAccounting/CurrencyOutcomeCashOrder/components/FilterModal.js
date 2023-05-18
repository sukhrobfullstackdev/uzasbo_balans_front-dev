import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const FilterModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const tableList = useSelector((state) => state.contractsList);
  const tableFilterData = tableList?.filterData;

  const onFormFinish = (values) => {
    props.onSubmit(values);
  }

  return (
    <Modal
      visible={props.visible}
      title={t("filter")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      footer={[
        <Button form="form" htmlType="submit" key='submit' type="primary">
          {t('save')}
        </Button>,
        <Button form="form" key='cancel' onClick={props.onCancel}>
          {t('cancel')}
        </Button>
      ]}
    >
      <Form
        {...formItemLayout}
        id='form'
        form={form}
        onFinish={onFormFinish}
        initialValues={{
          ...tableFilterData
        }}
      >

        <Form.Item
          label={t('Number')}
          name='Number'
        >
          <Input placeholder={t('Number')} />
        </Form.Item>

        <Form.Item
          label={t('startSum')}
          name='StartSum'
        >
          <Input placeholder={t('startSum')} />
        </Form.Item>

        <Form.Item
          label={t('endSum')}
          name='EndSum'
        >
          <Input placeholder={t('endSum')} />
        </Form.Item>

        <Form.Item
          label={t('AccDb')}
          name='SubAccDb'
        >
          <Input placeholder={t('AccDb')} />
        </Form.Item>

        <Form.Item
          label={t('AccCr')}
          name='SubAccCr'
        >
          <Input placeholder={t('AccCr')} />
        </Form.Item>

        <Form.Item
          label={t('Status')}
          name="Status"
        >
          <Select
            allowClear
            showSearch
            placeholder={t("Status")}
            style={{ width: 200 }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {props.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(FilterModal);