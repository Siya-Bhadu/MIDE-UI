// src/pages/Home.tsx
import { useRos } from "../context/ros_context";

export default function Home() {
  const { ros, isConnected } = useRos();

  return (
    <div>
      <h1>Home</h1>
      <p>ROS Connection: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
      {/* <pre>{ros ? JSON.stringify(ros, null, 2) : "No ROS instance yet"}</pre> */}
    </div>
  );
}
