import { useEffect, useState } from 'react';
 
// matches the JSON fields the broker sends
export interface RadarTrack {
    id: number;
    az: number;
    el: number;
    range: number;
    vx: number;
    vy: number;
    vz: number;
}
 
// custom hook that opens a WebSocket connection and returns live radar track data
// returns null if no data has arrived yet
export function useRadarTrack(): RadarTrack | null {
    const [track, setTrack] = useState<RadarTrack | null>(null);
 
    useEffect(() => {
        // connect to the bridge WebSocket server
        const ws = new WebSocket('ws://10.10.70.80:9001');
 
        ws.onmessage = (event) => {
            try {
                // parse the JSON string into a RadarTrack object and update state
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