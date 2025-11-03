# 10-27-2025
- Very good modularity on separating the components and pages as well as following the wireframe
- Switched files from JS to Typescript allows us to do typing for variables and components (easier for troubleshooting future bugs and code consistency)
- Added Example creating button widgets
- Included some documentation for installing extra things

## Next weeks tasks 10-27 to 11-3
- Siya:
    - From Telemetry.tsx and SidebarResizer update other pages with typing like React 
    - Build up Telmetry panels from wireframe with React:
        - Going to need to figure out a gps/map module that can be predownloaded to show location of drone when flying
        - Might need to include a status to show we are connected to the drone from the pane
        - Rotation of Drone/Animation Three.js as framework https://eyes.nasa.gov/apps/mars2020/#/home
- Justin -> Socket ROS2 to React with barebones example on updating telemetry 


# Notes Justin 11/2/2025
- I added an additional library to interact with ROS2 using Javascript
- Might need to allow user to change the topic name for telemetry of drone? -> Future
- Need to understand more of this React lingo   
- From ros2_trajectory_docker need to branch from the react branch
- Need to clean up file directories and modules