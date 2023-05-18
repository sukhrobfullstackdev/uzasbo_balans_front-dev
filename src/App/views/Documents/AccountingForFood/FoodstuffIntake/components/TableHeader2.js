import React, { useState, useCallback } from "react";
import { Form, Input, Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";

import InventoryHoldingNameModal from '../components/Modal/InventoryHoldingNameModal'
import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from '../../../../../../services/Helper/helper.services';

const layout = {
    labelCol: {
        span: 24,
    }
};
const { Option } = Select;

const TableHeader2 = (props) => {

    const { t } = useTranslation();
    const [addForm] = Form.useForm();
    const [subDblist, setSubDbList] = useState([]);
    console.log(subDblist)
    const [subCrlist, setSubCrList] = useState([]);

    const [inventoryHoldingNameModal, setInventoryHoldingNameModal] = useState(false);
    const [commonParams, setCommonParams] = useState(null);

    const [searchValues, setSearchValues] = useState({});

    const openInventoryHoldingNameModal = (params) => {
        setCommonParams(params);
        setInventoryHoldingNameModal(true)
    }

    const selectOperation = useCallback((id, value) => {
        HelperServices.getTMZSubAccDBList(value.key)
            .then((res) => {
                setSubDbList(res.data)
            })
            .catch(err => Notification('error', err))

        HelperServices.getInpaymentSubAccCRList(value.key)
            .then((res) => {
                setSubCrList(res.data)
            })
            .catch(err => Notification('error', err))
    }, [])

    const getInventoryHoldingName = (value) => {
        console.log(searchValues)
        value.map(v => {
            console.log(v);
            v.ID=0;
            v.AllowedTransactionName = searchValues.AllowedTransactionID
            v.InventoryHoldingName = v.Name
            v.SubAccDbID = searchValues.SubAccDbID
            v.SubAccCrID = searchValues.SubAccCrID

            return v
        })
        console.log(value);
        props.addData(value);
    };
    


    return (
        <>
            <Form
                {...layout}
                form={addForm}
                component={false}
                initialValues={{
                    SubAccDbID:  subDblist.Code
                }}

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
                                {props.allowTranslist2.map((item) => (
                                    <Option key={item.ID} value={item.Name}>
                                        {item.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('SubAccDbCode')}
                            name='SubAccDbID'
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
                                    <Option key={item.ID} value={item.Code}>
                                        {item.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('SubAccCrCode')}
                            name='SubAccCrID'
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
                                    <Option key={item.ID} value={item.Code}>
                                        {item.Code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('InventoryNumber')}
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('InventoryHoldingName')}
                                name='InventoryHoldingName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: false,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('InventoryHoldingName')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() =>
                                        addForm.validateFields().then(values => {
                                            setSearchValues(values)
                                            openInventoryHoldingNameModal({
                                                Name: 'InventoryHoldingName',
                                                // ID: 'SubCountDb1OriginalID',
                                                Endpoint: 'GetList',
                                            })
                                        })
                                    }
                                />
                            </Button.Group>
                        </div>
                    </th>

                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('price')}
                    </th>

                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('quantity')}
                    </th>

                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        {t('Sum')}
                    </th>
                </tr >
            </Form >

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={inventoryHoldingNameModal}
                timeout={300}
            >
                <InventoryHoldingNameModal
                    visible={inventoryHoldingNameModal}
                    params={commonParams}
                    onSelect={getInventoryHoldingName}
                    onCancel={() => {
                        setInventoryHoldingNameModal(false);
                    }}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(TableHeader2);
