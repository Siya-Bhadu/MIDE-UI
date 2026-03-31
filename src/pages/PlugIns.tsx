import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import GuidanceAlgorithmSelector from "../components/GuidanceAlgorithmSelector";
import { useRadarTrack } from "../hooks/useRadarTrack";
 
const { Title } = Typography;
 
const PlugIns: React.FC = () => {
  const track = useRadarTrack();
 
  return (
<div className="plugins-wrapper">
<div className="plugins-header">
<Title level={2}>Plug-Ins</Title>
<StatusBadge />
</div>
 
      <GuidanceAlgorithmSelector />
 
      <div style={{ marginTop: 24 }}>
<Title level={4}>Radar Track</Title>
        {track ? (
<table style={{ borderCollapse: "collapse", width: "100%" }}>
<tbody>
              {Object.entries(track).map(([key, val]) => (
<tr key={key} style={{ borderBottom: "1px solid #f0f0f0" }}>
<td style={{ padding: "6px 12px", fontWeight: 500, width: 80 }}>{key}</td>
<td style={{ padding: "6px 12px" }}>{val}</td>
</tr>
              ))}
</tbody>
</table>
        ) : (
<p style={{ color: "#888" }}>Waiting for radar data...</p>
        )}
</div>
</div>
  );
};
 
export default PlugIns;