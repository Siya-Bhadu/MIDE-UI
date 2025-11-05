import { Vector3 } from "roslib";
import { Quaternion } from "roslib";

export type Pose = {
  pose: {
    position: Vector3;
    orientation: Quaternion;
  };
};

