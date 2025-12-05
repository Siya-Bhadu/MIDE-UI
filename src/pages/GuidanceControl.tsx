import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import Resizable from "../components/Resizable";

const { Title } = Typography;

const GuidanceControl: React.FC = () => {
  return (
    <div className="guidancecontrol-wrapper">
      <div className="guidancecontrol-header">
        <Title level={2}>Guidance/Control</Title>
        <StatusBadge />
      </div>

      <div>
        <Resizable />
      </div>
    </div>
  );
};

export default GuidanceControl;
