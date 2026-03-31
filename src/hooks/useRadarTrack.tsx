import { useEffect, useState } from 'react';
 
export interface RadarTrack {
    id: number;
    az: number;
    el: number;
    range: number;
    vx: number;
    vy: number;
    vz: number;
}
 
export function useRadarTrack(): RadarTrack | null {
    const [track, setTrack] = useState<RadarTrack | null>(null);
 
    useEffect(() => {
        const ws = new WebSocket('ws://10.10.70.80:9001');
 
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as RadarTrack;
                setTrack(data);
            } catch (e) {
                console.error('Failed to parse track data:', e);
            }
        };
 
        ws.onerror = (err) => console.error('WebSocket error:', err);
        ws.onclose = () => console.log('WebSocket closed');
 
        return () => ws.close();
    }, []);
 
    return track;
}