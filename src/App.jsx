import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Logo from './components/Logo';
import MenuList from './components/MenuList';

// Pages
import Home from './pages/Home';
import Telemetry from './pages/Telemetry';
import GuidanceControl from './pages/GuidanceControl';
import MissionPlanner from './pages/MissionPlanner';
import PlugIns from './pages/PlugIns';
import Settings from './pages/Settings';

const { Sider, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider className="sidebar" width={275}>
          <Logo />
          <MenuList />
        </Sider>

        <Layout>
          <Content style={{ padding: '20px', color: 'black', backgroundColor: 'white' }}>
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
