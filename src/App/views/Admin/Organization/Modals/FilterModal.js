import React from "react";
import { Modal, Form, DatePicker,  } from "antd";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
// import moment from 'moment';

// import { Notification } from '../../../../../helpers/notifications';

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
      title={t("Pereraschet")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.BeginDate = values.BeginDate.format("DD.MM.YYYY");
            values.EndDate = values.EndDate.format("DD.MM.YYYY");
            props.onCreate(values);
            form.resetFields();
          })
          .catch(err => console.log(err));
      }}
      // footer={[
       
      //   <Button form="form" key='cancel' onClick={props.onCancel}>
      //     {t('cancel')}
      //   </Button>
      // ]}
    >
      <Form
        {...formItemLayout}
        id='form'
        form={form}
        onFinish={onFormFinish}
        initialValues={{
       
        }}
      >
       <Form.Item
        label={t("BeginDate")}
        name="BeginDate"
        rules={[
            {
            required: true,
            message: t("pleaseSelect"),
            },
        ]}
        >
        <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
        label={t("EndDate")}
        name="EndDate"
        rules={[
            {
            required: true,
            message: t("pleaseSelect"),
            },
        ]}
        >
        <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
        </Form.Item>

       
        
      </Form>
    </Modal >
  );
};

export default React.memo(FilterModal);