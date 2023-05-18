import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from "moment";

import StudentContractServices from '../../../../../services/Documents/StudentContract/StudentContract.services';
import HelperServices from '../../../../../services/Helper/helper.services';
import Card from "../../../../components/MainCard";
import { CSSTransition } from 'react-transition-group';
import FacultyListModal from './components/FacultyListModal';
import StudyDirectionListModal from './components/StudyDirectionListModal';
import StudyGroupListModal from './components/StudyGroupListModal';
import SettlementAccountsModal from './components/SettlementAccountsModal';
import ListOfPositionListModal from './components/ListOfPositionListModal';
import StudentContractForFillTable from './components/StudentContractForFillTable';
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
const { TabPane } = Tabs;

const UpdateStudentContract = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [studentContract, setStudentContract] = useState([]);
    const [studentContractDbList, setStudentContractDbList] = useState([]);
    const [studentContractCrList, setStudentContractCrList] = useState([]);

    const [facultyListModal, setFacultyListModal] = useState(false);
    const [facultyListParams, setFacultyListParams] = useState([]);
    const [studyDirectionModal, setStudyDirectionModal] = useState(false);
    const [studyDirectionParams, setStudyDirectionParams] = useState([]);
    const [studyGroupModal, setStudyGroupModal] = useState(false);
    const [studyGroupParams, setStudyGroupParams] = useState([]);
    const [listOfPositionModal, setListOfPositionModal] = useState(false);
    const [listOfPositionParams, setListOfPositionParams] = useState([]);
    const [settlementAccountsModal, setSettlementAccountsModal] = useState(false);
    const [settlementAccountsParams, setSettlementAccountsParams] = useState([]);

    const [Tables, setTables] = useState([]);
    const [disabledTables, setDisabledTables] = useState(false);
    const [studentContractForFillButton, setStudentContractForFillButton] = useState(false);
    const [studentContractForFillLoader, setStudentContractForFillLoader] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [studentContract, studentContractDbList, studentContractCrList, workSheduleKindList] = await Promise.all([
                StudentContractServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getStudentContractDbList(),
                HelperServices.getStudentContractCrList(),
            ]);
            // if (props.match.params.id ? props.match.params.id : 0) {
            console.log(studentContract.data);
            setStudentContract(studentContract.data);
            studentContract.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(studentContract.data.Tables);
            if (studentContract.data.Tables.length > 0) {
                setDisabledTables(true);
            };
            setStudentContractDbList(studentContractDbList.data);
            setStudentContractCrList(studentContractCrList.data);

            // }

            mainForm.setFieldsValue({
                ...studentContract.data,
                Date: studentContract.data.Date ? moment(studentContract.data.Date, 'DD.MM.YYYY') : null,
                AcademicYearStart: studentContract.data.AcademicYearStart ? moment(studentContract.data.AcademicYearStart, 'YYYY') : null,
                AcademicYearEnd: studentContract.data.AcademicYearEnd ? moment(studentContract.data.AcademicYearEnd, 'YYYY') : null,
            });
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const onMainFormFinish = (values) => {
        values.AcademicYearStart = values.AcademicYearStart?.format("YYYY");
        values.AcademicYearEnd = values.AcademicYearEnd?.format("YYYY");
        values.Date = values.Date?.format("DD.MM.YYYY");
        console.log({
            ...studentContract, ...values,
            Tables: Tables,
        });
        setLoader(true);
        StudentContractServices.update({
            ...studentContract, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/StudentContract`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const openFacultyListModal = (params) => {
        setFacultyListParams(params);
        setFacultyListModal(true);
    };

    const openStudyDirectionListModal = (params) => {
        setStudyDirectionParams(params);
        setStudyDirectionModal(true);
    };

    const openStudyGroupListModal = (params) => {
        setStudyGroupParams(params);
        setStudyGroupModal(true);
    };

    const openListOfPositionListModal = (params) => {
        setListOfPositionParams(params);
        setListOfPositionModal(true);
    };

    const openSettlementAccountsListModal = (params) => {
        setSettlementAccountsParams(params);
        setSettlementAccountsModal(true);
    };

    const onSelect = (data) => {
        console.log(data);
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };

    const fillStudentContractForFillTable = () => {
        setStudentContractForFillLoader(true);
        StudentContractServices.GetStudentContractForFill()
            .then((res) => {
                res.data.map((data) => {
                    data.key = Math.random();
                    return data;
                })
                // console.log({ ...subCalculationKind, Tables: res.data });
                // setSubCalculationKind({ ...subCalculationKind, Tables: res.data });
                setTables(res.data);
                setStudentContractForFillButton(true);
                setStudentContractForFillLoader(false);
            }).catch((err) => {
                Notification('error', err);
                setStudentContractForFillLoader(false);
            });
    };

    const editTableData = (data) => {
        setTables(data);
    };

    return (
        <Card title={t("StudentContract")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>
                        <Col md={4}>
                            <Form.Item
                                label={t('Number')}
                                name="Number"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder={t("Number")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                label={t("Date")}
                                name="Date"
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker
                                    format="DD.MM.YYYY" style={{ width: '100%' }}
                                    placeholder={t('Date')} className={'addonInput'}
                                // onChange={onChangeDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                label={t('Sum')}
                                name="Sum"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder={t("Sum")}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                label={t("DbSubAcc")}
                                name="DbSubAccID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {studentContractDbList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={6}>
                            <Form.Item
                                label={t("CrSubAcc")}
                                name="CrSubAccID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {studentContractCrList.map((taxItem) => (
                                        <Option key={taxItem.ID} value={taxItem.ID}>
                                            {taxItem.Code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={12}>
                            <Form.Item
                                label={t("FacultyName")}
                                name="FacultyName"
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
                                        <Button
                                            disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openFacultyListModal({
                                                Name: 'FacultyName',
                                                ID: 'FacultyID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("FacultyID")}
                                name="FacultyID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={12}>
                            <Form.Item
                                label={t("StudyDirectionName")}
                                name="StudyDirectionName"
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
                                        <Button
                                            disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openStudyDirectionListModal({
                                                Name: 'StudyDirectionName',
                                                ID: 'StudyDirectionID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("StudyDirection")}
                                name="StudyDirectionID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={12}>
                            <Form.Item
                                label={t("StudyGroupName")}
                                name="StudyGroupName"
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
                                        <Button
                                            disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openStudyGroupListModal({
                                                Name: 'StudyGroupName',
                                                ID: 'StudyGroupID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("StudyGroup")}
                                name="StudyGroupID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={12}>
                            <Form.Item
                                label={t("ListOfPositionName")}
                                name="ListOfPositionName"
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
                                        <Button
                                            disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openListOfPositionListModal({
                                                Name: 'ListOfPositionName',
                                                ID: 'ListOfPositionID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("ListOfPosition")}
                                name="ListOfPositionID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={6} md={12}>
                            <Form.Item
                                label={t("OrganizationsSettlementAccount")}
                                name="OrganizationsSettlementAccount"
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
                                        <Button
                                            disabled={disabledTables}
                                            style={{ border: 'none', background: 'transparent', padding: '0' }}
                                            onClick={() => openSettlementAccountsListModal({
                                                Name: 'OrganizationsSettlementAccount',
                                                ID: 'OrganizationsSettlementAccountID',
                                            })}
                                        >
                                            <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                                        </Button>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("OrganizationsSettlementAccountID")}
                                name="OrganizationsSettlementAccountID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={6}>
                            <Form.Item
                                label={t("Acad-Start")}
                                name="AcademicYearStart"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker style={{ width: "100%" }} picker="year" />
                            </Form.Item>
                        </Col>
                        <Col xl={4} md={6}>
                            <Form.Item
                                label={t("Acad -End")}
                                name="AcademicYearEnd"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <DatePicker style={{ width: "100%" }} picker="year" />
                            </Form.Item>
                        </Col>
                        <Col xl={10} md={20}>
                            <Form.Item
                                label={t("comment")}
                                name="Comment"
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
                    </Row>
                    <Tabs type="card">
                        <TabPane tab={t("StudentContract")} key="1">
                            <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <Button
                                    disabled={studentContractForFillButton}
                                    loading={studentContractForFillLoader}
                                    onClick={fillStudentContractForFillTable}
                                    type="primary"
                                >
                                    {t('fill')}
                                </Button>
                            </Space>
                            <StudentContractForFillTable
                                data={Tables}
                                editTableData={editTableData}
                                setDisabledTables={setDisabledTables}
                            />
                        </TabPane>
                    </Tabs>
                </Form>

                <Space size='middle' className='btns-wrapper'>
                    <Button
                        type="default"
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
                in={facultyListModal}
                timeout={300}
            >
                <FacultyListModal
                    visible={facultyListModal}
                    params={facultyListParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setFacultyListModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={studyDirectionModal}
                timeout={300}
            >
                <StudyDirectionListModal
                    visible={studyDirectionModal}
                    params={studyDirectionParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setStudyDirectionModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={studyGroupModal}
                timeout={300}
            >
                <StudyGroupListModal
                    visible={studyGroupModal}
                    params={studyGroupParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setStudyGroupModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={listOfPositionModal}
                timeout={300}
            >
                <ListOfPositionListModal
                    visible={listOfPositionModal}
                    params={listOfPositionParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setListOfPositionModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={settlementAccountsModal}
                timeout={300}
            >
                <SettlementAccountsModal
                    visible={settlementAccountsModal}
                    params={settlementAccountsParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setSettlementAccountsModal(false);
                    }}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(UpdateStudentContract);