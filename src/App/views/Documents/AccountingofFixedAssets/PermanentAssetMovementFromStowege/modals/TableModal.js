import React, { useEffect, useState } from "react";
import { Form, Modal, Table, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import Fade from "react-reveal/Fade";

import HelperServices from '../../../../../../services/Helper/helper.services';


const TableModal = (props) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const [subCashList, setSubCashList] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [rowData, setRowData] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log(props);
            const [tableData] = await Promise.all([
                HelperServices.getRestByPermanentAsset(props.modalDate, props.responsiblePersonCrModalID, props.subDepartmentList, props.SubAccID),
            ]);
            setTableData(tableData.data);
            setSubCashList(tableData.data.rows)
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props]);

    const onSearch = (event) => {
        const filteredTable = tableData.rows.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setSubCashList(filteredTable);
    };

    const selectRow = () => {
        props.onSelect(selectedRows);

        if (rowData !== null) {
            props.onCancel();
        }
    };

    // Seleect Modal 
    const setRowClassName = (record) => {
        return record.PermanentAssetID === rowData?.PermanentAssetID ? 'table-row clicked-row' : 'table-row';
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
        // selections: [    
        //     {
        //       key: 'odd',
        //       text: 'Select Odd Row',
        //       onSelect: (changableRowKeys) => {
        //         let newSelectedRowKeys = [];
        //         newSelectedRowKeys = changableRowKeys.filter((_, index) => {
        //           if (index % 2 !== 0) {
        //             return false;
        //           }

        //           return true;
        //         });
        //         setSelectedRowKeys(newSelectedRowKeys);
        //       },
        //     },
        //     {
        //       key: 'even',
        //       text: 'Select Even Row',
        //       onSelect: (changableRowKeys) => {
        //         let newSelectedRowKeys = [];
        //         newSelectedRowKeys = changableRowKeys.filter((_, index) => {
        //           if (index % 2 !== 0) {
        //             return true;
        //           }

        //           return false;
        //         });
        //         setSelectedRowKeys(newSelectedRowKeys);
        //       },
        //     },
        //   ],

    };

    const columns = [
        {
            title: t("PermanentAssetID"),
            dataIndex: "PermanentAssetID",
            key: "PermanentAssetID",
            sorter: true,
            width: 80,
        },
        {
            title: t("InventoryNumber"),
            dataIndex: "InventoryNumber",
            key: "InventoryNumber",
            sorter: true,
            width: 100,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("PermanentAssetName"),
            dataIndex: "PermanentAssetName",
            key: "PermanentAssetName",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Quantity"),
            dataIndex: "Quantity",
            key: "Quantity",
            sorter: true,
            width: 80,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Amount"),
            dataIndex: "Amount",
            key: "Amount",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SubAccCode"),
            dataIndex: "SubAccCode",
            key: "SubAccCode",
            sorter: true,
            width: 100,
            render: record => <div className="ellipsis-2">{record}</div>
        },

    ];

    return (
        <Modal
            visible={props.visible}
            title={t("ContractorSubCount")}
            okText={t("select")}
            cancelText={t("cancel")}
            onCancel={props.onCancel}
            width={1500}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    disabled={rowData}
                    type="primary"
                    onClick={selectRow}
                >
                    {t("select")}
                </Button>,
            ]}
        >
            {/* <Spin size='large' spinning={mainLoader}> */}
            <Fade>
                <Form
                    layout='vertical'
                    className='table-filter-form'
                    form={filterForm}
                >
                    <div className="main-table-filter-wrapper">

                        <Form.Item
                            label={t("Name")}
                            name="Name"
                        >
                            <Input
                                placeholder="Search..."
                                onChange={onSearch}
                            />
                        </Form.Item>

                    </div>

                    <Table
                        bordered
                        size="middle"
                        rowClassName={setRowClassName}
                        className="main-table"
                        columns={columns}
                        dataSource={subCashList}
                        loading={tableLoading}
                        showSorterTooltip={false}
                        rowKey={record => record.PermanentAssetID}
                        pagination={false}
                        rowSelection={rowSelection}
                        scroll={{
                            x: "max-content",
                            y: '50vh'
                        }}
                        onRow={(record) => {
                            return {
                                // onDoubleClick: () => {
                                //     props.onSelect({
                                //         ID: record.PermanentAssetID, NameValue: record.Name,
                                //         id: props.params.PermanentAssetID, Name: props.params.Name,
                                //     });
                                //     props.onCancel();
                                // },
                                // onClick: () => {
                                //     setRowData({
                                //         ID: record.PermanentAssetID, NameValue: record.Name,
                                //         id: props.params.PermanentAssetID, Name: props.params.Name
                                //     });
                                // },
                            };
                        }}
                    />


                </Form>
            </Fade>

            {/* </Spin> */}

        </Modal>
    );

}
export default TableModal;
