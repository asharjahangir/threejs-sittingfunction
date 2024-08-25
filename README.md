# ThreeJS Sitting functionality for Animated GLB characters
An automated sitting feature for characters in the ThreeJS environment.
## Example
The user clicks the sit button, the character navigates around the seat and sits on the seat.
![image](https://github.com/user-attachments/assets/f64b5ed2-6dc2-46da-b3e5-d7d8cb008a01)
## Getting Started
There is only one file called the sit.js file which has all the code for the sitting functionality.
### Character
The GLB character should have at least 2 animations embedded into it:
* Walking animation
* Sitting animation
Other than that the character should have some sort of a character controller or a movement script that would allow the character to move around the scene.
### Scene
A scene needs to be set up beforehand with the character inside the scene. 
### Seats
The front of the seat is detected based on if the seat is faced towards the front on the Z-axis, otherwise the character would clip through the seat. The height of the seat is taken into account with a dedicated height detection system that would allow the character to sit at various heights on different types of seats
### Other characters
Other characters have been taken into account, you may add all characters in an array and if the program detects that there is another character sitting on the nearest seat then there will not be a sitting button on that seat for the character to sit on.
## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/asharjahangir/threejs-sittingsystem/blob/main/LICENSE) file for details.
## Supplementary information
This project is not being actively developed. It was created in a short timespan therefore lacks certain features.
