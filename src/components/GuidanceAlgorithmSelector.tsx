import React, { useState } from 'react';
import { Card, Select, Typography, Space, Tag } from 'antd';
import { ControlOutlined, DashboardOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface AlgorithmResponse {
  accepted: boolean;
  status: string;
  algorithm: string;
  message: string;
}

const GuidanceAlgorithmSelector: React.FC = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>('None');
  const [currentStatus, setCurrentStatus] = useState<string>('Idle');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [lastAccepted, setLastAccepted] = useState<boolean | null>(null);

  const handleAlgorithmChange = async (value: string) => {
    setLoading(true);
    setLastResponse('');
    
    try {
      const res = await fetch('http://localhost:5001/set_algorithm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ algorithm: value }),
      });
      
      const data: AlgorithmResponse = await res.json();
      
      setLastAccepted(data.accepted);
      setLastResponse(data.message);
      
      if (data.accepted) {
        setCurrentAlgorithm(data.algorithm);
        setCurrentStatus(data.status);
      }
      
    } catch (err) {
      setLastAccepted(false);
      setLastResponse('Connection error - server unreachable');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#52c41a';
      case 'Rejected': return '#ff4d4f';
      case 'Error': return '#ff4d4f';
      case 'Idle': return '#8c8c8c';
      default: return '#8c8c8c';
    }
  };

  const getAlgorithmColor = (algo: string) => {
    switch (algo) {
      case 'LTC': return 'blue';
      case 'MPC': return 'green';
      case 'Other': return 'orange';
      default: return 'default';
    }
  };

  return (
    <Card title="Guidance Algorithm" style={{ maxWidth: 500, margin: '0 auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <ControlOutlined style={{ fontSize: 20 }} />
            <Text strong>Select Algorithm:</Text>
          </Space>
          
          <Select
            value={currentAlgorithm}
            onChange={handleAlgorithmChange}
            loading={loading}
            disabled={loading}
            style={{ width: '100%' }}
            size="large"
          >
            <Option value="LTC">LTC (Linear Time Controller) </Option>
            <Option value="MPC">MPC (Model Predictive Controller) </Option>
            <Option value="Other">Other Controller Type</Option>
          </Select>
        </div>

        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <DashboardOutlined style={{ fontSize: 20 }} />
            <Text strong>Current Status:</Text>
          </Space>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16, 
            background: '#f5f5f5', 
            borderRadius: 4 
          }}>
            <Tag color={getAlgorithmColor(currentAlgorithm)} style={{ fontSize: 16, padding: '4px 16px' }}>
              {currentAlgorithm}
            </Tag>
            
            <Tag color={getStatusColor(currentStatus)} style={{ fontSize: 14 }}>
              {currentStatus}
            </Tag>
          </div>
        </div>

        {lastResponse && (
          <div style={{ 
            padding: 12, 
            background: lastAccepted ? '#f6ffed' : '#fff2f0', 
            borderRadius: 4,
            border: `1px solid ${lastAccepted ? '#b7eb8f' : '#ffccc7'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {lastAccepted ? (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
            )}
            <Text style={{ color: lastAccepted ? '#389e0d' : '#cf1322' }}>
              {lastResponse}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default GuidanceAlgorithmSelector;
