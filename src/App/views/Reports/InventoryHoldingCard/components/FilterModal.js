import { Modal, Form, Input, Button } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

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
  const tableList = useSelector((state) => state.inventoryHoldingCardList);
  const tableFilterData = tableList?.filterData;

  const onFormFinish = (values) => {
    props.onOk(values);
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
          {t('confirm')}
        </Button>,
        <Button
          key='cancel'
          onClick={() => {
            form.setFieldsValue({
              Number: null,
              NumberMO: null,
              Details: null,
            });
          }}
        >
          {t('clear')}
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
          label={t('number')}
          name='Number'
        >
          <Input placeholder={t('number')} />
        </Form.Item>

        <Form.Item
          label={t('numberMo')}
          name='NumberMO'
        >
          <Input placeholder={t('numberMo')} />
        </Form.Item>

        <Form.Item
          label={t('details')}
          name='Details'
          style={{ marginBottom: 0 }}
        >
          <Input placeholder={t('details')} />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default FilterModal;