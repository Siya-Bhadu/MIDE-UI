import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import GuidanceAlgorithmSelector from "../components/GuidanceAlgorithmSelector";

const { Title } = Typography;

const PlugIns: React.FC = () => {
  return (
    <div className="plugins-wrapper">
      <div className="plugins-header">
        <Title level={2}>Plug-Ins</Title>
        <StatusBadge />
      </div>
      
      <GuidanceAlgorithmSelector />
    </div>
  );
};

export default PlugIns;