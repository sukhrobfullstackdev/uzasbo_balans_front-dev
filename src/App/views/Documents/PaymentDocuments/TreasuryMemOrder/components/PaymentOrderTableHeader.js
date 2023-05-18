import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";

import CommonModal from "./CommonModal";

const layout = {
    labelCol: {
        span: 24,
    }
};
const { Option } = Select;

const PaymentOrderTableHeader = (props) => {
    // console.log(props.addable);
    const { tableHeaders } = props

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const [commonModal, setCommonModal] = useState(false);
    const [commonParams, setCommonParams] = useState(null);

    const addStaffHandler = () => {
        let currrrr = props.currrrr;

        addStaffForm.validateFields()
            .then(values => {
                props.mainForm.validateFields().then(mainValues => {
                    let selectedItem = props.itemOfExpenseList.find(expense => expense.ID === values.ItemOfExpensesID)

                    values.key = Math.random();
                    values.ID = 0;
                    values.Status = 1;
                    values.Sum = 0;
                    values.ItemOfExpensesCode = selectedItem.Code;
                    values.CurrencySum = 0;
                    values.TableIsCurrency = currrrr;
                    props.addData(values);
                })
            })
    };

    const openCommonModal = (params) => {
        setCommonParams(params);
        setCommonModal(true);
    }

    const onSelect = (data) => {
        // console.log(data);
        addStaffForm.setFieldsValue({
            [`${data.id}`]: data.ID,
            [`${data.Name}`]: data.NameValue,
        });
    }

    return (
        <>
            <Form
                {...layout}
                form={addStaffForm}
                component={false}
                initialValues={{
                }}
            >
                <tr>
                    <th className='ant-table-cell'>
                        {t('id')}
                    </th>
                    {(tableHeaders?.SubCount1ID > 1) ? (
                        <th className='ant-table-cell'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Form.Item
                                    label={t(`${tableHeaders?.SubCount1Name}`)}
                                    name='SubCountDb1Name'
                                    style={{ width: "calc(100% - 56px)" }}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <Input readOnly
                                        placeholder={t(`${tableHeaders?.SubCount1Name}`)}
                                    />
                                </Form.Item>
                                <Button.Group>
                                    <Button
                                        type="primary"
                                        icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                        onClick={() => openCommonModal({
                                            Name: 'SubCountDb1Name',
                                            ID: 'SubCountDb1OriginalID',
                                            Controller: `${tableHeaders?.SubCount1Controller}`,
                                            Endpoint: `${tableHeaders?.SubCount1Action}`,
                                        })}
                                    />
                                </Button.Group>
                                <Form.Item
                                    label={t("SubCountDb1OriginalID")}
                                    name="SubCountDb1OriginalID"
                                    hidden={true}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </th>
                    ) : (
                        <th className='ant-table-cell'></th>
                    )}
                    {(props.tableHeaders?.SubCount2ID > 1) ? (
                        <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t(`${tableHeaders?.SubCount2Name}`)}
                                name='SubCountDb2Name'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t(`${tableHeaders?.SubCount2Name}`)}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openCommonModal({
                                        Name: 'SubCountDb2Name',
                                        ID: 'SubCountDb2OriginalID',
                                        Controller: `${tableHeaders?.SubCount2Controller}`,
                                        Endpoint: `${tableHeaders?.SubCount2Action}`,
                                    })}
                                />
                            </Button.Group>
                            <Form.Item
                                label={t("SubCountDb2OriginalID")}
                                name="SubCountDb2OriginalID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </th>
                    ) : (
                        <th className='ant-table-cell'></th>
                    )}
                    {(props.tableHeaders?.SubCount3ID > 1) ? (
                        <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t(`${tableHeaders?.SubCount3Name}`)}
                                name='SubCountDb3Name'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t(`${tableHeaders?.SubCount3Name}`)}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openCommonModal({
                                        Name: 'SubCountDb3Name',
                                        ID: 'SubCountDb3OriginalID',
                                        Controller: `${tableHeaders?.SubCount3Controller}`,
                                        Endpoint: `${tableHeaders?.SubCount3Action}`,
                                    })}
                                />
                            </Button.Group>
                            <Form.Item
                                label={t("SubCountDb3OriginalID")}
                                name="SubCountDb3OriginalID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </th>
                    ) : (
                        <th className='ant-table-cell'></th>
                    )}

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('ItemOfExpensesName')}
                            name='ItemOfExpensesID'
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("Select from list")}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.itemOfExpenseList.map((taxItem) => (
                                    <Option key={taxItem.ID} value={taxItem.ID}>
                                        {taxItem.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        {t('Sum')}
                    </th>


                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<i className="feather icon-plus" aria-hidden="true" />}
                            // htmlType='submit'
                            onClick={addStaffHandler}
                        />
                    </th>
                </tr >
            </Form >

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={commonModal}
                timeout={300}
            >
                <CommonModal
                    visible={commonModal}
                    params={commonParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setCommonModal(false);
                    }}
                />
            </CSSTransition>

        </>
    );
};

export default React.memo(PaymentOrderTableHeader);
