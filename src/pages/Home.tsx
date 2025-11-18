import React from "react";
import { Typography } from "antd";
import StatusBadge from "../components/StatusBadge";

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div className="home-wrapper">
      <div className="home-header">
        <Title level={2}>Home</Title>
        <StatusBadge />
      </div>
    </div>
  );
};

export default Home;
