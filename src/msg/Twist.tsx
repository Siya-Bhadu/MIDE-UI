import { Vector3 } from "roslib";

export type Twist = {
  twist: {
    linear: Vector3;
    angular: Vector3;
  };
};