import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import Resizable from "../components/Resizable";

const { Title } = Typography;

const Settings: React.FC = () => {
  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <Title level={2}>Settings</Title>
        <StatusBadge />
      </div>
      
      <div>
        <Resizable />
      </div>
    </div>
  );
};

export default Settings;

<Resizable />