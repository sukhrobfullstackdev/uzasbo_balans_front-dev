import { Button, Col, Form, Input, Row, Select, Space, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import DepartmentServices from '../../../../../services/References/Organizational/Department/Department.services';
import classes from "./Department.module.css";

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
// import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import HistoryModal from './HistoryModal.js';
import { CSSTransition } from 'react-transition-group';


const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { Option } = Select;

const UpdateSubAcc = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [department, setDepartment] = useState([]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [historyInputName, setHistoryInputName] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const [department] = await Promise.all([
                DepartmentServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getAccList(),

            ]);
            setDepartment(department.data);

            mainForm.setFieldsValue({
                ...department.data,

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
        DepartmentServices.update({
            ...department, ...values,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/Department`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const historyHandler = inputName => {
        setHistoryInputName(inputName);
        setHistoryModalVisible(true);
    }

    const closeHistoryModalHandler = () => {
        setHistoryModalVisible(false);
    }

    return (
        <Card title={t("Department")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>

                        <Col xl={12} lg={12}>
                            <div className={classes.EmployeeEnrolmentModal}>

                                <CSSTransition
                                    mountOnEnter
                                    unmountOnExit
                                    in={historyModalVisible}
                                    timeout={300}
                                >
                                    <HistoryModal
                                        visible={historyModalVisible}
                                        id={props.match.params.id ? props.match.params.id : 0}
                                        columnName={historyInputName}
                                        onCancel={closeHistoryModalHandler}
                                    />
                                </CSSTransition>
                                <Form.Item
                                    label={t("Name")}
                                    name="Name"
                                    style={{ width: "100%" }}
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("Please input valid"),
                                        },
                                    ]}>

                                    <Input
                                        className={'addonInput'}
                                        addonAfter={
                                            <div
                                                onClick={() => historyHandler('FullName')}
                                                className={classes['ant-input-group-addon']}
                                            >
                                                <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                        }
                                    />
                                </Form.Item>

                            </div>
                        </Col>

                        <Col xl={2} lg={12}>
                            <Form.Item
                                label={t('isStorage')}
                                name='IsStorage'
                                valuePropName="checked"
                            >
                                <Switch />
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

export default UpdateSubAcc;