import React, { useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Admin/User/User.services';

// const tablePagination = {
//   pageSize: 20
// };

const UserRegionModal = ({ id }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [userRegionLoading, setUserRegionLoading] = useState(false);
  // const [userRegion, setUserRegion] = useState({});
  const [userRegionsModel, setUserRegionsModel] = useState([]);
  const [userRegionsModelFilter, setUserRegionsModelFilter] = useState([]);
  const [userRegionsModel1, setUserRegionsModel1] = useState([]);
  const [userRegionsModel1Filter, setUserRegionsModel1Filter] = useState([]);

  const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
  const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
  const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
  const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

  const [selectedButtonRight, setSelectedButtonRight] = useState(true);
  const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
  const [selectedModelsRight, setSelectedModelsRight] = useState([]);
  const [selectedRowKeysRight, setRowKeysRight] = useState([]);

  const RegionModalColumns = [
    {
      title: t('Region'),
      dataIndex: 'Code',
      width: 80,
      sorter: (a, b) => a.Code - b.Code,
    },
    {
      title: t('region'),
      dataIndex: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getUserRegion = (id) => {
    setUserRegionLoading(true);
    UserServices.getRegion(id)
      .then(response => {
        setUserRegionLoading(false);
        // setUserRegion(response.data);
        setUserRegionsModel(response.data.RegionModel);
        setUserRegionsModelFilter(response.data.RegionModel);
        setUserRegionsModel1(response.data.RegionModel1);
        setUserRegionsModel1Filter(response.data.RegionModel1);
      }).catch(error => {
        setUserRegionLoading(false);
        Notification('error', error);
      });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchLeft = (event) => {
    const filteredModels = userRegionsModelFilter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserRegionsModel(filteredModels);
  };

  const onSearchRight = (event) => {
    const filteredModels = userRegionsModel1Filter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserRegionsModel1(filteredModels);
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

    UserServices.updateRegion({ ID: id, RegionModel: checkedSelectedModelsLeft })
      .then(response => {
        getUserRegion(id);
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

    UserServices.updateRegion1({ ID: id, RegionModel1: checkedSelectedModelsRight })
      .then(response => {
        getUserRegion(id);
        setSelectedButtonRight(true);
        setSelectedButtonRightLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  return (
    <>

      <div onClick={() => { showModal(); getUserRegion(id) }}>
        <i className="feather icon-home action-icon" />&nbsp;
        {t("Region")}
      </div>

      <Modal
        width={1000}
        title={t("Region")}
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
              columns={RegionModalColumns}
              dataSource={userRegionsModel}
              loading={userRegionLoading}
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
              columns={RegionModalColumns}
              dataSource={userRegionsModel1}
              loading={userRegionLoading}
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

export default UserRegionModal;