import React from "react";
import { MenuOutlined } from "@ant-design/icons";

type SidebarToggleProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({ collapsed, setCollapsed }) => {
  return (
    <MenuOutlined
      onClick={() => setCollapsed(!collapsed)}
      className="hamburger-toggle"
    />
  );
};

export default SidebarToggle;
