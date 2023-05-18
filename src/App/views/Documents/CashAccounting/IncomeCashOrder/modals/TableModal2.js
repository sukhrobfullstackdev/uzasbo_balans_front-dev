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
            const result = await ApiServices.get(`${props.subDepartmentList.CrSubCountInfo.SubCount2Controller}/${props.subDepartmentList.CrSubCountInfo.SubCount2Action}?PageNumber=1&PageLimit=10`);     
            setSubCashList(result.data.rows)
            setTableData(result.data);
            setTableLoading(false);
            };            
        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    
      }, [props.subDepartmentList.CrSubCountInfo.SubCount2Controller, props.subDepartmentList.CrSubCountInfo.SubCount2Action]);
      

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: (a, b) => a.ID - b.ID,
            width: 80,
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: (a, b) => a.Name.localeCompare(b.Name),
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
            //title={t("ContractorSubCount")}
            okText={t("select")}
            cancelText={t("cancel")}            
            onCancel={props.onCancel}
            width={1000}
            onOk={() => {
                props.onCancel();
                props.getHeaderStaffListOrganizationName2(rowData);
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
                                    placeholder={t("Name")}
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
                            rowKey={record => record.ID}
                            showSorterTooltip={false}
                            loading={tableLoading}
                            pagination={false}
                              onRow={(record) => {
                                return {
                                    onDoubleClick: () => {               
                                        props.getHeaderStaffListOrganizationName2({id: record.ID, name: record.Name});
                                        props.onCancel();
                                    },
                                    onClick: () => {
                                    setRowData( {id: record.ID, name: record.Name});
                                    },
                                };
                              }}
                            scroll={{
                                x: "max-content",
                                y: '50vh'
                            }}
                        />


                    </Form>
                </Fade>
        </Modal>
    );

}
export default TableModal;