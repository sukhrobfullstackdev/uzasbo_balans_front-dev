import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import InventoryHoldingServices from '../../../../../services/References/Organizational/InventoryHolding/InventoryHolding.services';

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdateInventoryHolding = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loader, setLoader] = useState(true);
  const [unitsOfMeasureList, setUnitsOfMeasureList] = useState([]);
  const [inventoryHoldingTypeList, setInventoryHoldingTypeList] = useState([]);
  const [itemOfExpenseList, setItemOfExpenseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [InventoryHolding, unitsOfMeasureList, inventoryHoldingTypeList, itemOfExpenseList] = await Promise.all([
        InventoryHoldingServices.getById(docId),
        HelperServices.getUnitsOfMeasureList(),
        HelperServices.getInventoryHoldingTypeList(),
        HelperServices.getItemOfExpenseList(),
      ]);

      setUnitsOfMeasureList(unitsOfMeasureList.data);
      setInventoryHoldingTypeList(inventoryHoldingTypeList.data)
      setItemOfExpenseList(itemOfExpenseList.data)

      mainForm.setFieldsValue({
        ...InventoryHolding.data,
        UnitsOfMeasureID: InventoryHolding.data.UnitsOfMeasureID !== 0 ? InventoryHolding.data.UnitsOfMeasureID : null,
        IHTypeID: InventoryHolding.data.IHTypeID !== 0 ? InventoryHolding.data.IHTypeID : null,
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoader(false));
  }, [docId, mainForm]);


  const onMainFormFinish = (values) => {
    setLoader(true);
    values.ID = docId;
    InventoryHoldingServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/InventoryHolding`);
          Notification('success', t('success-msg'));
        }
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false))
  };

  return (
    <Card title={t("InventoryHolding")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={13} md={12}>
              <Form.Item
                label={t("Name")}
                name="Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input placeholder={t("Name")} />
              </Form.Item>
            </Col>
            <Col xl={4} lg={12}>
              <Form.Item
                label={t("InventoryNumber")}
                name="InventoryNumber"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input placeholder={t("InventoryNumber")} />
              </Form.Item>
            </Col>
            <Col xl={7} lg={12}>
              <Form.Item
                label={t("UnitsOfMeasure")}
                name="UnitsOfMeasureID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {unitsOfMeasureList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={7} lg={12}>
              <Form.Item
                label={t("IHType")}
                name="IHTypeID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {inventoryHoldingTypeList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.DisplayName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={10} lg={12}>
              <Form.Item
                label={t("ItemOfExpense")}
                name="ItemOfExpenseID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {itemOfExpenseList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space size='middle' className='btns-wrapper'>
          <Button
            type="danger"
            onClick={() => {
              history.goBack();
              Notification("warning", t("not-saved"));
            }}
          >
            {t("back")}
          </Button>
          <Button
            htmlType="submit"
            form="mainForm"
            type="primary"
          >
            {t("save")}
          </Button>
        </Space>
      </Spin>
    </Card>
  )
}

export default UpdateInventoryHolding;