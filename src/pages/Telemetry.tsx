import React from "react";
import { useRos } from "../context/ros_context";

/**
 * Justin: We're going to update this page to use Typescript to allow type checking
 * I'd like you to do this for all the other pages as well just
 */

// Props is short for properties
interface TelemetryProps {}

// Reusable InfoBox component for Drone Status
interface InfoBoxProps {
  label: string;
  value?: string | number; // value optional for now
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, value }) => {
  return (
    <div className="telemetry-inner-box">
      {label}{value !== undefined ? `: ${value}` : ""}
    </div>
  );
};

// Panel components
interface DroneStatusPanelProps {
  data: InfoBoxProps[];
}
const DroneStatusPanel: React.FC<DroneStatusPanelProps> = ({ data }) => {
  return (
    <div className="telemetry-panel droneStatus">
      <h2>Drone Status</h2>
      <div className="telemetry-inner-grid">
        {data.map((item, i) => (
          <InfoBox key={i} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

const GPSMapPanel: React.FC = () => (
  <div className="telemetry-panel gpsMap">
    <h2>GPS Map</h2>
    <div className="panel-content-center">Map Placeholder</div>
  </div>
);

const Aircraft3DModelPanel: React.FC = () => (
  <div className="telemetry-panel aircraft3DModel">
    <h2>Aircraft 3D Model</h2>
    <div className="panel-content-center">3D Model Placeholder</div>
  </div>
);

const TelemetryChartPanel: React.FC = () => (
  <div className="telemetry-panel telemetryChart">
    <h2>Telemetry Chart/List</h2>
    <div className="panel-content-center">List or chart goes here</div>
  </div>
);

// Function component
const Telemetry: React.FC<TelemetryProps> = () => {
  return <TelemetryContent />;
};

const TelemetryContent: React.FC = () => {
    // ✅ Pull ROS handle & connection state from context
  const { ros, isConnected } = useRos();  // Labels for Drone Status

  const droneStatusData: InfoBoxProps[] = [
    { label: "Altitude (m)", value: "-" },
    { label: "Ground Speed/Air Speed (m/s)", value: "-" },
    { label: "Dist to WP (m)", value: "-" },
    { label: "Roll (deg)", value: "-" },
    { label: "Vertical Speed (m/s)", value: "-" },
    { label: "Pitch (deg)", value: "-" },
    { label: "DistToMAV (m)", value: "-" },
    { label: "Yaw (deg)", value: "-" },
  ];

  return (
    <div className="telemetry-page">
      {/* Top bar: title + status */}
      <div className="telemetry-header">
        <h1>Telemetry</h1>
        <span className={`status-badge ${isConnected ? "connected" : "disconnected"}`}>
          Status: {isConnected ? "Connected to Drone" : "Disconnected"}
        </span>
      </div>

      {/* 4 Panel Dashboard */}
      <div className="telemetry-grid">
        <Aircraft3DModelPanel />  
        <GPSMapPanel />           
        <DroneStatusPanel data={droneStatusData} /> 
        <TelemetryChartPanel />  
      </div>
    </div>
  );
};

export default Telemetry;