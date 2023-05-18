import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, } from "@ant-design/icons";
import TableModal from "./TableModal"
import TableModal2 from "./TableModal2"
import PermanentAssetModal from "./PermanentAssetModal"
import { CSSTransition } from 'react-transition-group';
import classes from "../PermanentAssetRetirement.module.css"
import HelperServices from '../../../../../../services/Helper/helper.services';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const StaffTableHeader = (props) => {
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeEnrQualicationModal1, setEmployeeEnrQualicationModal1] = useState(false);
  const [employeeEnrQualicationModal2, setEmployeeEnrQualicationModal2] = useState(false);
  const [subDepartmentList, setSubDepartmentList] = useState([]);
  const [departmentCrModalID, setDepartmentCrModalID] = useState([]);
  const { t } = useTranslation();
  const [addStaffForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [subCountCr1OriginalID, setSubCountCr1OriginalID] = useState(0);
  const [subCountCr2OriginalID, setSubCountCr2OriginalID] = useState(0);
  const [tariffScaleTableName, setTariffScaleTableName] = useState('');
  const [subDepartmentName, setSubDepartmentName] = useState('');
  const [OrganizationId, setOrganizationId] = useState([]);
  const [movementsKindList, setMovementsKindList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [responsiblePersonCrModalID, setResponsiblePersonCrModalID] = useState([]);
  const [modalDate, setModalDate] = useState([]);
  const [modalLink, setModalLink] = useState({});
  const [searchValues, setSearchValues] = useState({});
  const [SubAccID, setSubAccID] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);
  const [names, setNames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setTariffScaleTableName(modalLink.DbSubCountInfo?.SubCount2Name ? modalLink.DbSubCountInfo?.SubCount2Name : " ")
      setSubDepartmentName(modalLink.DbSubCountInfo?.SubCount1Name ? modalLink.DbSubCountInfo?.SubCount1Name : " ")
      setSubDepartmentList(modalLink)
      setOrganizationId(props.doc)
      setShowTariffScale(props.doc) 
      setDepartmentCrModalID(props.departmentCrModalID)
      setModalDate(props.modalDate)
      setResponsiblePersonCrModalID(props.responsiblePersonCrModalID)
   
      addStaffForm.setFieldsValue({
        ...props.data,
        OrganizationID: props.doc,
      })
    }
    fetchData();
  }, [props, modalLink, addStaffForm]);

  const SubCountDbIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccDb: data['children'] }) }))
    searchForm.setFieldsValue({ SubAccDbName: data.children, })
  }
  const SubCountCrIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccCr: data['children'] }) }))
    searchForm.setFieldsValue({ SubAccCrName: data.children, })
  }

  const addStaffHandler = () => {
    searchForm.validateFields()
      .then(values => {
        values.ID = values.ID = Math.floor(Math.random() * 100000001);
        values.Status = 1;
        values.OwnerID = OrganizationId;
        values.SubCountDb1OriginalID = subCountCr1OriginalID ? subCountCr1OriginalID : 0;
        values.SubAccDbCode = names.SubAccDb ? names.SubAccDb : " ";
        values.SubAccCrCode = names.SubAccCr ? names.SubAccCr : " ";
        //values.Organization = names.LimitOperType ? names.LimitOperType : " ";
        values.Sum = values.Sum ? values.Sum : 0;
        values.Quantity = values.Quantity ? values.Quantity : 0;
        props.addData(values);
      })
  }


  const organizationHandler = (divisionId, data) => {
     setNames((prevState => { return ({ ...prevState, LimitOperType: data['children'] }) }))
    searchForm.setFieldsValue({ AllowedTransactionName: data.children, SubAccDbID: null, SubAccCrID: null })

    HelperServices.getInpaymentSubAccCRList(divisionId)
      .then(res => {
        setMovementsKindList(res.data);
        setSubAccID(res.data[0].ID)
      })
      .catch(err => Notification('error', err));
      HelperServices.getTransactionSubCountInfo(divisionId)
      .then(res => {        
        setModalLink(res.data);
      })
      .catch(err => Notification('error', err));

    HelperServices.getTMZSubAccDBList(divisionId)
      .then(res => {
        setDocumentList(res.data);
      })
      .catch(err => Notification('error', err));
  }

  const getHeaderStaffListOrganizationName = (value) => {
    console.log(searchValues);
    value.map(v => {
      v.AllowedTransactionID = searchValues.AllowedTransactionID
      v.AllowedTransactionName = searchValues.AllowedTransactionName
      v.SubAccDbID = searchValues.SubAccDbID
      v.SubAccCrID = searchValues.SubAccCrID
      v.SubAccCrCode = searchValues.SubAccCrName
      v.SubAccDbCode = searchValues.SubAccDbName
      v.ID = v.ID = Math.floor(Math.random() * 100000001);
      v.Status = 1;
      v.OwnerID = OrganizationId;
      v.SubCountDb1OriginalID=308
      return v
    })
    props.addTableDataHandlerFromSearchedData(value)
    // setSubCountCr1OriginalID(value.PermanentAssetID);
    // addStaffForm.setFieldsValue({ SubCountDb1Name: value });
  };

  const getHeaderStaffListOrganizationName3 = (value) => {
    setSubCountCr1OriginalID(value.id);
    searchForm.setFieldsValue({ SubCountDb1Name: value.name });
  };

  const getHeaderStaffListOrganizationName2 = (value) => {
    setSubCountCr2OriginalID(value.id);
    searchForm.setFieldsValue({ SubCountDb2Name: value.name });
  };

  return (
    <tr>
      <Form
        {...layout}
        form={searchForm}
        component={false}
        initialValues={{
          Salary: 0,
          CorrCoefficient: 1,
          OrderNumber: 1,
        }}
      >
        <th className='ant-table-cell'>
          <Form.Item
            label={t('ID')}
            name='ID'
          >
          </Form.Item>
        </th>
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
              //allowClear
              showSearch
              placeholder={t("LimitOperType")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={organizationHandler}
            >
              {props.accDbList.map(item => <Option key={item.ID} value={item.ID} data-name={props.accDbList.Name}
              >{item.Name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            hidden
            label={t('LimitOperType')}
            name='AllowedTransactionID'
          >
            <Input />
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
              showSearch
              placeholder={t("SubAccDb")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={SubCountDbIDHandler}
            >
              {documentList.map(item => <Option key={item.ID} value={item.ID} data-name={documentList.Name}

              >{item.Code}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            hidden
            label={t('SubAccDbID')}
            name='SubAccDbName'
          >
            <Input />
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
              //allowClear
              showSearch
              placeholder={t("SubAccCr")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={SubCountCrIDHandler}
            >
              {movementsKindList.map(item => <Option key={item.ID} value={item.ID} data-name={movementsKindList.Name}>{item.Code}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            hidden
            label={t('SubAccCrID')}
            name='SubAccCrName'
          >
            <Input />
          </Form.Item>
        </th>
        <th   >
          {showTariffScale === false ? null : (
            <div className={classes.EmployeeEnrolmentModal}>
              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeEnrQualicationModal1}
                timeout={300}
              >
                <TableModal
                  visible={employeeEnrQualicationModal1}
                  onCancel={() => setEmployeeEnrQualicationModal1(false)}
                  getHeaderStaffListOrganizationName3={getHeaderStaffListOrganizationName3}
                  subDepartmentList={subDepartmentList}

                />
              </CSSTransition>


              <Form.Item

                label={t(subDepartmentName)}
                name="SubCountDb1Name"
                //label="CentralOrganizationName"
                width="100%"
                rules={[
                  {
                    required: modalLink?.DbSubCountInfo?.SubCount1Name !== "" ? true : false,
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
                  setEmployeeEnrQualicationModal1(true);
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
                name="SubCountDb2Name"
                //label="CentralOrganization"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: modalLink?.DbSubCountInfo?.SubCount2Name !== "" ? true : false,
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
        <th>

          <div className={classes.EmployeeEnrolmentModal}>
            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={employeeEnrQualicationModal}
              timeout={300}
            >
              <PermanentAssetModal
                visible={employeeEnrQualicationModal}
                onCancel={() => setEmployeeEnrQualicationModal(false)}
                onSelect={getHeaderStaffListOrganizationName}
                departmentCrModalID={departmentCrModalID}
                responsiblePersonCrModalID={responsiblePersonCrModalID}
                modalDate={modalDate}
                SubAccID={SubAccID}

              />
            </CSSTransition>


            <Form.Item
              label={t("PermanentAssetName")}
              name="PermanentAssetName"
              //label="CentralOrganizationName"
              width="100%"
              rules={[
                {
                  //required: modalLink?.DbSubCountInfo?.SubCount1Name !== "" ? true : false,
                  message: t("Please input valid"),
                },
              ]}>
              <Input disabled
                style={{ color: 'black' }} />
            </Form.Item>
            <Button
              //disabled={modalLink.DbSubCountInfo?.SubCount1Name === ""}
              type="primary"
              onClick={() => {
                searchForm.validateFields().then(values => {
                  setSearchValues(values)
                  setEmployeeEnrQualicationModal(true);
                })
              }}
              shape="circle"
              style={{ marginTop: 38 }}
              icon={<SearchOutlined />}
            // size={size}
            />
          </div>
        </th>
      </Form >
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
        <th className='ant-table-cell'>
          <Form.Item
            label={t('InventoryNumber')}
            name='InventoryNumber'
            width="100%"
          // rules={[
          //   {
          //     required: true,
          //     message: t("inputValidData"),
          //   },
          // ]}
          >
            <Input
              disabled
              width="100%"
              placeholder={t('InventoryNumber')}
            //onBlur={corrCoefficientBlurHandler}
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('Quantity')}
            name='Quantity'
            width="100%"
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input
            
            disabled
              width="100%"
              placeholder={t('Quantity')}
            //onBlur={corrCoefficientBlurHandler}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('Sum')}
            name='Sum'
            width="100%"
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input            
              disabled
              width="100%"
              placeholder={t('Sum')}
            //onBlur={corrCoefficientBlurHandler}
            />
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          {/* <Button
            type='primary'
            shape="circle"
            icon={<i className="fa fa-plus" aria-hidden="true" />}
            htmlType='submit'
            onClick={addStaffHandler}
          /> */}
        </th>
      </Form >
    </tr>
  );
};

export default React.memo(StaffTableHeader);
