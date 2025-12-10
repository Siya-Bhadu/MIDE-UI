// msg/rosMessages.tsx

export interface NavSatFixMsg {
  header: {
    stamp: { sec: number; nanosec: number };
    frame_id: string;
  };
  status: {
    status: number;
    service: number;
  };
  latitude: number;
  longitude: number;
  altitude: number;
  position_covariance: number[];
  position_covariance_type: number;
}

export interface HomePositionMsg {
  header: {
    stamp: { sec: number; nanosec: number };
    frame_id: string;
  };
  geo: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  approach: {
    x: number;
    y: number;
    z: number;
  };
}

export interface OdometryMsg {
  header: {
    stamp: { sec: number; nanosec: number };
    frame_id: string;
  };
  child_frame_id: string;
  pose: {
    pose: {
      position: {
        x: number;
        y: number;
        z: number;
      };
      orientation: {
        x: number;
        y: number;
        z: number;
        w: number;
      };
    };
    covariance: number[];
  };
  twist: {
    twist: {
      linear: {
        x: number;
        y: number;
        z: number;
      };
      angular: {
        x: number;
        y: number;
        z: number;
      };
    };
    covariance: number[];
  };
}