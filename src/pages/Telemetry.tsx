// src/pages/Telemetry.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Row, Col, Card, Tag, Typography } from "antd";
import ROSLIB from "roslib";
import { useRos } from "../context/ros_context";
import { OdometryMsg } from "../msg/OdometryMsg";
import { quatToEulerRPY, timeToSeconds } from "../utils/conversions";

const { Content } = Layout;
const { Title, Text } = Typography;


interface InfoBoxProps { label: string; value?: string | number; }
const InfoBox: React.FC<InfoBoxProps> = ({ label, value }) => (
  <div style={{ background:"#fafafa", border:"1px solid #eee", borderRadius:8, padding:8 }}>
    <Text strong>{label}</Text>{value !== undefined ? <Text>: {value}</Text> : null}
  </div>
);

interface DroneStatusPanelProps { data: InfoBoxProps[]; }
const DroneStatusPanel: React.FC<DroneStatusPanelProps> = ({ data }) => (
  <Card title="Drone Status">
    <Row gutter={[8, 8]}>
      {data.map((d, i) => (
        <Col xs={24} sm={12} key={i}>
          <InfoBox label={d.label} value={d.value} />
        </Col>
      ))}
    </Row>
  </Card>
);

const GPSMapPanel: React.FC = () => (
  <Card
    title="GPS Map"
    styles={{ body: { minHeight: 240, display: "grid", placeItems: "center" } }}
  >
    <Text type="secondary">Map Placeholder</Text>
  </Card>
);

const Aircraft3DModelPanel: React.FC = () => (
  <Card
    title="Aircraft 3D Model"
    styles={{ body: { minHeight: 240, display: "grid", placeItems: "center" } }}
  >
    <Text type="secondary">3D Model Placeholder</Text>
  </Card>
);

const TelemetryChartPanel: React.FC = () => (
  <Card
    title="Telemetry Chart/List"
    styles={{ body: { minHeight: 240, display: "grid", placeItems: "center" } }}
  >
    <Text type="secondary">List or chart goes here</Text>
  </Card>
);

// ───────────────────────────────────────────────────────────────────────────────
// Main page component with ROS hookup
// ───────────────────────────────────────────────────────────────────────────────
interface TelemetryProps {
  /** Odometry topic name; defaults to MAVROS local position */
  odomTopic?: string;
  /** rosbridge message type; rosbridge2 uses "nav_msgs/msg/Odometry", classic uses "nav_msgs/Odometry" */
  odomMsgType?: string;
}

// This is the main driver for the layout and uses the ROS2 connection
const Telemetry: React.FC<TelemetryProps> = ({
  odomTopic = "mavros/local_position/odom",
  odomMsgType = "nav_msgs/msg/Odometry", // change to "nav_msgs/Odometry" if using classic rosbridge
}) => {
  const { ros, isConnected } = useRos();

  const [odom, setOdom] = useState<OdometryMsg | null>(null);
  const [lastStamp, setLastStamp] = useState<number | null>(null);
  const topicRef = useRef<ROSLIB.Topic | null>(null);

  // Create the Topic only when ros + connection + name are ready
  const topic = useMemo(() => {
    if (!ros || !isConnected) return null;
    try {
      return new ROSLIB.Topic({
        ros,
        name: odomTopic,
        messageType: odomMsgType,
        queue_size: 1,
      });
    } catch (e) {
      console.error("[Telemetry] Failed to create Topic:", e);
      return null;
    }
  }, [ros, isConnected, odomTopic, odomMsgType]);

  useEffect(() => {
    if (!topic) return;
    topicRef.current = topic;

    const cb = (msg: OdometryMsg) => {
      setOdom(msg);
      setLastStamp(timeToSeconds(msg.header));
    };

    topic.subscribe(cb);
    console.log(`[Telemetry] Subscribed to ${odomTopic}`);

    return () => {
      try {
        topic.unsubscribe(cb);
        console.log(`[Telemetry] Unsubscribed from ${odomTopic}`);
      } catch {/* noop */}
      topicRef.current = null;
    };
  }, [topic, odomTopic]);

  // Derived telemetry
  const pos = odom?.pose.pose.position;
  const ori = odom?.pose.pose.orientation;
  const twLin = odom?.twist?.twist?.linear;
  const twAng = odom?.twist?.twist?.angular;

  const { roll, pitch, yaw } = ori ? quatToEulerRPY(ori) : { roll: 0, pitch: 0, yaw: 0 };

  const groundSpeed = useMemo(() => {
    if (twLin?.x === undefined || twLin?.y === undefined) return undefined;
    return Math.sqrt(twLin.x * twLin.x + twLin.y * twLin.y);
  }, [twLin?.x, twLin?.y]);

  // Helper to show numbers nicely
  const fmt = (v?: number | null, digits = 3) =>
    typeof v === "number" ? v.toFixed(digits) : "-";

  // Build the status grid (feeds InfoBox components)
  const droneStatusData: InfoBoxProps[] = useMemo(
    () => [
      { label: "Altitude (m)", value: fmt(pos?.z) },
      { label: "Ground Speed (m/s)", value: fmt(groundSpeed) },
      { label: "Dist to WP (m)", value: "-" },           // needs /mavros/distance_sensor or mission topic
      { label: "Roll (deg)", value: fmt((roll * 180) / Math.PI) },
      { label: "Vertical Speed (m/s)", value: fmt(twLin?.z) },
      { label: "Pitch (deg)", value: fmt((pitch * 180) / Math.PI) },
      { label: "DistToMAV (m)", value: "-" },            // requires another topic/reference
      { label: "Yaw (deg)", value: fmt((yaw * 180) / Math.PI) },
    ],
    [pos?.z, groundSpeed, roll, pitch, yaw, twLin?.z]
  );

  // Keeping with Siya's layout we're using ANTD to adjust the layout of the panels
  return (
    <Content style={{ padding: 16, display: "flex", flex: 1, minWidth: 0 }}>
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>Telemetry</Title>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Tag color={isConnected ? "green" : "red"}>
              Status: {isConnected ? "Connected to Drone" : "Disconnected"}
            </Tag>
            <Text type="secondary">
              Topic: <code>{odomTopic}</code>
              {"  "} | Stamp: {lastStamp != null ? lastStamp.toFixed(3) : "—"}
            </Text>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}><Aircraft3DModelPanel /></Col>
          <Col xs={24} lg={12}><GPSMapPanel /></Col>
          <Col xs={24} lg={12}><DroneStatusPanel data={droneStatusData} /></Col>
          <Col xs={24} lg={12}><TelemetryChartPanel /></Col>
        </Row>
      </div>
    </Content>
  );
};

export default Telemetry;