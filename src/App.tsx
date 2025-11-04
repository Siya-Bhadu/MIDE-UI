// src/App.tsx
import { Layout } from "antd";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ROSLIB from "roslib";
import { RosProvider } from "./context/ros_context";

import Rosconnection from "./components/RosConnection";
import MenuList from "./components/MenuList";
import SidebarToggle from "./components/SidebarToggle";
import SidebarResizer from "./components/SidebarResizer";

// Pages
import Home from "./pages/Home";
import Telemetry from "./pages/Telemetry";
import GuidanceControl from "./pages/GuidanceControl";
import MissionPlanner from "./pages/MissionPlanner";
import PlugIns from "./pages/PlugIns";
import Settings from "./pages/Settings";

const { Sider, Content } = Layout;

function App(): JSX.Element {
  const [siderWidth, setSiderWidth] = useState(260);
  const [collapsed, setCollapsed] = useState(false);

  // Manage the ROS2 connection
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const isConnected = ros?.isConnected ?? false;

  return (
    <Router>
      {/* Establish connection (once) */}
      <Rosconnection
        rosUrl={"ws://localhost:9090"}
        rosDomainId={0}
        setRos={setRos}
      />

      {/* Make ROS available to all pages */}
      <RosProvider value={{ ros, isConnected }}>
        
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            width={siderWidth}
            className="sidebar"
            collapsible
            collapsed={collapsed}
            trigger={null}
          >
            <MenuList />
            <SidebarToggle collapsed={collapsed} setCollapsed={setCollapsed} />
            <SidebarResizer
              collapsed={collapsed}
              siderWidth={siderWidth}
              setSiderWidth={setSiderWidth}
            />
          </Sider>

          <Layout>
            <Content
              style={{
                padding: "20px",
                backgroundColor: "white",
                color: "black",
                position: "relative",
              }}
            >
              {/* Small indicator in the corner */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 16,
                  fontSize: 13,
                  color: isConnected ? "green" : "red",
                }}
              >
                {isConnected ? "ROS Connected ✅" : "ROS Disconnected ❌"}
              </div>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/telemetry" element={<Telemetry />} />
                <Route path="/guidance_control" element={<GuidanceControl />} />
                <Route path="/mission_planner" element={<MissionPlanner />} />
                <Route path="/plug_ins" element={<PlugIns />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </RosProvider>
    </Router>
  );
}

export default App;