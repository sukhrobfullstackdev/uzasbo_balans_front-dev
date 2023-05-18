import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import HelperServices from '../../../../../../services/Helper/helper.services';

const ResponsiblePersonDbModal = (props) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            key: 'Name',
            width: 250,
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [rowData, setRowData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                HelperServices.getResponsiblePersonForDocList(),
                  //getResponsiblePersonForDocList(),
                
            ]);
            setTableData(tableData.data);
            setFilteredTableData(tableData.data.rows);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const onSearch = (event) => {
        const filteredTable = tableData.rows.filter(model => model.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        setFilteredTableData(filteredTable);
    };

    const selectRow = () => {
        props.onSelect(rowData);
        if (rowData !== null) {
            props.onCancel();
        }
    };

    const setRowClassName = (record) => {
        return record.ID === rowData?.ID ? 'table-row clicked-row' : 'table-row';
    }

    return (
        <Modal
            width={768}
            title={t("ResponsiblePersonDbName")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    disabled={!rowData}
                    type="primary"
                    onClick={selectRow}
                >
                    {t("select")}
                </Button>,
            ]}
        >
            <Input
                placeholder={t("Search")}
                onChange={onSearch}
            />
            <Table
                bordered
                size="middle"
                rowClassName={setRowClassName}
                className="main-table mt-4"
                columns={columns}
                dataSource={filteredTableData}
                loading={tableLoading}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            props.onSelect({
                                ID: record.ID, NameValue: record.Name,
                                id: props.params.ID, Name: props.params.Name,
                            });
                            props.onCancel();
                        },
                        onClick: () => {
                            setRowData({ ID: record.ID, NameValue: record.Name,
                                id: props.params.ID, Name: props.params.Name });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default React.memo(ResponsiblePersonDbModal);