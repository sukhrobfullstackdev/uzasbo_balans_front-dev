import React, { useEffect, useState } from "react";
import { Form, Modal, Table, Input, } from "antd";
import { useTranslation } from "react-i18next";
import Fade from "react-reveal/Fade";

import ApiServices from '../../../../../../services/api.services';

const TableModal = (props) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const [subCashList, setSubCashList] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
 
    useEffect(() => {
        const fetchData = async () => {
         
            const result = await ApiServices.get(`${props.subDepartmentList?.DbSubCountInfo?.SubCount1Controller}/${props.subDepartmentList?.DbSubCountInfo?.SubCount1Action}?PageNumber=1&PageLimit=10`);
            setSubCashList(result.data.rows)  
            setTableData(result.data);
            setTableLoading(false);       
            };     
            fetchData().catch(err => {
                Notification('error', err);
                setTableLoading(false);
            });
    
      }, [props.subDepartmentList?.DbSubCountInfo?.SubCount1Controller, props.subDepartmentList?.DbSubCountInfo?.SubCount1Action]);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80,
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },

    ];
    const onSearch = (event) => {
        const filteredModels = tableData.rows.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setSubCashList(filteredModels);
    };

    const setRowClassName = (record) => {
        return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
      }


    return (
        <Modal
            visible={props.visible}
            title={t("ContractorSubCount")}
            okText={t("select")}
            cancelText={t("cancel")}
            onOk={props.onCancel}
            onCancel={props.onCancel}
            width={1000}
            onClick={() => {
                props.onCancel();
                props.getHeaderStaffListOrganizationName(rowData);
            }}
        >
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
                                <Input.Search
                                  className="table-search"
                                  placeholder={t("search")}
                                  enterButton
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
                            rowKey={record => record.ID}
                            showSorterTooltip={false}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: '50vh'
                            }}

                            onRow={(record) => {
                                return {
                                    onDoubleClick: () => {               
                                        props.getHeaderStaffListOrganizationName({id: record.ID, name: record.Name});
                                        props.onCancel();
                                    },
                                    onClick: () => {
                                    setRowData( {id: record.ID, name: record.Name});
                                    },
                                };
                              }}
                        />
                    </Form>
                </Fade>
        </Modal>
    );

}
export default TableModal;
