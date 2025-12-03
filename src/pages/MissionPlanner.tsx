import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";

const { Title } = Typography;

const MissionPlanner: React.FC = () => {
  return (
    <div className="missionplanner-wrapper">
      <div className="missionplanner-header">
        <Title level={2}>Mission Planner</Title>
        <StatusBadge />
      </div>
    </div>
  );
};

export default MissionPlanner;
