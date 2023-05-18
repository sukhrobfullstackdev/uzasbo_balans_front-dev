import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';
// import HelperServices from "../../../../../../services/Helper/helper.services";

// import { Notification } from '../../../../../helpers/notifications';
//import classes from '../../Employee.module.css';

const { Option } = Select;

const EditSignModal = (props) => {


    //FunctionalItemCode
    //ChapterCode

  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      ...props.data,
  
    })
  }, [form, props.data]);


 

  return (
    <Modal
      visible={props.visible}
      title={t("Sign")}
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
          disabled
         
          >
          <Input  disabled placeholder={t('id')}  />
        </Form.Item>
     
          <Form.Item
            label={t('FIO')}
            name="FIO"
            // rules={[
            //   {
            //     required: true,
            //     message: t("Please select"),
            //   },
            // ]}
          >
             <Input placeholder={t('FIO')}  />
          </Form.Item>
          <Form.Item
            label={t('SignNumber')}
            name="SignNumber"
            // rules={[
            //   {
            //     required: true,
            //     message: t('Please select'),
            //   },
            // ]}
          >
           <Input placeholder={t('SignNumber')}  />
          </Form.Item>
     
        <Form.Item
          label={t('PositionNameRus')}
          name='PositionNameRus'
          // rules={[
          //   {
          //     required: true,
          //     message: t("Please input valid"),
          //   },
          // ]}
          >
             <Input placeholder={t('PositionNameRus')}  />
        </Form.Item>
        <Form.Item
          label={t('PositionNameUzb')}
          name='PositionNameUzb'
          // rules={[
          //   {
          //     required: true,
          //     message: t("Please input valid"),
          //   },
          // ]}
          >
             <Input placeholder={t('PositionNameUzb')}  />
        </Form.Item>
        
      </Form>
    </Modal >
  );
};

export default React.memo(EditSignModal);