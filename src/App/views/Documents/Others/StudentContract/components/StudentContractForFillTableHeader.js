import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import moment from "moment";

import ListStudentListModal from "./ListStudentListModal";

const layout = {
    labelCol: {
        span: 24,
    }
};

const StudentContractForFillTableHeader = (props) => {

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const [subCalcKindListModal, setSubCalcKindListModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                // console.log(moment().format("DD.MM.YYYY"));
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                values.ContractNumber = 0;
                values.ContractDate = moment().format("DD.MM.YYYY");
                values.Sum = 0;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

    const openSubCalcKindListModal = (params) => {
        setCalculationKindParams(params);
        setSubCalcKindListModal(true);
    };

    const onSelect = (data) => {
        // console.log(data);
        addStaffForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
        });
    };

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
                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('Student')}
                                name='StudentName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('StudentName')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openSubCalcKindListModal({
                                        Name: 'StudentName',
                                        ID: 'StudentID'
                                    })}
                                />
                            </Button.Group>
                        </div>
                    </th>
                    <th className='ant-table-cell'>
                        {t('ContractNumber')}
                    </th>
                    <th className='ant-table-cell'>
                        {t('ContractDate')}
                    </th>
                    <th className='ant-table-cell'>
                        {t('Sum')}
                    </th>
                    <th className='ant-table-cell'>
                        {t('StudentCode')}
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
                in={subCalcKindListModal}
                timeout={300}
            >
                <ListStudentListModal
                    visible={subCalcKindListModal}
                    params={calculationKindParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setSubCalcKindListModal(false);
                    }}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(StudentContractForFillTableHeader);
