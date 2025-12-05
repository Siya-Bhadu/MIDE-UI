import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import Resizable from "../components/Resizable";

const { Title } = Typography;

const MissionPlanner: React.FC = () => {
  return (
    <div className="missionplanner-wrapper">
      <div className="missionplanner-header">
        <Title level={2}>Mission Planner</Title>
        <StatusBadge />
      </div>
      
      <div>
        <Resizable />
      </div>
    </div>
  );
};

export default MissionPlanner;

<Resizable />