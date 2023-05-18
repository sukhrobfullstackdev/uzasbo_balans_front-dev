import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, } from "@ant-design/icons";
import TableModal from "./TableModal"
import TableModal2 from "./TableModal2"
import { CSSTransition } from 'react-transition-group';
import classes from "../CurrencyIncomeCashOrder.module.css"

const layout = {
  labelCol: {
    span: 24,
  }
};

const StaffTableHeader = (props) => {
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeEnrQualicationModal2, setEmployeeEnrQualicationModal2] = useState(false);
  const [subDepartmentList, setSubDepartmentList] = useState([]);
  const [tariffScaleTableName, setTariffScaleTableName] = useState('');
  const [subDepartmentName, setSubDepartmentName] = useState('');
  const { t } = useTranslation();
  const [addStaffForm] = Form.useForm();
  const [disabledActions, setDisabledActions] = useState(false);
  const [disabledActions2, setDisabledActions2] = useState(false);
  const [subCountCr1OriginalID, setSubCountCr1OriginalID] = useState(0);
  const [subCountCr2OriginalID, setSubCountCr2OriginalID] = useState(0);
  const [OrganizationId, setOrganizationId] = useState([]);
  const [coursesum, setCoursesum] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);


  useEffect(() => {
    async function fetchData() {
      setCoursesum(props.CurrencySum)
      setTariffScaleTableName(props.modalLink?.CrSubCountInfo?.SubCount2Name ? props.modalLink?.CrSubCountInfo?.SubCount2Name : " ")
      setSubDepartmentName(props.modalLink?.CrSubCountInfo?.SubCount1Name ? props.modalLink?.CrSubCountInfo?.SubCount1Name : " ")
      setSubDepartmentList(props.modalLink)
      setOrganizationId(props.doc)
      setShowTariffScale(props.doc)
      if (props.modalLink?.CrSubCountInfo?.SubCount1Name === "") {
        setDisabledActions(true)
      }
      if (props.modalLink?.CrSubCountInfo?.SubCount2Name === "") {
        setDisabledActions2(true)
      }

      addStaffForm.setFieldsValue({
        ...props.data,
        OrganizationID: props.doc,
      })
    }
    fetchData();
  }, []);

  const addStaffHandler = () => {
    addStaffForm.validateFields()
      .then(values => {
        values.ID = values.ID = Math.floor(Math.random() * 100000001);
        values.Status = 1;
        values.OwnerID = OrganizationId;
        values.SubCountCr1OriginalID = subCountCr1OriginalID;
        values.SubCountCr2OriginalID = subCountCr2OriginalID;
        values.Sum = values.Sum ? values.Sum : 0;
        props.addData(values);
      })
  }

  const setPlanTeachingLoad = (e) => {
    let sum = +coursesum * +e.target.value;
    addStaffForm.setFieldsValue({
      Sum: sum
    })
  }
  const getHeaderStaffListOrganizationName = (value) => {
    setSubCountCr1OriginalID(value.id)
    addStaffForm.setFieldsValue({ SubCountCr1Name: value.name });
  };
  const getHeaderStaffListOrganizationName2 = (value) => {
    setSubCountCr2OriginalID(value.id)
    addStaffForm.setFieldsValue({ SubCountCr2Name: value.name });
  };

  return (
    <Form
      {...layout}
      form={addStaffForm}

      component={false}
      initialValues={{
        Salary: 0,
        CorrCoefficient: 1,
        OrderNumber: 1,
      }}
    >

      {showTariffScale === false ? null : (
        <tr>
          <th   >
            <div className={classes.EmployeeEnrolmentModal}>
              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeEnrQualicationModal}
                timeout={300}
              >
                <TableModal
                  visible={employeeEnrQualicationModal}
                  onCancel={() => setEmployeeEnrQualicationModal(false)}
                  getHeaderStaffListOrganizationName={getHeaderStaffListOrganizationName}
                  subDepartmentList={subDepartmentList}

                />
              </CSSTransition>
              <Form.Item

                label={t(subDepartmentName)}
                name="SubCountCr1Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: props.modalLink?.CrSubCountInfo?.SubCount1Name !== "" ? true : false,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input disabled
                  style={{ color: 'black' }} />
              </Form.Item>
              <Button
                disabled={disabledActions}
                type="primary"
                onClick={() => {
                  setEmployeeEnrQualicationModal(true);
                }}
                shape="circle"
                style={{ marginTop: 38 }}
                icon={<SearchOutlined />}
              />
            </div>

          </th>
          <th   >

            <div className={classes.EmployeeEnrolmentModal}>
              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeEnrQualicationModal2}
                timeout={300}
              >
                <TableModal2
                  visible={employeeEnrQualicationModal2}
                  onCancel={() => setEmployeeEnrQualicationModal2(false)}
                  getHeaderStaffListOrganizationName2={getHeaderStaffListOrganizationName2}
                  subDepartmentList={subDepartmentList}
                />
              </CSSTransition>
              <Form.Item
                label={t(tariffScaleTableName)}
                name="SubCountCr2Name"
                //label="CentralOrganization"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: props.modalLink?.CrSubCountInfo?.SubCount2Name !== "" ? true : false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input disabled
                  style={{ color: 'black' }} />
              </Form.Item>
              <Button
                disabled={disabledActions2}
                type="primary"
                onClick={() => {
                  setEmployeeEnrQualicationModal2(true);
                }}
                shape="circle"
                style={{ marginTop: 38 }}
                icon={<SearchOutlined />}
              // size={size}
              />

            </div>

          </th>
          <th className='ant-table-cell'>
            <Form.Item
              label={t('Sum')}
              name='Sum'
              width="100%"
            // rules={[
            //   {
            //    // required: !tariffInputsDisable,
            //    // message: t("inputValidData"),
            //   },
            // ]}
            >
              <InputNumber
                disabled
                placeholder={t("Sum")}
                className="sum-input"
                style={{ color: 'black', width: '100%', textAlign: "right" }}
                decimalSeparator=','
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              />
            </Form.Item>
          </th>
          <th className='ant-table-cell'>
            <Form.Item
              label={t('CurrencySum')}
              name='CurrencySum'
              width="100%"
              rules={[
                {
                  required: true,
                  message: t("inputValidData"),
                },
              ]}
            >
              <Input
              placeholder={t('CurrencySum')} 
               onChange={setPlanTeachingLoad} 
              //onBlur={corrCoefficientBlurHandler}
            />
            </Form.Item>
          </th>

          <th className='ant-table-cell'>
            <Button
              type='primary'
              shape="circle"
              icon={<i className="fa fa-plus" aria-hidden="true" />}
              htmlType='submit'
              onClick={addStaffHandler}
            />
          </th>
        </tr >
      )}
    </Form >
  );
};

export default React.memo(StaffTableHeader);
