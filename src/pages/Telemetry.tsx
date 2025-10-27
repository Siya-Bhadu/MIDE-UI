
/**
 * Justin: We're going to update this page to use Typescript to allow type checking
 * I'd like you to do this for all the other pages as well just   
 */

import React from 'react';
import Button from '../components/Button';

// Props is short for properties
interface TelemetryProps {}

// import Button from '../components/Button'

// This is to be used/expanded/changed for when we connect to the drone, might be moved later
class DroneConnection {
  /**
    - Just like CPP we can define methods, attributes as public, private, protected
    - Refer to the types of data allowed in Typescript documentation 
    */  
    public drone_name: string;

    private states: Float32List[];
    private isActive: boolean = false;
  
    constructor(drone_name: string, states: Float32List[] = []) 
    {
      this.drone_name = drone_name;
      this.states = states;
    }

    public updateStates(newStates: Float32List[]): void
    {
      this.states = newStates;
    }
    
  }

function Telemetry(props: TelemetryProps) {
  // Include buttons
  return (
    <div>
      <TelemetryContent />
    </div>
  );
}

function TelemetryContent() {
  return (
    <div>
      <h1>Telemetry</h1>
      <Button label="Refresh Data" onClick={() => console.log("Refreshing")} />
      <Button label="Export Data" color="green" onClick={() => console.log("Exporting")} />
    </div>
  );
}
export default Telemetry;
