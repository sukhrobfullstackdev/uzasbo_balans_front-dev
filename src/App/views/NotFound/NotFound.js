import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("Sorry, the page you visited does notexist.")}
      extra={<Button type="primary" onClick={() => history.goBack()}>Back Home</ Button>}
    />
  );
};

export default NotFound;