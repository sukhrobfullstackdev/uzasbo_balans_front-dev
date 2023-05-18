import React from 'react';
// import { Form, Button, Select, Space, InputNumber, Card, Spin, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
// import Fade from "react-reveal/Fade";

// import { Notification } from "../../../../../helpers/notifications";
import MainCard from "../../components/MainCard";
// import CheckDocsServices from "../../../../../services/Documents/EmployeeMovement/CheckDocs/CheckDocs.services";


const Faq = () => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   setLoading(true);
  //   CheckDocsServices.getDocs(month, year, inUzbek)
  //     .then(res => {
  //       if (res.status === 200) {
  //         setDocs(res.data);
  //         setLoading(false);
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       setLoading(false);
  //       Notification('error', err);
  //     })
  // }, [lang]);

  return (
    <MainCard title={t("faq")}>
      Faq
    </MainCard>
  );
};

export default Faq;