import React from "react";
import { InputNumber, Form, Select, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, children, save, movementsKindList, ...restProps }) => {
  const { t } = useTranslation();

  // const saveHandler = () => {
  //   save(restProps.record.key);
  // }

  let inputNode = <InputNumber min={0} />;

  inputNode = <Input
    style={{ width: '100%' }}
    size='small'
  />

  if (dataIndex === 'AllowedTransactionID') {
    inputNode = <Select
      allowClear
      showSearch
      placeholder={t("AllowedTransactionID")}
      style={{ width: 250 }}
      optionFilterProp="children"
      // onBlur={saveHandler}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {movementsKindList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
    </Select>
  } else if (dataIndex === 'MoneyMeansMovementsKindID') {
    inputNode = (
      <Input/>
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
          {/* {selectNode} */}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
