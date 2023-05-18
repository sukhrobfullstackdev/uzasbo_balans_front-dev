import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, DatePicker, Space, Spin, Table, InputNumber, Tabs, Tooltip, Popconfirm, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import MainCard from "../../../../components/MainCard";
import PermanentAssetRetirementServices from "../../../../../services/Documents/AccountingofFixedAssets/PermanentAssetRetirement/PermanentAssetRetirement.services";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import DepartmentDbModal from './modals/DepartmentDbModal';
import ResponsiblePersonDbModal from './modals/ResponsiblePersonDbModal'
import StaffTableHeader from './modals/StaffTableHeader'

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    values,
    map,
    Sum,
    Quantity,
    index,
    settlementAccountList,
    children,
    onEnter,
    onPressEnter,
    inputRef,
    form,
    ...restProps
}) => {
    // console.log(dataIndex);
    // const inputRef = useRef(null);

    let inputNode;
    if (dataIndex === 'Sum') {
        inputNode = <InputNumber

            onPressEnter={onPressEnter}
            onBlur={onEnter}

            style={{ width: '100%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
        // ref={(Input) => {Input && Input.focus() }}
        />;
    } else if (dataIndex === 'Quantity') {
        inputNode = <InputNumber

            onPressEnter={onPressEnter}
            onBlur={onEnter}

            style={{ width: '100%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
        // ref={(Input) => {Input && Input.focus() }}
        />;
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                //  rules={[
                //    {
                //      required: true,
                //     message: `Please Input ${title}!`,
                //    },
                //  ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TabPane } = Tabs;
const { Option } = Select;
let tableRowChanged = false;

const UpdatePermanentAssetRetirement = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();
    const [TableForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [allowTrans, setAllowedTrans] = useState([]);
    const [docId] = useState(props.match.params.id ? props.match.params.id : 0);
    const [PAQuitTypeList, setPAQuitTypeList] = useState([]);
    const [accDbList, setAccDBList] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const [disabledActions, setDisabledActions] = useState(false);
    const [disabledBn, setDisabledBtn] = useState(false);
    const [settlementAddTableModalData, setAddSettlementTableModalData] = useState([]);
    // const [CurrencySum, setCurrencySum] = useState();
    //Modals
    const [departmentDbModal, setDepartmentDbModal] = useState(false);
    const [departmentsListParams, setDepartmentsListParams] = useState([]);

    const [responsiblePersonDbModal, setResponsiblePersonDbModal] = useState(false);
    const [responsiblePersonDbParams, setResponsiblePersonDbParams] = useState([]);

    const [responsiblePersonCrModalID, setResponsiblePersonCrModalID] = useState([]);
    const [departmentCrModalID, setDepartmentCrModalID] = useState([]);
    const [modalDate, setModalDate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [allowedTrans, PAQuitTypeList, accDbList] = await Promise.all([
                PermanentAssetRetirementServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getPAQuitTypeList(),
                HelperServices.GetAllowedTransactionForOutcomeCashOrderList3(),
                HelperServices.getInpaymentSubAccCRList(),
            ]);

            setPAQuitTypeList(PAQuitTypeList.data);
            setAccDBList(accDbList.data);
            setAllowedTrans(allowedTrans.data);
            setAddSettlementTableModalData(allowedTrans.data.Tables)
            setModalDate(allowedTrans.data.Date)
            setResponsiblePersonCrModalID(allowedTrans.data.ResponsiblePersonCrID)
            setDepartmentCrModalID(allowedTrans.data.DepartmentCrID)
            if(allowedTrans.data.Tables.length > 0){
                setDisabledBtn(true)
            }
            
            if (allowedTrans.data.StatusID === 2) {
                setDisabledActions(true);
            }

            mainForm.setFieldsValue({
                ...allowedTrans.data,
                Date: moment(allowedTrans.data.Date, 'DD.MM.YYYY'),
                
                PAQuitTypeID: allowedTrans.data.PAQuitTypeID === 0 ? null : allowedTrans.data.PAQuitTypeID,
            });
            setLoader(false);
        };
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });

    }, [props.match.params.id, mainForm]);


    const onMainFormFinish = (values) => {
        setLoader(true);
        PermanentAssetRetirementServices.update({
            ...allowTrans, ...values,
            Tables: settlementAddTableModalData

        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/PermanentAssetRetirement`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };


    // const setNewModalDate = (e)=>{
    //     let newModalDate = mainForm.getFieldValue('Date');
    //     setModalDate(newModalDate);
    // }

    // MOdals modal
    ///Db modal
    const openDepartmentsListModal = (params) => {
        setDepartmentsListParams(params);
        setDepartmentDbModal(true);
    };

    const onSelect = (data) => {
        setDepartmentCrModalID(data.ID)
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };

    ///Cr modal


    ///ResponsiblePersonDbModal modal
    const openResponsiblePersonDbModal = (params) => {
        setResponsiblePersonDbParams(params);
        setResponsiblePersonDbModal(true);
    };


    const onSelectsetResponsiblePersonDbModal = (data) => {
        setResponsiblePersonCrModalID(data.ID)
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };


    //End Modal

    const addTableDataHandler = (data) => {
        setAddSettlementTableModalData([...settlementAddTableModalData, data]);
        let Sum = mainForm.getFieldValue('Sum');
        mainForm.setFieldsValue({
            Sum: Sum + +data.Sum
        })
    };

    const addTableDataHandlerFromSearchedData = (data) => {
        console.log(data, data.Sum);
        setAddSettlementTableModalData([...settlementAddTableModalData, ...data]);
        let sum = mainForm.getFieldValue('Sum');
        data.map(d => {
            console.log(d);
            sum = sum + d.Sum
            return null;
        })
        mainForm.setFieldsValue({
            'Sum': sum
        })
    }

    const isEditing = (values) => values.ID === editingKey;
    const edit = (values) => {
        TableForm.setFieldsValue({
            ...values,
        });
        setEditingKey(values.ID);
    };

    const onTableValuesChange = () => {
        tableRowChanged = true;
    }

    const save = async (key) => {
        try {
            const row = await TableForm.validateFields();
            const newData = [...settlementAddTableModalData];
            const index = newData.findIndex((item) => key === item.ID);
            if (index > -1) {
                const item = newData[index];
                if (item.Status === 0) {
                    item.Status = 2;
                } else if (item.Status !== 0) {
                    item.Status = 1;
                }
                newData.splice(index, 1, { ...item, ...row });
                if (tableRowChanged) {
                    tableRowChanged = false;
                }
                setAddSettlementTableModalData(newData);
                let Sum = 0;
                newData.forEach(item => {
                    Sum += +item.Sum
                    mainForm.setFieldsValue({
                        Sum: Sum
                    })
                })

                setEditingKey("");
            } else {
                newData.push(row);
                setAddSettlementTableModalData(newData);
                setEditingKey("");
                // setTableLoading(false);
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
            tableRowChanged = false;
            // setTableLoading(false);
        }
    };

    const TablesDeleteHandler = (row) => {
        const obj = { ...row }
        obj.Status = 3;
        const newData = [...settlementAddTableModalData];
        let Sum = mainForm.getFieldValue('Sum');
        mainForm.setFieldsValue({
            Sum: Sum - +obj.Sum
        });

        const index = newData.findIndex((item) => row.key === item.key);
        newData.splice(index, 1, obj);
        setAddSettlementTableModalData(newData);

    }



    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 50,
        },
        {
            title: t("Organization"),
            dataIndex: "AllowedTransactionID",
            width: 305,
            render: (value) => {
                <div className="ellipsis-2">{value}</div>
                const position = accDbList.find(item => item.ID === value);
                return position ? position.Name : '';
            }
        },
        {
            title: t("SubAccCrCode"),
            dataIndex: "SubAccCrCode",
            width: 110,

            // render: (value) => {


            //     const position1 = documentList.find(item => item.ID === value);
            //     console.log(position1);
            //     return position1 ? position1.ID : '';
            // }
        },
        {
            title: t("SubAccDbCode"),
            dataIndex: "SubAccDbCode",
            width: 110,
            // render: (value) => {
            //     const position2 = movementsKindList.find(item => item.ID === value);
            //     console.log(position2)
            //     return position2 ? position2.Name : '';
            // }
        },
        {
            title: t("SubCountDb1Name"),
            dataIndex: "SubCountDb1Name",
            key: "SubCountDb1Name",
            sorter: true,
            width: 190,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SubCountDb2Name"),
            dataIndex: "SubCountDb2Name",
            key: "SubCountDb2Name",
            sorter: true,
            width: 190,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("InventoryNumber"),
            dataIndex: "InventoryNumber",
            sorter: true,
            width: 190,
        },
        {
            title: t("PermanentAssetName"),
            dataIndex: "PermanentAssetName",
            key: "PermanentAssetName",
            sorter: true,
            width: 100,
        },
        {
            title: t("Quantity"),
            dataIndex: "Quantity",
            key: "Quantity",
            sorter: true,
            width: 100,
            editable: true,
            align: "right",
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            sorter: true,
            width: 100,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
            align: "right",

        },
        {
            title: t('actions'),
            key: 'action',
            align: 'center',
            width: 100,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t('Edit')}>
                            <span
                                onClick={() => {
                                    edit(record);
                                }}
                            >
                                <i className={`feather icon-edit action-icon`} />
                            </span>
                        </Tooltip>
                        <Tooltip title={t('Delete')}>
                            <Popconfirm
                                title={t('delete')}
                                okText={t('yes')}
                                cancelText={t('cancel')}
                                onConfirm={() => {
                                    TablesDeleteHandler(record);
                                }}
                            >
                                <span>
                                    <i className={`feather icon-trash-2 action-icon `} />
                                </span>
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                )
            },
        },
    ];
    const roleBasedColumns = columns.filter(item => {

        return item.dataIndex !== 'OrganizationsSettlementAccountID';
    });

    const mergedColumns = roleBasedColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (values) => ({
                values,
                inputType: "number",
                dataIndex: col.dataIndex,
                title: col.title,
                Sum: col.Sum,
                Quantity: col.Quantity,
                editing: isEditing(values),
                onEnter: () => save(values.ID),
                onPressEnter: () => save(values.ID),
            })
        };
    });

    return (
        <MainCard title={t("PermanentAssetRetirement")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>


                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("Number")}
                                name="Number"
                                style={{ width: "100%" }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("Date")}
                                name="Date"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    style={{ width: "100%" }}
                                    placeholder={t("Date")}
                                ///onChange={setNewModalDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("Sum")}
                                name="Sum"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
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
                        </Col>

                        <Col xl={6} md={16}>
                            <Form.Item
                                label={t("PAQuitType")}
                                name="PAQuitTypeID"
                                style={{ width: "100%" }}

                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("PAQuitType")}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {PAQuitTypeList.map((document) => (
                                        <Option key={document.ID} value={document.ID}>
                                            {document.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>


                        <Col xl={6} md={8}>
                            <Form.Item
                                label={t("Department")}
                                name="Department"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                disabled
                                    className={'addonInput'}
                                    style={{ color: 'black' }}
                                    addonAfter={
                                        <Button  disabled={disabledBn}
                                        style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openDepartmentsListModal({
                                                Name: 'Department',
                                                ID: 'DepartmentID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                hidden
                                label={t("Department")}
                                name="DepartmentID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xl={6} md={8}>
                            <Form.Item
                                label={t("ResponsiblePerson")}
                                name="ResponsiblePerson"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    className={'addonInput'}
                                    style={{ color: 'black' }}
                                    disabled
                                    addonAfter={
                                        <div
                                            onClick={() => openResponsiblePersonDbModal({
                                                Name: 'ResponsiblePerson',
                                                ID: 'ResponsiblePersonID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                hidden
                                label={t("ResponsiblePerson")}
                                name="ResponsiblePersonID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={12} md={16}>
                            <Form.Item
                                label={t("RetirementDetails")}
                                name="RetirementDetails"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        
                    </Row>
                </Form>
                <Form
                    form={TableForm}
                    component={false}
                    onValuesChange={onTableValuesChange}
                >
                    <Tabs defaultActiveKey="1">

                        <TabPane tab={t('Tables')} key="1" >
                            <Table
                                size='middle'
                                pagination={false}
                                disabled={disabledActions}
                                setDisabledBtn={setDisabledBtn}
                                className="main-table"
                                rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                                columns={mergedColumns}
                                dataSource={settlementAddTableModalData.filter(item => item.Status !== 3)}
                                loading={loader}
                                scroll={{
                                    x: "max-content",
                                    y: '90vh'
                                }}

                                components={{
                                    header: {
                                        row: () => <StaffTableHeader
                                            accDbList={accDbList}
                                            responsiblePersonCrModalID={responsiblePersonCrModalID}
                                            departmentCrModalID={departmentCrModalID}
                                            modalDate={modalDate}
                                            doc={docId}
                                            //CurrencySum={CurrencySum}
                                            // addData={addTableDataHandler}
                                            addTableDataHandlerFromSearchedData={addTableDataHandlerFromSearchedData}
                                        />
                                    },
                                    body: {
                                        cell: EditableCell
                                    }
                                }}
                                onRow={(values) => {
                                    return {
                                        onDoubleClick: () => {
                                            edit(values);
                                        },
                                    };
                                }}
                            />
                        </TabPane>

                    </Tabs>
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
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={departmentDbModal}
                timeout={300}
            >
                <DepartmentDbModal
                    visible={departmentDbModal}
                    params={departmentsListParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setDepartmentDbModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={responsiblePersonDbModal}
                timeout={300}
            >
                <ResponsiblePersonDbModal
                    visible={responsiblePersonDbModal}
                    params={responsiblePersonDbParams}
                    onSelect={onSelectsetResponsiblePersonDbModal}
                    onCancel={() => {
                        setResponsiblePersonDbModal(false);
                    }}
                />
            </CSSTransition>

        </MainCard>
    )
}

export default React.memo(UpdatePermanentAssetRetirement);