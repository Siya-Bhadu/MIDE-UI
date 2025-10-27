import { Layout } from 'antd';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuList from './components/MenuList';
import SidebarToggle from './components/SidebarToggle';
import SidebarResizer from './components/SidebarResizer';

// Pages
import Home from './pages/Home';
import Telemetry from './pages/Telemetry';
import GuidanceControl from './pages/GuidanceControl';
import MissionPlanner from './pages/MissionPlanner';
import PlugIns from './pages/PlugIns';
import Settings from './pages/Settings';

const { Sider, Content } = Layout;

/* App Component 
Justin: I like how you broke down the buttons into modular 
locations and marked it it as pages/components  
What I'm going to have you do is migraet the c
*/
function App() {
  const [siderWidth, setSiderWidth] = useState(260);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={siderWidth} className="sidebar" collapsible collapsed={collapsed} trigger={null}>
          <MenuList />
          <SidebarToggle collapsed={collapsed} setCollapsed={setCollapsed} />
          <SidebarResizer collapsed={collapsed} siderWidth={siderWidth} setSiderWidth={setSiderWidth} />
        </Sider>

        <Layout>
          <Content style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
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
    </Router>
  );
}

export default App;
