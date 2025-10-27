import { MenuOutlined } from '@ant-design/icons';

const SidebarToggle = ({ collapsed, setCollapsed }) => {
  return (
    <MenuOutlined
      onClick={() => setCollapsed(!collapsed)}
      className="hamburger-toggle"
    />
  );
};

export default SidebarToggle;
