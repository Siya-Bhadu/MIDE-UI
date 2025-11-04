// src/pages/Telemetry.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import ROSLIB from "roslib";
import { useRos } from "../context/ros_context";
import {Header} from "../msg/Header"
import { Quaternion } from "roslib";
import { OdometryMsg } from "../msg/OdometryMsg";

// --- Helpers ---
function quatToYaw(q: Quaternion): number {
  // yaw (Z) from quaternio
  const x = q.x;
  const y = q.y;
  const z = q.z;
  const w = q.w;
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  return Math.atan2(siny_cosp, cosy_cosp);
}

function timeToSeconds(h?: Header): number | null {
  if (!h?.stamp || typeof h.stamp.sec !== "number") return null;
  const ns = typeof h.stamp.nanosec === "number" ? h.stamp.nanosec : 0;
  return h.stamp.sec + ns * 1e-9;
}

// --- Component ---
interface TelemetryProps {
  /** Odometry topic name; defaults to '/odom' */
  odomTopic?: string;
}

export default function Telemetry({ odomTopic = "mavros/local_position/odom" }: TelemetryProps) {
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
        messageType: "nav_msgs/msg/Odometry", // ROS 2 message type
        queue_size: 1,
      });
    } catch (e) {
      console.error("[Telemetry] Failed to create Topic:", e);
      return null;
    }
  }, [ros, isConnected, odomTopic]);

  useEffect(() => {
    if (!topic) return;

    // keep a ref so we can unsubscribe on cleanup
    topicRef.current = topic;

    const cb = (msg: OdometryMsg) => {
      setOdom(msg);
      setLastStamp(timeToSeconds(msg.header));
    };

    // subscribe
    topic.subscribe(cb);
    console.log(`[Telemetry] Subscribed to ${odomTopic}`);

    return () => {
      try {
        topic.unsubscribe(cb);
        console.log(`[Telemetry] Unsubscribed from ${odomTopic}`);
      } catch {
        /* noop */
      }
      topicRef.current = null;
    };
  }, [topic, odomTopic]);

  // Render
  const pos = odom?.pose.pose.position;
  const ori = odom?.pose.pose.orientation;
  const twLin = odom?.twist.twist.linear;
  const twAng = odom?.twist.twist.angular;
  const yaw = ori ? quatToYaw(ori) : null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>Telemetry</h1>

      <div style={{ fontSize: 13, opacity: 0.8 }}>
        Status: {isConnected ? "✅ Connected" : "❌ Disconnected"} &nbsp;|&nbsp; Topic:{" "}
        <code>{odomTopic}</code>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        <Card title="Position (m)">
          <KV label="x" value={pos?.x} />
          <KV label="y" value={pos?.y} />
          <KV label="z" value={pos?.z} />
        </Card>

        <Card title="Orientation">
          <KV label="yaw (rad)" value={yaw} />
          <KV label="yaw (deg)" value={yaw != null ? (yaw * 180) / Math.PI : null} />
        </Card>

        <Card title="Velocity">
          <KV label="vx (m/s)" value={twLin?.x} />
          <KV label="vy (m/s)" value={twLin?.y} />
          <KV label="vz (m/s)" value={twLin?.z} />
          <KV label="ωz (rad/s)" value={twAng?.z} />
        </Card>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Stamp (sec): {lastStamp != null ? lastStamp.toFixed(3) : "—"}
      </div>
    </div>
  );
}

// Simple presentational helpers
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 6 }}>{children}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value?: number | null }) {
  const text =
    typeof value === "number" ? value.toFixed(3) : value != null ? String(value) : "—";
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ fontFamily: "mono" }}>{text}</span>
    </div>
  );
}
