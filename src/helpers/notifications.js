import { notification } from 'antd';

const Notification = (type, msg) => {
  notification[type]({
    message: msg.toString(),
  });
};

export { Notification }