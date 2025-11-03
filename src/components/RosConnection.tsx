/*-------------------------------
The MIT License (MIT)
Copyright (c) 2023 Takumi Asada.
-------------------------------*/

import React, { useEffect } from "react";
import ROSLIB from "roslib";

interface RosConnectionProps {
  rosUrl: string;
  rosDomainId?: number | string;
  setRos: (ros: ROSLIB.Ros) => void;
}

/**
 * React component that initializes a ROSLIB connection
 * to a ROSBridge WebSocket server and updates connection status.
 */
const rosConnection: React.FC<RosConnectionProps> = ({
  rosUrl,
  rosDomainId,
  setRos,
}) => {
  useEffect(() => {
    // Initialize ROS connection
    const ros = new ROSLIB.Ros({
      url: rosUrl,
      // @ts-expect-error: roslib types may not include 'options' field, but it's used in practice
      options: {
        ros_domain_id: rosDomainId,
      },
    });

    // Handle successful connection
    ros.on("connection", () => {
      setRos(ros);
      const statusEl = document.getElementById("status");
      if (statusEl) statusEl.innerHTML = "successful";
      console.log("✅ Connected to ROSBridge WebSocket server.");
    });

    // Handle errors
    ros.on("error", (error: unknown) => {
      console.error("❌ Error connecting to ROSBridge:", error);
    });

    // Handle disconnection
    ros.on("close", () => {
      console.warn("⚠️ Connection to ROSBridge closed.");
    });

    // Cleanup on component unmount
    return () => {
      ros.close();
    };
  }, [rosUrl, rosDomainId, setRos]);

  return <></>;
};

export default rosConnection;
