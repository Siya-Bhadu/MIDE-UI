import { Quaternion } from "roslib";
import {Header} from "../msg/Header"

export function quatToEulerRPY(q: Quaternion): { roll: number; pitch: number; yaw: number } {
  const x = q.x;
  const y = q.y;
  const z = q.z;
  const w = q.w;
  
  // roll (x-axis rotation)
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  // pitch (y-axis rotation)
  let sinp = 2 * (w * y - z * x);
  // Clamp to handle numerical drift
  if (sinp > 1) sinp = 1;
  if (sinp < -1) sinp = -1;
  const pitch = Math.asin(sinp);

  // yaw (z-axis rotation)
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
}


export function timeToSeconds(h?: Header): number | null {
  if (!h?.stamp || typeof h.stamp.sec !== "number") return null;
  const ns = typeof h.stamp.nanosec === "number" ? h.stamp.nanosec : 0;
  return h.stamp.sec + ns * 1e-9;
}
