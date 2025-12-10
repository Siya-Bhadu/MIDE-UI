// src/pages/Telemetry.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Row, Col, Card, Typography } from "antd";
import { quatToEulerRPY} from "../utils/conversions";
import "../index.css";
import { useRos } from "../context/ros_context";
import StatusBadge from "../components/StatusBadge";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import AirplaneLogo from "../pictures/AirplaneLogo.png";
import L from "leaflet";
import { useRosTopic } from "../hooks/useRosTopic";
import { NavSatFixMsg, HomePositionMsg, OdometryMsg } from "../msg/rosMsgs";


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
const droneIcon = L.icon({
  iconUrl: AirplaneLogo,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const GPSMapPanel: React.FC = () => {
  // Subscribe to GPS topic
  const { data: gpsData } = useRosTopic<NavSatFixMsg>(
    "/mavros/global_position/raw/fix",
    "sensor_msgs/msg/NavSatFix"
  );

    // Subscribe to Home Position topic
  const { data: homeData } = useRosTopic<HomePositionMsg>(
    "/mavros/home_position/home",
    "mavros_msgs/msg/HomePosition"
  );

  // Default center of map = home position if available
  const defaultPosition: [number, number] = homeData
    ? [homeData.geo.latitude, homeData.geo.longitude]
    : [38.6962501, -94.2581944];  // fallback

  const currentPosition: [number, number] = 
    gpsData?.latitude !== undefined && gpsData?.longitude !== undefined
      ? [gpsData.latitude, gpsData.longitude]
      : defaultPosition;

  const [position, setPosition] = useState<[number, number]>(currentPosition);
  const [prevPosition, setPrevPosition] = useState<[number, number]>(currentPosition);
  const [trail, setTrail] = useState<[number, number][]>([currentPosition]);

  useEffect(() => {
    if (gpsData?.latitude !== undefined && gpsData?.longitude !== undefined) {
      setPrevPosition(position);
      const newPos: [number, number] = [gpsData.latitude, gpsData.longitude];
      setPosition(newPos);
      setTrail((oldTrail) => [...oldTrail, newPos]);
    }
  }, [gpsData?.latitude, gpsData?.longitude]);

    useEffect(() => {
    if (homeData?.geo?.latitude !== undefined && homeData?.geo?.longitude !== undefined) {
      const homePos: [number, number] = [
        homeData.geo.latitude,
        homeData.geo.longitude,
      ];

      setPrevPosition(homePos);
      setPosition(homePos);
      setTrail([homePos]); // optional
    }
  }, [homeData]);

  return (
    <Card title="GPS Map" className="telemetry-card panel-gps-map">
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer center={position} zoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={trail} color="blue" weight={3} />
          <LeafletTrackingMarker
            icon={droneIcon}
            position={position}
            previousPosition={prevPosition}
            duration={1000}
          >
            <Popup>
              <b>Drone Position</b><br />
              Lat: {position[0].toFixed(6)}<br />
              Long: {position[1].toFixed(6)}
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
  odomMsgType = "nav_msgs/msg/Odometry",
}) => {
  // Use the hook for odometry subscription
  const { data: odom, lastUpdate } = useRosTopic<OdometryMsg>(odomTopic, odomMsgType);
  
  // Convert message timestamp for StatusBadge
  const lastStamp = useMemo(() => {
    if (!odom?.header?.stamp) return null;
    return odom.header.stamp.sec + odom.header.stamp.nanosec / 1e9;
  }, [odom?.header?.stamp]);

  // Derived telemetry
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