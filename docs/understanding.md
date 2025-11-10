## These are notes that are helpful in understanding TypeScript and its functionality

'''JSX
// ───────────────────────────────────────────────────────────────────────────────
// Main page component with ROS hookup
// ───────────────────────────────────────────────────────────────────────────────

// This just tells TypeScript: "This component may recieve two optional props: odomTopic and odomMsgType." If you don't pass them in, it defaults to odomTopic and odomMsgType below, representing which topic to look at.
interface TelemetryProps {
  odomTopic?: string;
  odomMsgType?: string;
}

// This is the main driver for the layout and uses the ROS2 connection
const Telemetry: React.FC<TelemetryProps> = ({
  odomTopic = "mavros/local_position/odom",
  odomMsgType = "nav_msgs/msg/Odometry", 
}) => {
  const { ros, isConnected } = useRos();

  const [odom, setOdom] = useState<OdometryMsg | null>(null); //Stores latest odometry data from the drone
  const [lastStamp, setLastStamp] = useState<number | null>(null); //Stores timestamp of that message
  const topicRef = useRef<ROSLIB.Topic | null>(null); //A way to store the ROS "subscription" object so we can unsubscribe later

  // Create the Topic only when ros + connection + name are ready. useMemo makes sure we don't recreate it every render
  const topic = useMemo(() => { 
    if (!ros || !isConnected) return null;
    try {
      return new ROSLIB.Topic({
        ros,
        name: odomTopic,
        messageType: odomMsgType,
        queue_size: 1,
      });
    } catch (e) {
      console.error("[Telemetry] Failed to create Topic:", e);
      return null;
    }
  }, [ros, isConnected, odomTopic, odomMsgType]);

// When the topic gets created, subscribe to incoming messages.
  useEffect(() => {
    if (!topic) return;
    topicRef.current = topic;

// Save the timestamp + odometry in state (odom)
    const cb = (msg: OdometryMsg) => {
      setOdom(msg);
      setLastStamp(timeToSeconds(msg.header));
    };
// Subscribe to incoming messages
    topic.subscribe(cb);
    console.log(`[Telemetry] Subscribed to ${odomTopic}`);

// When the component unmounts or changes, unsubscribe
    return () => {
      try {
        topic.unsubscribe(cb);
        console.log(`[Telemetry] Unsubscribed from ${odomTopic}`);
      } catch {/* noop */}
      topicRef.current = null;
    };
  }, [topic, odomTopic]);

  // Derived telemetry
  // The reason why the syntax looks the way it does it because of the nested structure of Odometry in ROS. It's using something called Optional chaining (?.) It prevents your code from crashing if something is missing. (?.) essentially means "Try to access this, but if the left side is null or undefined, stop and return undefined instead of crashing."
  Long story short, its a safety for when odom = null.

  const pos = odom?.pose.pose.position;
  const ori = odom?.pose.pose.orientation;
  const twLin = odom?.twist?.twist?.linear;
  const twAng = odom?.twist?.twist?.angular;

// Converts to angles
  const { roll, pitch, yaw } = ori ? quatToEulerRPY(ori) : { roll: 0, pitch: 0, yaw: 0 };

  const groundSpeed = useMemo(() => {
    if (twLin?.x === undefined || twLin?.y === undefined) return undefined;
    return Math.sqrt(twLin.x * twLin.x + twLin.y * twLin.y);
  }, [twLin?.x, twLin?.y]);

  // Helper to show numbers nicely (3 decimal points)
  const fmt = (v?: number | null, digits = 3) =>
    typeof v === "number" ? v.toFixed(digits) : "-";

  // Build the status grid (feeds InfoBox components)
  const droneStatusData: InfoBoxProps[] = useMemo(
    () => [
      { label: "Altitude (m)", value: fmt(pos?.z) },
      { label: "Ground Speed (m/s)", value: fmt(groundSpeed) },
      { label: "Dist to WP (m)", value: "-" },           // needs /mavros/distance_sensor or mission topic
      { label: "Roll (deg)", value: fmt((roll * 180) / Math.PI) },
      { label: "Vertical Speed (m/s)", value: fmt(twLin?.z) },
      { label: "Pitch (deg)", value: fmt((pitch * 180) / Math.PI) },
      { label: "DistToMAV (m)", value: "-" },            // requires another topic/reference
      { label: "Yaw (deg)", value: fmt((yaw * 180) / Math.PI) },
    ],
    [pos?.z, groundSpeed, roll, pitch, yaw, twLin?.z]
  );

  // Keeping with Siya's layout we're using ANTD to adjust the layout of the panels
  return (
    <Content style={{ padding: 16, display: "flex", flex: 1, minWidth: 0 }}>
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>Telemetry</Title>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Tag color={isConnected ? "green" : "red"}>
              Status: {isConnected ? "Connected to Drone" : "Disconnected"}
            </Tag>
            <Text type="secondary">
              Topic: <code>{odomTopic}</code>
              {"  "} | Stamp: {lastStamp != null ? lastStamp.toFixed(3) : "—"}
            </Text>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}><Aircraft3DModelPanel /></Col>
          <Col xs={24} lg={12}><GPSMapPanel /></Col>
          <Col xs={24} lg={12}><DroneStatusPanel data={droneStatusData} /></Col>
          <Col xs={24} lg={12}><TelemetryChartPanel /></Col>
        </Row>
      </div>
    </Content>
  );
};

export default Telemetry;
'''

- index.d.ts is the TypeScript definition file for ROSLIB.js, essentially a dictionary describing ROSLIB's classes and functions
- Describes the shapes of objects, classes and functions, describes what methods exist, helps VSCode with autocomplete, helps TypeScript warn you when you use ROSLIB wrong

What we actually care about:
1. ROSLIB.Ros - export class Ros extends EventEmitter2 {} 
- It represents the connection to rosbridge, connects/disconnects, retrieves topics/services if needed
2. ROSLIB.Topic - represents a single ROS Topic. If we were to, when we add another topic, we would reuse this!!!

export class Topic<TMessage = Message> {
    subscribe(callback)
    unsubscribe(callback)
    advertise()
    publish(message)
}

Used in Telemetry: new ROSLIB.Topic({
    ros,
    name: odomTopic,           // e.g., "mavros/local_position/odom"
    messageType: odomMsgType,  // e.g., "nav_msgs/msg/Odometry"
})
3. ROSLIB.Message
- Used when published messages, don't currently use.

Process of adding another Topic:
1. Create a new state variable (useState)
2. Create a new topic using ROSLIB.Topic (useMemo, new ROSLIB.Topic)
3. Subscribe to the topic inside a (useEffect)
4. Use the data (ex. const latitude = gpsFix?.latitude;)
5. Use in UI (display with labels in panel)