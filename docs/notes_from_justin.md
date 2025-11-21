# 10-27-2025
- Very good modularity on separating the components and pages as well as following the wireframe
- Switched files from JS to Typescript allows us to do typing for variables and components (easier for troubleshooting future bugs and code consistency)
- Added Example creating button widgets
- Included some documentation for installing extra things

## Next weeks tasks 10-27 to 11-3
- Siya:
    - [x] From Telemetry.tsx and SidebarResizer update other pages with typing like React 
    - [x] Build up Telmetry panels from wireframe with React:
        -[] Going to need to figure out a gps/map module that can be predownloaded to show location of drone when flying
        -[] Might need to include a status to show we are connected to the drone from the pane
        -[] Rotation of Drone/Animation Three.js as framework https://eyes.nasa.gov/apps/mars2020/#/home
    - [ ] Update Justin's bad code to get the information that we need for ROS2 
- [x] Justin -> Socket ROS2 to React with barebones example on updating telemetry 


# Notes Justin 11/2/2025
- I added an additional library to interact with ROS2 using Javascript
- Might need to allow user to change the topic name for telemetry of drone? -> Future
- Need to understand more of this React lingo   
- From ros2_trajectory_docker need to branch from the react branch
- Need to clean up file directories and modules

```mermaid
AS LONG AS YOU'RE ON THE SAME NETWORK
Computer with ROS 2                 Computer w/ no ROS2
ROS 2 -> Rosbridge <------------>  ROSLIBJS -> React APP 
a
```

## Tasks 11-3-2025
- [X] Update Justin's bad code to fix the layout
- [] Work on GPS Widget (2D) - Figure out Leaflet (DONE), How Leaflet Works (DONE), How to Draw Stuff (Intitially focus on drawing anything, will eventually be an arrow following the trajectory of the drone), Figure out how to add New ROS2 Topic (Subscribe to GPS Topic of Drone)
- [X] How to update the map based on position 
	- Mock up position of the drone and have GPS Telemetry update the position/icon - for coordinates, just interate through a loop of coordinates (or hard code, but loop makes more sense) so we can see the movement. No ROS2 connection for now, will incorporate later. Have the Card relay the updating position
	- We want to see the icon update its position continuously
- [] Figure out auto-resizing and how to make UI do that for various screen types
-[X] Going to need to figure out a gps/map module that can be predownloaded to show location of drone when flying
-[X] Might need to include a status to show we are connected to the drone from the pane
-[] Rotation of Drone/Animation Three.js as framework https://eyes.nasa.gov/apps/mars2020/#/home 
- Justin -> Socket ROS2 to React with barebones example on updating telemetry 


For DJI drones
- DJI Fly App (for DJI RC and RC Pro): This is the most straightforward option for users with a DJI RC or RC Pro controller. The standard app allows you to download and cache maps of specific areas for offline use.
- Litchi for DJI Drones: This third-party application offers advanced waypoint mission planning and supports offline mapping. It is a popular choice for pilots who need more control and offline functionality beyond the standard DJI app.
- Map Pilot Pro: For professional photogrammetry and mapping, this iOS app lets you cache basemaps for offline operations and import custom terrain data. It is fully capable of offline functionality.
- UgCS: This professional mission planning tool is excellent for complex missions and challenging terrain. The free UgCS Open version includes offline map functionality and supports various drone brands, including DJI. 
For open-source platforms (ArduPilot/PX4)
- QGroundControl: The standard ground control software for drones using ArduPilot or PX4 flight controllers. It supports offline map caching and offers unmatched customization for advanced users.
- UgCS: With its broad platform support, UgCS works for drones with ArduPilot flight controllers. The free UgCS Open version is excellent for offline mapping in remote areas. 