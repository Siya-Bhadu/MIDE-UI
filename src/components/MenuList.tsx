import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined, AreaChartOutlined, PayCircleOutlined, SettingOutlined } from '@ant-design/icons';

const MenuList = () => {
  return (
    <Menu theme="dark" mode="inline" className="menu-bar" selectable={false}>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="telemetry" icon={<AppstoreOutlined />}>
        <Link to="/telemetry">Telemetry</Link>
      </Menu.Item>
      <Menu.Item key="guidance_control" icon={<AreaChartOutlined />}>
        <Link to="/guidance_control">Guidance/Control</Link>
      </Menu.Item>
      <Menu.Item key="mission_planner" icon={<PayCircleOutlined />}>
        <Link to="/mission_planner">Mission Planner</Link>
      </Menu.Item>
      <Menu.Item key="plug_ins" icon={<AppstoreOutlined />}>
        <Link to="/plug_ins">Plug-Ins</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
