import React, {useState, useCallback } from "react";
import { Form, Input, Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";

import ContractorNameModal from '../components/Modal/ContractorNameModal'
import ContractNameModal from '../components/Modal/ContractNameModal'
import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from '../../../../../../services/Helper/helper.services';

const layout = {
    labelCol: {
        span: 24,
    }
};
const { Option } = Select;

const TableHeader = (props) => {

    const { t } = useTranslation();
    const [addForm] = Form.useForm();
    const [subDblist, setSubDbList] = useState([]);
    const [subCrlist, setSubCrList] = useState([]);

    const [contractorNameModal, setContractorNameModal] = useState(false);
    const [contractNameModal, setContractNameModal] = useState(false);
    const [commonParams, setCommonParams] = useState(null);


    const addHandler = () => {

        addForm.validateFields()
            .then(values => {
                    values.key = Math.random();
                    values.ID = 0;
                    values.Status = 1;
                    values.Sum = 0;
                    props.addData(values);
                
            })
    };

    const openContractorNameModal = (params) => {
        setCommonParams(params);
        setContractorNameModal(true)
    }

    const openContractNameModal = (params) => {
        setCommonParams(params);
        setContractNameModal(true)
    }

    const selectOperation = useCallback((id) => {
        HelperServices.getTMZSubAccDBList(id)
            .then((res) => {
                setSubDbList(res.data)
            })
            .catch(err => Notification('error', err))

        HelperServices.getInpaymentSubAccCRList(id)
            .then((res) => {
                setSubCrList(res.data)
            })
            .catch(err => Notification('error', err))
    })

    const getContractorName = useCallback((value) => {
        addForm.setFieldsValue({ ContractorName: value.name });
    }, [addForm]);

    const getContractName = useCallback((value) => {
        addForm.setFieldsValue({ ContractName: value.name });
    }, [addForm]);

    return (
        <>
            <Form
                {...layout}
                form={addForm}
                component={false}
            >
                <tr>
                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('id')}
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('AllowedTransactionID')}
                            name='AllowedTransactionID'
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
                                onSelect={selectOperation}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.allowTranslist.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('SubAccDbCode')}
                            name='SubAccDbCode'
                            // style={{ width: "100%" }}
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
                                {subDblist.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('SubAccCrCode')}
                            name='SubAccCrCode'
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
                                {subCrlist.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('ContractorName')}
                                name='ContractorName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('ContractorName')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openContractorNameModal({
                                        Name: 'ContractorName',
                                        // ID: 'SubCountDb1OriginalID',
                                        Endpoint: 'GetContractorSubCountList',
                                    })}
                                />
                            </Button.Group>
                            {/* <Form.Item
                                            label={t("SubCountDb1OriginalID")}
                                            name="SubCountDb1OriginalID"
                                            hidden={true}
                                        >
                                            <Input />
                                        </Form.Item> */}
                        </div>
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('ContractName')}
                                name='ContractName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('ContractName')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openContractNameModal({
                                        Name: 'ContractorName',
                                        // ID: 'SubCountDb1OriginalID',
                                        Endpoint: 'GetContractForSelectList',
                                    })}
                                />
                            </Button.Group>
                            {/* <Form.Item
                                            label={t("SubCountDb1OriginalID")}
                                            name="SubCountDb1OriginalID"
                                            hidden={true}
                                        >
                                            <Input />
                                        </Form.Item> */}
                        </div>
                    </th>

                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('Sum')}
                    </th>
                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('Comment')}
                    </th>


                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        <Button
                            type='primary'
                            icon={<i className="feather icon-plus" aria-hidden="true" />}
                            onClick={addHandler}
                        />
                    </th>
                </tr >
            </Form >

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={contractorNameModal}
                timeout={300}
            >
                <ContractorNameModal
                    visible={contractorNameModal}
                    params={commonParams}
                    onSelect={getContractorName}
                    onCancel={() => {
                        setContractorNameModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={contractNameModal}
                timeout={300}
            >
                <ContractNameModal
                    visible={contractNameModal}
                    params={commonParams}
                    onSelect={getContractName}
                    onCancel={() => {
                        setContractNameModal(false);
                    }}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(TableHeader);
