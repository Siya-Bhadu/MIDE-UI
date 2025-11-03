// Rosconnection.tsx (notice capital R)
import { useEffect, useState } from "react";
import ROSLIB from "roslib";

interface RosConnectionProps {
  rosUrl: string;
  rosDomainId?: number | string;
  setRos: (ros: ROSLIB.Ros) => void;
}

export default function Rosconnection({
  rosUrl,
  rosDomainId,
  setRos,
}: RosConnectionProps): JSX.Element | null {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: rosUrl } as any);
    (ros as any).options = { ros_domain_id: rosDomainId };

    ros.on("connection", () => {
      setRos(ros);
      setIsConnected(true);
      console.log("✅ Connected to ROSBridge WebSocket server.");
    });

    ros.on("error", (error: unknown) => {
      console.error("❌ Error connecting to ROSBridge:", error);
      setIsConnected(false);
    });

    ros.on("close", () => {
      console.warn("⚠️ Connection closed.");
      setIsConnected(false);
    });

    return () => {
      ros.close();
    };
  }, [rosUrl, rosDomainId, setRos]);

  return (
    <div style={{ padding: "0.5rem", fontSize: "0.9rem" }}>
      ROS Connection:{" "}
      <span style={{ color: isConnected ? "green" : "red" }}>
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
