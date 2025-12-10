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
