import React from "react";
import { Form, InputNumber } from "antd";
// import { useTranslation } from "react-i18next";

const EditableCell = ({ editing, dataIndex, children, save, staffTableForm, fot, ...restProps }) => {
  // const { t } = useTranslation();

  const allowanceBlurHandler = () => {
    const formValues = staffTableForm.getFieldsValue();
    const fot = restProps.record.FOT +
      (+formValues.AllowanceType01) +
      (+formValues.AllowanceType02) +
      (+formValues.AllowanceType03)
    staffTableForm.setFieldsValue({ FOT: fot });
  }

  let inputNode = (
    <InputNumber
      style={{ width: '100%' }}
      onBlur={allowanceBlurHandler}
    />
  );

  if (dataIndex === 'FOT') {
    inputNode = (
      <InputNumber
        style={{ width: '100%' }}
        disabled
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        parser={value => value.replace(/\$\s?|( *)/g, '')}
      />
    )
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className='input-number-wrapper'
          name={dataIndex}
          style={{
            margin: 0
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default React.memo(EditableCell);
