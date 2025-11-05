import { Header } from "./Header";
import { Pose } from "roslib"; 
import { Twist } from "./Twist";

export type OdometryMsg = {
  header?: Header;
  child_frame_id?: string;
  pose: Pose;
  twist: Twist;
};
