import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";

const { Title } = Typography;

const GuidanceControl: React.FC = () => {
  return (
    <div className="guidancecontrol-wrapper">
      <div className="guidancecontrol-header">
        <Title level={2}>Guidance/Control</Title>
        <StatusBadge />
      </div>
    </div>
  );
};

export default GuidanceControl;
