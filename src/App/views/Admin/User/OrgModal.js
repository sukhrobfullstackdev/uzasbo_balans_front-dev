// import React, { useEffect, useState } from "react";
// import { Modal, Table, Tag } from "antd";
// import { useTranslation } from "react-i18next";

// import OrganizationServices from "../../../../../services/Documents/Admin/Organization/Organization.services";
// import { Notification } from "../../../../../helpers/notifications";

// const OrgModal = (props) => {
//   const [tableLoading, setTableLoading] = useState(true);
//   const [tableData, setTableData] = useState([]);
//   const { t } = useTranslation();

//   // useEffect(() => {
//   //   // const fetchData = async () => {
//   //   //   const tableDt = await OrganizationServices.getList();
//   //   //   setTableData(tableDt.data.rows);
//   //   //   setTableLoading(false);
//   //   // }
//   //   // fetchData().catch(err => {
//   //   //   setTableLoading(false);
//   //   //   Notification('error', err);
//   //   // });

//   //   OrganizationServices.getList()
//   //     .then(res => {
//   //       setTableData(res.data.rows);
//   //     setTableLoading(false);

//   //     })
//   //     .catch(err => Notification('error', err))

//   // }, [ ]);

//   useEffect(() => {
//     async function fetchData() {
//         try {
//             const organizationLs = await OrganizationServices.getList();
//             setTableData(organizationLs.data);
//             setTableLoading(false);

//         } catch (err) {
//             Notification('error', err);
//         }
//     }
//     fetchData();
// }, []);

// const columns = [
//   {
//       title: t("id"),
//       dataIndex: "ID",
//       key: "ID",
//       sorter: true,
//   },
//   {
//       title: t("Name"),
//       dataIndex: "Name",
//       key: "Name",
//       sorter: true,
//       width: 110,
//       render: record => <div className="ellipsis-2">{record}</div>
//   },
//   {
//       title: t("INN"),
//       dataIndex: "INN",
//       key: "INN",
//       sorter: true,
//   },
//   {
//       title: t("Chapter"),
//       dataIndex: "Chapter",
//       key: "Chapter",
//       sorter: true,
//       // width: 120
//   },
//   {
//       title: t("FinancingLevel"),
//       dataIndex: "FinancingLevel",
//       key: "FinancingLevel",
//       sorter: true,
//       // width: 120
//   },
  
//   {
//       title: t("TreasuryBranch"),
//       dataIndex: "TreasuryBranch",
//       key: "TreasuryBranch",
//       sorter: true,
//       width: 180,
//       render: record => <div className="ellipsis-2">{record}</div>
//   },
//   {
//     title: t("State"),
//     dataIndex: "State",
//     key: "State",
//     sorter: true,
//     render: (_, record) => {
//         if (record.StatusID === 2 || record.StatusID === 8) {
//             return (
//                 <Tag color='#87d068'>
//                     {record.Status}
//                 </Tag>
//             );
//         }
//         return (
//             <Tag color='#f50'>
//                 {record.Status}
//             </Tag>
//         );
//     }
// },
//   {
//       title: t("IsRecalcNeed"),
//       dataIndex: "IsRecalcNeed",
//       key: "IsRecalcNeed",
//       sorter: true,
      
//   },
// ];

  

//   return (
//     <Modal
//       title={t("Organization")}
//       visible={props.visible}
//       okText={t("select")}
//       cancelText={t("cancel")}
//       onCancel={props.onCancel}
//       onOk={props.onCancel}
//       width={1500}
//       // okButtonProps={{ style: { display: 'none' } }}
//     >
//       <Table
//         bordered
//         size='middle'
//         className="main-table"
//         columns={columns}
//         dataSource={tableData}
//         loading={tableLoading}
//         rowKey={(record) => record.ID}
//         // pagination={false}
//         rowClassName="table-row"
//         scroll={{
//           x: "80vh",
//           y: "50vh",
//         }}
//       />
//     </Modal >
//   )
// }

// export default OrgModal;