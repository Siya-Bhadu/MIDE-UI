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
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import AirplaneLogo from "../pictures/AirplaneLogo.png";
import L from "leaflet";


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

// GPS Panel - Updated with tracking icon and mock data to show position movement
// mockPath: loop of lat/long coords to show movement
const mockPath: [number, number][] = [];

const centerLat = 39.0997;
const centerLng = -94.5786;

const radius = 0.003; 
const totalPoints = 40;

for (let i = 0; i < totalPoints; i++) {
  const angle = (2 * Math.PI * i) / totalPoints; // full circle
  
  const lat = centerLat + radius * Math.sin(angle);
  const lng = centerLng + radius * Math.cos(angle);

  mockPath.push([lat, lng]);
}

// L.icon is how Leaflet defines custom marker icons
const droneIcon = L.icon({
  iconUrl: AirplaneLogo,
  iconSize: [50, 50],
  iconAnchor: [25, 25], // Tells Leaflet which point in the icon is the "tip" of the marker (center)
});

// GPSMapPanel = functional React component
// index tracks which point in the path the drone is currently at
// position is the current lat/long for the drone marker
// prevPosition is the previous coordinate, uses it for smooth animation with react-leaflet-tracking-marker
const GPSMapPanel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState<[number, number]>(mockPath[0]);
  const [prevPosition, setPrevPosition] = useState<[number, number]>(mockPath[0]);
  const [trail, setTrail] = useState<[number, number][]>([mockPath[0]]); // creates state called trail to store information (what the polyline uses to draw the path)

  // Most of the logic is to update the position every second to the next point in the mockPath
  useEffect(() => {
    const interval = setInterval(() => { // setInterval is a built-in JS function that runs a function repeatedly at a set time interval (1000 miliseconds = 1 second here)
      setIndex((prev) => { // updates index, pass a function to get latest state value
        const next = (prev + 1) % mockPath.length; // moves to the next point, goes back to 0 if at end of path
        setPrevPosition(position); // updates previous position to current before changing
        setPosition(mockPath[next]); // updates the current drone position to the next point
        setTrail((oldTrail) => [...oldTrail, mockPath[next]]); // adds the next point to the trail every time the drone movements
        return next; // returns the new index 
      });
    }, 1000);
    return () => clearInterval(interval); // cleanup function. react calls it automatically when component unmounts or dependency changes 
  }, [position]);

  return (
    <Card title="GPS Map" className="telemetry-card panel-gps-map">
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer center={position} zoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={trail} /> 
          <LeafletTrackingMarker
            icon={droneIcon}
            position={position}
            previousPosition={prevPosition}
            duration={1000}
          >
            <Popup> 
              <b>Drone Tracking</b><br /> 
              Lat: {position[0]}<br />
              Long: {position[1]}
            </Popup>
          </LeafletTrackingMarker>
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