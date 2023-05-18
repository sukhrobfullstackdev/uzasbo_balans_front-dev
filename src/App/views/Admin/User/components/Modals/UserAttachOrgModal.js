import React, { useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Admin/User/User.services';

const tablePagination = {
  pageSize: 20
};

const UserAttachOrgModal = ({ id }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [userAttachOrgLoading, setUserAttachOrgLoading] = useState(false);
  // const [userAttachOrg, setUserAttachOrg] = useState({});
  const [userAttachOrgsModel, setUserAttachOrgsModel] = useState([]);
  const [userAttachOrgsModelFilter, setUserAttachOrgsModelFilter] = useState([]);
  const [userAttachOrgsModel1, setUserAttachOrgsModel1] = useState([]);
  const [userAttachOrgsModel1Filter, setUserAttachOrgsModel1Filter] = useState([]);

  const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
  const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
  const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
  const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

  const [selectedButtonRight, setSelectedButtonRight] = useState(true);
  const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
  const [selectedModelsRight, setSelectedModelsRight] = useState([]);
  const [selectedRowKeysRight, setRowKeysRight] = useState([]);

  const AttachOrgModalColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      width: 80,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('ShortName'),
      dataIndex: 'ShortName',
      sorter: (a, b) => a.ShortName.localeCompare(b.ShortName),
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t('ChapterID'),
      dataIndex: 'ChapterID',
      width:100,
      sorter: (a, b) => a.ChapterID.localeCompare(b.ChapterID),
    },
    {
      title: t('INN'),
      dataIndex: 'INN',
      sorter: (a, b) => a.INN.localeCompare(b.INN),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getUserAttachOrg = (id) => {
    setUserAttachOrgLoading(true);
    UserServices.getAttachOrg(id)
      .then(response => {
        setUserAttachOrgLoading(false);
        // setUserAttachOrg(response.data);
        setUserAttachOrgsModel(response.data.AttachOrg);
        setUserAttachOrgsModelFilter(response.data.AttachOrg);
        setUserAttachOrgsModel1(response.data.AttachOrg1);
        setUserAttachOrgsModel1Filter(response.data.AttachOrg1);
      }).catch(error => {
        setUserAttachOrgLoading(false);
        Notification('error', error);
      });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchLeft = (event) => {
    const filteredModels = userAttachOrgsModelFilter.filter(model => model.ShortName.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserAttachOrgsModel(filteredModels);
  };

  const onSearchRight = (event) => {
    const filteredModels = userAttachOrgsModel1Filter.filter(model => model.ShortName.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserAttachOrgsModel1(filteredModels);
  };

  const resetTableLeft = () => {
    setRowKeysLeft([]);
  };

  const resetTableRight = () => {
    setRowKeysRight([]);
  };

  const rowSelectionLeft = {
    selectedRowKeys: selectedRowKeysLeft,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedModelsLeft(selectedRows);
      setRowKeysLeft(selectedRowKeys);
      if (selectedRows.length > 0) {
        setSelectedButtonLeft(false);
      } else {
        setSelectedButtonLeft(true);
      }
    },
    // getCheckboxProps: (record) => ({
    //   name: record.Name,
    // }),
  };

  const rowSelectionRight = {
    selectedRowKeys: selectedRowKeysRight,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedModelsRight(selectedRows);
      setRowKeysRight(selectedRowKeys);
      if (selectedRows.length > 0) {
        setSelectedButtonRight(false);
      } else {
        setSelectedButtonRight(true);
      }
    },
    // getCheckboxProps: (record) => ({
    //   name: record.Name,
    // }),
  };

  const handleSubmitSelectedRowsLeft = () => {
    setSelectedButtonLeftLoading(true);
    const checkedSelectedModelsLeft = selectedModelsLeft.map(item => {
      item.Check = true
      return item;
    });

    UserServices.updateAttachOrg({ ID: id, AttachOrg: checkedSelectedModelsLeft })
      .then(response => {
        getUserAttachOrg(id);
        setSelectedButtonLeft(true);
        setSelectedButtonLeftLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  const handleSubmitSelectedRowsRight = () => {
    setSelectedButtonRightLoading(true);
    const checkedSelectedModelsRight = selectedModelsRight.map(item => {
      item.Check = true
      return item;
    });

    UserServices.updateAttachOrg1({ ID: id, AttachOrg1: checkedSelectedModelsRight })
      .then(response => {
        getUserAttachOrg(id);
        setSelectedButtonRight(true);
        setSelectedButtonRightLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  return (
    <>
     
        <div onClick={() => { showModal(); getUserAttachOrg(id) }}>
          <i className="feather icon-paperclip action-icon" />&nbsp;
          {t("AttachOrg")}
        </div>
      
      
        <Modal
          width={1200}
          title={t("AttachOrg")}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={false}
        >
          <Row>
            <Col span={11}>
              <Input
                onChange={onSearchLeft}
                placeholder={t("Search")}
              />
              <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table mt-4"
                columns={AttachOrgModalColumns}
                dataSource={userAttachOrgsModel}
                loading={userAttachOrgLoading}
                scroll={{ y: "40vh" }}
                rowKey={record => record.ID}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionLeft,
                }}
                pagination={false}
                // pagination={{
                //   ...tablePagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
              />
            </Col>
            <Col span={2} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <Button
                style={{ margin: "8px" }}
                disabled={selectedButtonLeft}
                loading={selectedButtonLeftLoading}
                className="d-flex justify-content-center align-items-center"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  handleSubmitSelectedRowsLeft();
                  resetTableLeft();
                }}
              />
              <Button
                style={{ margin: "8px" }}
                disabled={selectedButtonRight}
                loading={selectedButtonRightLoading}
                className="d-flex justify-content-center align-items-center"
                type="primary" icon={<ArrowLeftOutlined />}
                onClick={() => {
                  handleSubmitSelectedRowsRight();
                  resetTableRight();
                }}
              />
            </Col>
            <Col span={11}>
              <Input
                onChange={onSearchRight}
                placeholder={t("Search")}
              />
              <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table mt-4"
                columns={AttachOrgModalColumns}
                dataSource={userAttachOrgsModel1}
                loading={userAttachOrgLoading}
                scroll={{ y: "40vh" }}
                rowKey={record => record.ID}
                pagination={false}
                // pagination={{
                //   ...tablePagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionRight,
                }}
              />
            </Col>
          </Row>
        </Modal>
    </>
  )
}

export default UserAttachOrgModal;