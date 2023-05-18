import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useTranslation } from 'react-i18next';
import HelperServices from "../../../../../../services/Helper/helper.services";

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
  console.log(props);
  const [filterForm] = Form.useForm();
  const { t } = useTranslation();

  const [statusList, setStatusList] = useState([])

  const fetchData = async () => {
    const statusList = await HelperServices.getStatusList()
    setStatusList(statusList.data)
  }

  useEffect(() => {
    filterForm.setFieldsValue({
      ...props.filter,
    });
    fetchData().catch(err => {
      Notification('error', err)
    })
  }, [])

  const handleFilter = () => {
    filterForm.validateFields()
      .then(values => {
        values.date = values.date?.format("DD.MM.YYYY");
        values.startyear = values.startyear?.format("YYYY");
        values.endyear = values.endyear?.format("YYYY");
        props.onFilter(values);
      });
    props.onCancel();
  };

  const handleClear = () => {
    filterForm.resetFields();
  };

  const onFinish = (values) => {
    console.log(values);
    props.onFilter(values);
  };

  return (
    <Modal
      visible={props.visible}
      title={t("filter")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          {t("close")}
        </Button>,
        <Button
          onClick={handleClear}
        >
          {t("clear")}
        </Button>,
        <Button
          htmlType="submit"
          form="filterForm"
          type="primary"
          onClick={handleFilter}
        >
          {t("filter")}
        </Button>,
      ]}
    >
      <Form
        {...formItemLayout}
        id='form'
        form={filterForm}
        onFinish={onFinish}
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
            style={{ width: 310 }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(FilterModal);