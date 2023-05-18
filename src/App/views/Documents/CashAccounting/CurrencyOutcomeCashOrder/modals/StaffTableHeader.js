import React, { useState,  useEffect } from "react";
import { Form, Select, Input, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined,  } from "@ant-design/icons";
import TableModal from "./TableModal"
import TableModal2 from "./TableModal2"
import { CSSTransition } from 'react-transition-group';
import classes from "../CurrencyOutcomeCashOrder.module.css"
import HelperServices from '../../../../../../services/Helper/helper.services';

const { Option } = Select;
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
  const [subCountDb1OriginalID, setSubCountDb1OriginalID] = useState(0);
  const [subCountDb2OriginalID, setSubCountDb2OriginalID] = useState(0);
  const [OrganizationId, setOrganizationId] = useState([]);
  const [movementsKindList, setMovementsKindList] = useState([]);
  const [modalLink, setModalLink] = useState({});
  const [showTariffScale, setShowTariffScale] = useState(false); 
  const [documentList, setDocumentList] = useState([]);
  const [names, setNames] = useState([]);
  const [coursesum, setCoursesum] = useState([]);

  useEffect(() => {
    async function fetchData() { 
    setCoursesum(props.CurrencySum)
    setTariffScaleTableName(modalLink.DbSubCountInfo?.SubCount2Name ? modalLink.DbSubCountInfo?.SubCount2Name : " ")
    setSubDepartmentName(modalLink.DbSubCountInfo?.SubCount1Name ? modalLink.DbSubCountInfo?.SubCount1Name : " ")
    setSubDepartmentList(modalLink)
    setOrganizationId(props.doc)
    setShowTariffScale(props.doc)

    addStaffForm.setFieldsValue({
      ...props.data, 
      OrganizationID: props.doc,
    })
    }
    fetchData();
  }, [modalLink, props, addStaffForm]);

  const SubCountDbIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccDb: data['children'] }) }))
  }
  const SubCountCrIDHandler = (ID, data) => {
    console.log(data);
    setNames((prevState => { return ({ ...prevState, SubAccCr: data['children'] }) }))
  }

  const addStaffHandler = () => {
    addStaffForm.validateFields()
      .then(values => {
        //values.key = Math.random().toString();
        values.ID =    values.ID = Math.floor(Math.random() * 100000001);
        values.Status = 1;
        values.OwnerID = OrganizationId;
        values.SubCountDb1OriginalID = subCountDb1OriginalID;
        values.SubCountDb2OriginalID = subCountDb2OriginalID;
        values.SubAccDb = names.SubAccDb ? names.SubAccDb : " ";
        values.SubAccCr = names.SubAccCr ? names.SubAccCr : " ";
        props.addData(values);
        console.log(values);
      })
  }


  const setPlanTeachingLoad = (e) => {
    let sum = +coursesum * +e.target.value;
    addStaffForm.setFieldsValue({
      Sum: sum
    })
  }


  const organizationHandler = divisionId => {

     
    HelperServices.getInpaymentSubAccCRList(divisionId)
        .then(res => {

            setMovementsKindList(res.data);
        })
        .catch(err => Notification('error', err));
    HelperServices.getTransactionSubCountInfo(divisionId)
        .then(res => {
          console.log(res.data);
            setModalLink(res.data);
        })
        .catch(err => Notification('error', err));
        HelperServices.getTMZSubAccDBList(divisionId)
        .then(res => {
          console.log(res.data);
          setDocumentList(res.data);
        })
        .catch(err => Notification('error', err));
}



  const getHeaderStaffListOrganizationName = (value) => {
    setSubCountDb1OriginalID(value.id)
    addStaffForm.setFieldsValue({ SubCountDb1Name: value.name });
};
  const getHeaderStaffListOrganizationName2 = (value) => {
    setSubCountDb2OriginalID(value.id)
   
   addStaffForm.setFieldsValue({ SubCountDb2Name: value.name });
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
      <tr>
      <th className='ant-table-cell'>
        <Form.Item
          label={t('LimitOperType')}
          name='AllowedTransactionID'
          rules={[
            {
              required: true,
              message: t("pleaseSelect"),
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder={t("LimitOperType")}
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={organizationHandler}
          >
            {props.accDbList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
          </Select>
        </Form.Item>
        </th>
        <th className='ant-table-cell'>
        <Form.Item
          label={t('SubAccDb')}
          name='SubAccDbID'
          rules={[
            {
              required: true,
              message: t("pleaseSelect"),
            },
          ]}
          
        >
          <Select
            allowClear
            showSearch
            placeholder={t("SubAccDb")}
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={SubCountDbIDHandler}
          >
            {documentList.map(item => <Option key={item.ID} value={item.ID}  data-name={documentList.Code}>{item.Code}</Option>)}
          </Select>
        </Form.Item>
        </th>
        <th className='ant-table-cell'>
        <Form.Item
          label={t('SubAccCr')}
          name='SubAccCrID'
          rules={[
            {
              required: true,
              message: t("pleaseSelect"),
            },
          ]}
         
        >
          <Select
            allowClear
            showSearch
            placeholder={t("SubAccDb")}
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={SubCountCrIDHandler}
          >
            {movementsKindList.map(item => <Option key={item.ID} value={item.ID}  data-name={movementsKindList.Code}>{item.Code}</Option>)}
          </Select>
        </Form.Item>
        </th>
        <th   >
        {showTariffScale === false ? null :(
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

                    label = {t(subDepartmentName)}
                    name="SubCountCr1Name"
                    //label="CentralOrganizationName"
                    width="100%"
                    rules={[
                        {
                            // required: true,
                            message: t("Please input valid"),
                        },
                    ]}>
                    <Input disabled
                        style={{ color: 'black' }} />
                </Form.Item>
                <Button
              disabled={modalLink.DbSubCountInfo?.SubCount1Name === ""}
                    type="primary"
                    onClick={() => {
                        setEmployeeEnrQualicationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                   // size={size}
                />
            </div>
        )}
        </th>
        <th   >
        {showTariffScale === false ? null : (
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
                            // required: true,
                            message: t("Please input valid"),
                        },
                    ]}>
                    <Input disabled
                        style={{ color: 'black' }} />
                </Form.Item>
                <Button
                disabled={modalLink.DbSubCountInfo?.SubCount2Name === ""}
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
        )}
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
            <Input
            disabled
              placeholder={t('Sum')}
              //onBlur={corrCoefficientBlurHandler}
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
    </Form >
  );
};

export default React.memo(StaffTableHeader);
