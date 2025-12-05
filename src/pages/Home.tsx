import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";
import Resizable from "../components/Resizable";

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div className="home-wrapper">
      <div className="home-header">
        <Title level={2}>Home</Title>
        <StatusBadge />
      </div>

      <div>
        <Resizable />
      </div>
    </div>
  );
};

export default Home;
