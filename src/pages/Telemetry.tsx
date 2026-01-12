// src/pages/Telemetry.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Typography } from "antd";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
  <div className="panel">
    <div style={{ width: '100%' }}>
      <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '16px' }}>Drone Status</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
        {data.map((d, i) => (
          <InfoBox key={i} label={d.label} value={d.value} />
        ))}
      </div>
    </div>
  </div>
);

// GPS Panel
const droneIcon = L.icon({
  iconUrl: AirplaneLogo,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const GPSMapPanel: React.FC = () => {
  const { data: gpsData } = useRosTopic<NavSatFixMsg>(
    "/mavros/global_position/raw/fix",
    "sensor_msgs/msg/NavSatFix"
  );

  const { data: homeData } = useRosTopic<HomePositionMsg>(
    "/mavros/home_position/home",
    "mavros_msgs/msg/HomePosition"
  );

  const defaultPosition: [number, number] = homeData
    ? [homeData.geo.latitude, homeData.geo.longitude]
    : [38.6962501, -94.2581944];

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
      setTrail([homePos]);
    }
  }, [homeData]);

  return (
    <div className="panel" style={{ padding: '1rem' }}>
      <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>GPS Map</Text>
      <div style={{ height: "calc(100% - 40px)", width: "100%" }}>
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
    </div>
  );
};

const Aircraft3DModelPanel: React.FC = () => (
  <div className="panel">
    <Text type="secondary">3D Model Placeholder</Text>
  </div>
);

const TelemetryChartPanel: React.FC = () => (
  <div className="panel">
    <Text type="secondary">List or chart goes here</Text>
  </div>
);

// ───────────────────────────────────────────────────────────────────────────────
// Main page component with ROS hookup
// ───────────────────────────────────────────────────────────────────────────────
interface TelemetryProps {
  odomTopic?: string;
  odomMsgType?: string;
}

const Telemetry: React.FC<TelemetryProps> = ({
  odomTopic = "mavros/local_position/odom",
  odomMsgType = "nav_msgs/msg/Odometry",
}) => {
  const { data: odom, lastUpdate } = useRosTopic<OdometryMsg>(odomTopic, odomMsgType);
  
  const lastStamp = useMemo(() => {
    if (!odom?.header?.stamp) return null;
    return odom.header.stamp.sec + odom.header.stamp.nanosec / 1e9;
  }, [odom?.header?.stamp]);

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

  const fmt = (v?: number | null, digits = 3) =>
    typeof v === "number" ? v.toFixed(digits) : "-";

  const droneStatusData: InfoBoxProps[] = useMemo(
    () => [
      { label: "Altitude (m)", value: fmt(pos?.z) },
      { label: "Ground Speed (m/s)", value: fmt(groundSpeed) },
      { label: "Dist to WP (m)", value: "-" },
      { label: "Roll (deg)", value: fmt((roll * 180) / Math.PI) },
      { label: "Vertical Speed (m/s)", value: fmt(twLin?.z) },
      { label: "Pitch (deg)", value: fmt((pitch * 180) / Math.PI) },
      { label: "DistToMAV (m)", value: "-" },
      { label: "Yaw (deg)", value: fmt((yaw * 180) / Math.PI) },
    ],
    [pos?.z, groundSpeed, roll, pitch, yaw, twLin?.z]
  );

  return (
    <Content className="telemetry-wrapper">
      <div className="telemetry-header">
        <Title level={2}>Telemetry</Title>
        <StatusBadge topicName={odomTopic} lastStamp={lastStamp} />
      </div>

      <div>
        <PanelGroup
          autoSaveId='telemetry-panels'
          direction='horizontal'
          className='rounded-lg border h-full'
        >
          {/* Left panel - split vertically */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical" className="h-full w-full">
              <Panel defaultSize={50} minSize={20}>
                <Aircraft3DModelPanel />
              </Panel>
              <PanelResizeHandle className="rrp-handle-vertical" />
              <Panel defaultSize={50} minSize={20}>
                <DroneStatusPanel data={droneStatusData} />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="rrp-handle" />

          {/* Right panel - split vertically */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical" className="h-full w-full">
              <Panel defaultSize={50} minSize={20}>
                <GPSMapPanel />
              </Panel>
              <PanelResizeHandle className="rrp-handle-vertical" />
              <Panel defaultSize={50} minSize={20}>
                <TelemetryChartPanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </Content>
  );
};

export default Telemetry;