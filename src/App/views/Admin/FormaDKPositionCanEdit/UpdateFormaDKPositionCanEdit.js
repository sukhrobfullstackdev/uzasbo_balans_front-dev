import { Button, Checkbox, Col, Form, Input, Row, Space, Table, Tabs, InputNumber, Spin } from "antd";
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../helpers/notifications';
import FormaDKPositionCanEditServices from '../../../../services/Admin/FormaDKPositionCanEdit/FormaDKPositionCanEdit.services';

import Card from "../../../components/MainCard";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

const UpdateFormaDKPositionCanEdit = (props) => {
    const { t } = useTranslation();
    const [mainForm] = Form.useForm();
    const history = useHistory();

    const columnsDebet = [
        {
            title: t("NumberOfGroup"),
            dataIndex: 'NumberOfGroup',
            key: "NumberOfGroup",
            width: 100,
            sorter: (a, b) => a.NumberOfGroup - b.NumberOfGroup,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.CategoryName),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("itemOfExpenseCode"),
            dataIndex: 'RowCode',
            key: 'RowCode',
            width: 100,
            sorter: (a, b) => a.RowCode.localeCompare(b.RowCode),
        },
        {
            title: t("CanEdit"),
            dataIndex: 'CanEdit',
            key: 'CanEdit',
            width: 100,
            sorter: (a, b) => a.CanEdit.localeCompare(b.CanEdit),
            render: (record, fullRecord) => {
                return (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Checkbox defaultChecked={record}
                            onChange={() => onChangeDebet(fullRecord)}
                        ></Checkbox>
                    </Space>
                )
            },
        },
    ];

    const columnsKredit = [
        {
            title: t("NumberOfGroup"),
            dataIndex: 'NumberOfGroup',
            key: "NumberOfGroup",
            width: 100,
            sorter: (a, b) => a.NumberOfGroup - b.NumberOfGroup,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.CategoryName),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("itemOfExpenseCode"),
            dataIndex: 'RowCode',
            key: 'RowCode',
            width: 100,
            sorter: (a, b) => a.RowCode.localeCompare(b.RowCode),
        },
        {
            title: t("CanEdit"),
            dataIndex: 'CanEdit',
            key: 'CanEdit',
            width: 100,
            sorter: (a, b) => a.CanEdit.localeCompare(b.CanEdit),
            render: (record, fullRecord) => {
                return (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Checkbox defaultChecked={record}
                            onChange={() => onChangeKredit(fullRecord)}
                        ></Checkbox>
                    </Space>
                )
            },
        },
    ];

    const [loader, setLoader] = useState(true);
    const [formaDKPosition, setFormaDKPosition] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [dontSpecifycolumnsZero, setDontSpecifycolumnsZero] = useState(false);
    const [fillButton, setFillButton] = useState(false);
    // const [filledValues, setFilledValues] = useState([]);
    const [debetTable, setDebetTable] = useState([]);
    const [kreditTable, setKreditTable] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [formaDKPosition,] = await Promise.all([
                FormaDKPositionCanEditServices.getById(props.match.params.id ? props.match.params.id : 0),

            ]);
            // if (props.match.params.id ? props.match.params.id : 0) {
            // console.log(salaryTransactionList.data);    
            setFormaDKPosition(formaDKPosition.data);
            const newDebetTable = formaDKPosition.data.Tables.filter(table => table.Status !== 3);
            const newKreditTable = formaDKPosition.data.Tables2.filter(table => table.Status !== 3);
            setDebetTable(newDebetTable);
            setKreditTable(newKreditTable);
            // }

            if (props.match.params.id) {
                // HelperServices.childHoursTypeList(children.data.ChildrenGroupTypeID)
                //     .then(response => {
                //         setChildHoursTypeList(response.data)
                //     })
                //     .catch((err) => Notification('error', err));
            }

            mainForm.setFieldsValue({
                ...formaDKPosition.data,

            });
            // setLoader(false);    
        };
        setLoader(false);

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const onChangeStatus = (event) => {
        // console.log(event);
        const newDebetTable = formaDKPosition.Tables.filter(debet => debet.RowCode.includes(event));
        const newKreditTable = formaDKPosition.Tables2.filter(kredit => kredit.RowCode.includes(event));
        setDebetTable(newDebetTable);
        setKreditTable(newKreditTable);
    };

    const specifyColumns = (checked) => {
        // console.log(checked);
        if (checked === (true || undefined)) {
            const newDebetTable = debetTable.filter(debet => debet.CanEdit === true);
            const newKreditTable = kreditTable.filter(kredit => kredit.CanEdit === true);
            setDebetTable(newDebetTable);
            setKreditTable(newKreditTable);
        } else if (checked === false) {
            console.log(debetTable);
            if (debetTable.length > 0) {
                setDebetTable(debetTable);
            } else { setDebetTable(formaDKPosition.Tables) }
            if (kreditTable.length > 0) {
                setKreditTable(kreditTable);
            } else { setDebetTable(formaDKPosition.Tables2) }
        }
    };

    const fillFormaDK = () => {
        setTableLoading(true)
        FormaDKPositionCanEditServices.FillFormaDKPositionCanEdit()
            .then(res => {
                console.log(res.data);
                // setFilledValues(res.data)

                setFormaDKPosition(res.data);
                setDebetTable(res.data.Tables);
                setKreditTable(res.data.Tables2);

                setFillButton(true)
                setTableLoading(false)
            }).catch(err => {
                Notification('error', err);
                setTableLoading(false)
            })
    };
    // console.log(filledValues);

    const handleDontSpecifycolumnsZero = (event) => {
        // console.log(event.target.checked);
        setDontSpecifycolumnsZero(event.target.checked);
        specifyColumns(event.target.checked);
        mainForm.setFieldsValue({
            [`Status`]: null,
        })
    };

    const onChangeDebet = (row) => {
        // console.log(row);
        const selectedDebet = debetTable.find(debet => debet.ID === row.ID);
        selectedDebet.Status = 2;
        selectedDebet.CanEdit = !selectedDebet.CanEdit;

        const newDebetTable = debetTable.map(row => {
            if (row.ID === selectedDebet.ID) {
                row = selectedDebet;
            }
            return row;
        });
        setDebetTable(newDebetTable);
        specifyColumns(dontSpecifycolumnsZero);
    };

    const onChangeKredit = (row) => {
        // console.log(row);
        const selectedKredit = debetTable.find(debet => debet.ID === row.ID);
        selectedKredit.Status = 2;
        selectedKredit.CanEdit = !selectedKredit.CanEdit;

        const newKreditTable = debetTable.map(row => {
            if (row.ID === selectedKredit.ID) {
                row = selectedKredit;
            }
            return row;
        });
        setKreditTable(newKreditTable);
        specifyColumns(dontSpecifycolumnsZero);
    };

    const onFinish = (values) => {
        console.log(values);
    };

    const handleSave = () => {
        mainForm.validateFields().then((values) => {
            // console.log({
            //     ...formaDKPosition, ...values,
            //     Tables: debetTable, Tables2: kreditTable
            // });
            FormaDKPositionCanEditServices.update({
                ...formaDKPosition, ...values,
                Tables: debetTable, Tables2: kreditTable
            })
                .then((res) => {
                    if (res.status === 200) {
                        setLoader(false);
                        history.push(`/FormaDKPositionCanEdit`);
                        Notification('success', t('success-msg'));
                    }
                })
                .catch((err) => {
                    Notification('error', err);
                    setLoader(false);
                });
        });
    };

    return (
        <Card title={t("FormaDKPositionCanEdit")}>
            <Spin spinning={loader} size='large'>
                <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <Button
                        type="secondary"
                        onClick={fillFormaDK}
                        disabled={fillButton}
                    >
                        {t('Fill')}
                    </Button>
                    <Button
                        // onClick={fillSubCalculationKindTable}
                        type="primary"
                    >
                        {t('Correction')}
                    </Button>
                </Space>
                <Form
                    className='table-filter-form'
                    form={mainForm}
                    onFinish={onFinish}
                >
                    <Row gutter={[15, 0]}>
                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("Code")}
                                name="Code"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    // onChange={onChangeNormativeAct}
                                    style={{ width: "100%" }}
                                    className={'addonInput'} maxLength={4} minLength={4}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={8} md={16}>
                            <Form.Item
                                label={t("Code3")}
                                name="Status"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                style={{ width: "100%" }}
                                    onChange={onChangeStatus}
                                    className={'addonInput'}
                                />
                            </Form.Item>
                        </Col>
                        <Col xl={8} md={16}>
                            <Checkbox
                                onChange={handleDontSpecifycolumnsZero}
                            >
                                {t("dontSpecifycolumnsZero")}
                            </Checkbox>
                        </Col>
                    </Row>
                </Form>
                <Tabs
                    defaultActiveKey="1"
                // onChange={callback}
                >
                    <TabPane tab={t("Дебит")} key="1">
                        <Table
                            bordered
                            size="middle"
                            rowClassName={'table-row'}
                            className="main-table mt-4"
                            columns={columnsDebet}
                            dataSource={debetTable}
                            loading={tableLoading}
                            rowKey={record => record.ID}
                            showSorterTooltip={false}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: "50vh",
                            }}
                        />
                    </TabPane>
                    <TabPane tab={t("Кредит")} key="2">
                        <Table
                            bordered
                            size="middle"
                            rowClassName={'table-row'}
                            className="main-table mt-4"
                            columns={columnsKredit}
                            dataSource={kreditTable}
                            loading={tableLoading}
                            rowKey={record => record.ID}
                            showSorterTooltip={false}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: "50vh",
                            }}
                        />
                    </TabPane>
                </Tabs>
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
                    // htmlType="submit"
                    // form="mainForm"
                    >
                        {t("check")}
                    </Button>
                    <Button
                        htmlType="submit"
                        form="mainForm"
                        type="primary"
                        onClick={handleSave}
                    >
                        {t("save")}
                    </Button>
                </Space>
            </Spin>
        </Card>
    )
}

export default React.memo(UpdateFormaDKPositionCanEdit)