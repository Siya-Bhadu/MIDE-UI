import React, { useState } from 'react';
import { Button, Card, Alert, Statistic } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface ServiceResponse {
  success: boolean;
  message: string;
}

const ROS2SayHi: React.FC = () => {
  const [response, setResponse] = useState<ServiceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callCount, setCallCount] = useState(0);

  const callSayHiService = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:5000/say_hi', {
        method: 'POST',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: ServiceResponse = await res.json();
      setResponse(data);
      setCallCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error calling service:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="ROS2 Say Hi Service" style={{ marginTop: 16 }}>
      <Statistic 
        title="Service Calls Made" 
        value={callCount} 
        style={{ marginBottom: 16 }}
      />
      
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={callSayHiService}
        loading={loading}
        block
        size="large"
      >
        {loading ? 'Calling Service...' : 'Call Say Hi Service'}
      </Button>

      {response && (
        <Alert
          message="Service Response"
          description={response.message}
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {error && (
        <Alert
          message="Error"
          description={`${error} - Make sure ROS2 service and bridge are running!`}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );
};

export default ROS2SayHi;