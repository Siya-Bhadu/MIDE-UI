import React from "react";
import { Tag, Typography } from "antd";
import { useRos } from "../context/ros_context";

const { Text } = Typography;

interface StatusBadgeProps {
  topicName?: string;
  lastStamp?: number | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ topicName = "mavros/local_position/odom", lastStamp }) => {
  const { isConnected } = useRos();

  return (
    <div className="status-section">
      <Tag className={`status-badge ${isConnected ? "connected" : "disconnected"}`}>
        Status: {isConnected ? "Connected to Drone" : "Disconnected"}
      </Tag>
      <Text type="secondary">
        Topic: <code>{topicName}</code> | Stamp: {lastStamp != null ? lastStamp.toFixed(3) : "—"}
      </Text>
    </div>
  );
};

export default StatusBadge;
