import { Table} from 'antd';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.itemOfExpenseList);    
    const storeLoading = tableList.listBegin;
    const userListPagination = tableList.paginationData;
    const tableData = tableList.listSuccessData?.rows;
    const total = tableList.listSuccessData?.total;

    const [loading] = useState(false);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80,
            align:'center'
        },
        {
            title: t("NumberOfGroup"),
            dataIndex: "NumberOfGroup",
            key: "NumberOfGroup",
            sorter: true,
            width: 150,
            align:'center'
            // render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("code"),
            dataIndex: "Code",
            key: "Code",
            width: 100,
            align:'center',
            sorter: true,
        },
        {
            title: t("Code1"),
            dataIndex: "Code1",
            key: "Code1",
            align:'center',
            // width: 100,
            sorter: true,
        },
        {
            title: t("Code2"),
            dataIndex: "Code2",
            key: "Code2",
            align:'center',
            // width: 100,
            sorter: true,
        },
        {
            title: t("Code3"),
            dataIndex: "Code3",
            key: "Code3",
            align:'center',
            // width: 100,
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            width:400,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },

        
    ];

    function handleTableChange(pagination, sorter) {
        const { field, order } = sorter;

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    };

   

    const onTableRow = (record) => {
        if(record.IsGroup){
            <div className="table-bold">{record}</div>
        }
        return {
          onDoubleClick: () => {
            history.push(`${location.pathname}/edit/${record.ID}`);
          },
        };
      }

    return (
        <Table
            bordered
            size="middle"
            // rowClassName="table-row"
            rowClassName={(record, index) => (record.IsGroup === true ? "table-bold" : "")}
            className="main-table"
            columns={columns}
            dataSource={tableData}
            loading={storeLoading || loading}
            onChange={handleTableChange}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            onRow={(record) => onTableRow(record)
            }
            // summary={records => tableSummaryHandler(records)}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            pagination={{
                pageSize: Math.ceil(tableData?.length / 10) * 10,
                total: total,
                current: userListPagination.PageNumber,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
        />
    )
}

export default React.memo(TableData);