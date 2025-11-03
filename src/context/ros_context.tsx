/**
 * This context allows us to share the ROS2 connection to other panes without
 * needing to create a new thread to share it to another pane 
 * Makes information passing a lot safer 
 */
import { createContext, useContext } from "react";
import ROSLIB from "roslib";

export interface RosContextType {
  ros: ROSLIB.Ros | null;
  isConnected: boolean;
}

// Default empty context
const RosCtx = createContext<RosContextType>({
  ros: null,
  isConnected: false,
});

export const RosProvider = RosCtx.Provider;
export const useRos = () => useContext(RosCtx);