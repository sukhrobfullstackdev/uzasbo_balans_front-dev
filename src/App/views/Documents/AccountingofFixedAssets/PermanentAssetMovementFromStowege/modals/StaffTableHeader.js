import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, } from "@ant-design/icons";
import TableModal from "./TableModal"
import { CSSTransition } from 'react-transition-group';
import classes from "../PermanentAssetMovementFromStowege.module.css"
import HelperServices from '../../../../../../services/Helper/helper.services';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const StaffTableHeader = (props) => {
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [subDepartmentList, setSubDepartmentList] = useState([]);
  const { t } = useTranslation();
  const [addStaffForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [subCountCr1OriginalID, setSubCountCr1OriginalID] = useState(0);
  const [OrganizationId, setOrganizationId] = useState([]);
  const [movementsKindList, setMovementsKindList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [responsiblePersonCrModalID, setResponsiblePersonCrModalID] = useState([]);
  const [modalDate, setModalDate] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [SubAccID, setSubAccID] = useState([]);
  const [names, setNames] = useState([]);
  useEffect(() => {
    async function fetchData() {
      setResponsiblePersonCrModalID(props.responsiblePersonCrModalID)
      setSubDepartmentList(props.departmentCrModalID)
      setModalDate(props.modalDate)
      setOrganizationId(props.doc)
      // console.log(props.data);
      // addStaffForm.setFieldsValue({
      //   ...props.data,
      //   OrganizationID: props.doc,
      // })
    }
    fetchData();
  }, [props, addStaffForm]);

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
        console.log(values);
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
      return v
    })
    console.log(value);
    props.addTableDataHandlerFromSearchedData(value)
    // setSubCountCr1OriginalID(value.PermanentAssetID);
    // addStaffForm.setFieldsValue({ SubCountDb1Name: value });
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
        {/* <th className='ant-table-cell'>
          <Form.Item
            label={t('ID')}
            name='ID'


          >
          </Form.Item>
        </th> */}
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
              allowClear
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
        <th>

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
                onSelect={getHeaderStaffListOrganizationName}
                subDepartmentList={subDepartmentList}
                responsiblePersonCrModalID={responsiblePersonCrModalID}
                modalDate={modalDate}
                SubAccID={SubAccID}

              />
            </CSSTransition>


            <Form.Item
              label={t("SubCountDb1Name")}
              name="SubCountDb1Name"
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
                  console.log(values);
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
            label={t('PermanentAssetName')}
            name='PermanentAssetName'
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
              placeholder={t('PermanentAssetName')}
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
          <Button
            type='primary'
            shape="circle"
            icon={<i className="fa fa-plus" aria-hidden="true" />}
            htmlType='submit'
            onClick={addStaffHandler}
          />
        </th>
      </Form >
    </tr>
  );
};

export default React.memo(StaffTableHeader);
