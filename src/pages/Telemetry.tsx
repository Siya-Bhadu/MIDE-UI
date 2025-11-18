// src/pages/Telemetry.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Row, Col, Card, Tag, Typography } from "antd";
import ROSLIB from "roslib";
import { useRos } from "../context/ros_context";
import { OdometryMsg } from "../msg/OdometryMsg";
import { quatToEulerRPY, timeToSeconds } from "../utils/conversions";
import "../index.css";
import StatusBadge from "../components/StatusBadge";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const { Content } = Layout;
const { Title, Text } = Typography;


interface InfoBoxProps { label: string; value?: string | number; }
const InfoBox: React.FC<InfoBoxProps> = ({ label, value }) => (
  <div className="info-box">
    <Text strong>{label}</Text>{value !== undefined ? <Text>: {value}</Text> : null}
  </div>
);

interface DroneStatusPanelProps { data: InfoBoxProps[]; }
const DroneStatusPanel: React.FC<DroneStatusPanelProps> = ({ data }) => (
  <Card title="Drone Status" className="telemetry-card panel-drone-status">
    <Row gutter={[8, 8]}>
      {data.map((d, i) => (
        <Col xs={24} sm={12} key={i}>
          <InfoBox label={d.label} value={d.value} />
        </Col>
      ))}
    </Row>
  </Card>
);

const GPSMapPanel: React.FC = () => {
  const position: [number, number] = [39.0997, -94.5786]; // Kansas City

  return (
    <Card title="GPS Map" className="telemetry-card panel-gps-map">
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>Hello from Kansas City!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
};

const Aircraft3DModelPanel: React.FC = () => (
  <Card title="Aircraft 3D Model" className="telemetry-card panel-aircraft-3d">
    <div className="panel-content-center">
      <Text type="secondary">3D Model Placeholder</Text>
    </div>
  </Card>
);

const TelemetryChartPanel: React.FC = () => (
  <Card title="Telemetry Chart/List" className="telemetry-card panel-chart">
    <div className="panel-content-center">
      <Text type="secondary">List or chart goes here</Text>
    </div>
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

  // Updated & Moved Styling to index.css - Siya
    return (
    <Content className="telemetry-wrapper">
      <div className="telemetry-header">
        <Title level={2}>Telemetry</Title>
        <StatusBadge topicName={odomTopic} lastStamp={lastStamp} />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}><Aircraft3DModelPanel /></Col>
        <Col xs={24} lg={12}><GPSMapPanel /></Col>
        <Col xs={24} lg={12}><DroneStatusPanel data={droneStatusData} /></Col>
        <Col xs={24} lg={12}><TelemetryChartPanel /></Col>
      </Row>
    </Content>
  );
};

export default Telemetry;