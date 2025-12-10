// hooks/useRosTopic.ts
import { useState, useEffect } from 'react';
import ROSLIB from 'roslib';
import { useRos } from '../context/ros_context';

/**
 * Generic hook to subscribe to any ROS topic.
 * Just go to rosMsgs.tsx and add the message type in there of the new topic you want to use.
 * Then, use it in your component.
 */
export const useRosTopic = <T,>(
  topicName: string,
  messageType: string,
  queueSize = 1
) => {
  const { ros, isConnected } = useRos();
  const [data, setData] = useState<T | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    if (!ros || !isConnected) return;

    let topic: ROSLIB.Topic | null = null;

    try {
      topic = new ROSLIB.Topic({
        ros,
        name: topicName,
        messageType,
        queue_size: queueSize,
      });

      // ✨ CHANGED: Use 'any' to avoid TypeScript error with ROSLIB types
      const callback = (msg: any) => {
        setData(msg as T);
        setLastUpdate(Date.now());
      };

      topic.subscribe(callback);
      console.log(`[useRosTopic] Subscribed to ${topicName}`);

      return () => {
        if (topic) {
          try {
            topic.unsubscribe(callback);
            console.log(`[useRosTopic] Unsubscribed from ${topicName}`);
          } catch (e) {
            console.error(`[useRosTopic] Unsubscribe error:`, e);
          }
        }
      };
    } catch (e) {
      console.error(`[useRosTopic] Failed to subscribe to ${topicName}:`, e);
    }
  }, [ros, isConnected, topicName, messageType, queueSize]);

  return { data, lastUpdate };
};