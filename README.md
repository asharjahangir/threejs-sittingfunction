# ThreeJS Sitting functionality for Animated GLB characters
An automated sitting feature for characters in the ThreeJS environment.
## Example
The user clicks the sit button, the character navigates around the seat and sits on the seat.
![GIF](https://github.com/user-attachments/assets/e15fe495-ca34-4c4f-b67d-c47eec5ca859)
## Getting Started
There is only one file called the sit.js file which has all the code for the sitting functionality.
### Scene
A scene needs to be set up beforehand with the character inside the scene. 
### Character
```
var player; // You need to add your player and assign it to this variable
```
The GLB character should have at least 2 animations embedded into it:
* Walking animation
* Sitting animation
  Other than that the character should have some sort of a character controller or a movement script that would allow the character to move around the scene.
### Seats
```
var seats; // You need to add your seats and put them inside an array and assign it to this variable
```
The front of the seat is detected based on if the seat is faced towards the front on the Z-axis, otherwise the character would clip through the seat. The height of the seat is taken into account with a dedicated height detection system that would allow the character to sit at various heights on different types of seats
### Other characters
```
var otherPlayers; // You need to add all other characters that you may want to account for inside an array and assign it to this variable
```
Other characters have been taken into account, you may add all characters in an array and if the program detects that there is another character sitting on the nearest seat then there will not be a sitting button on that seat for the character to sit on.
### Seat checker
```
var seatChecker; // You need to add an extra mesh or an object like a cube and set the visiblity to false and assign it to this variable
```
What the seatChecker does is it will check the height and depth of the nearest seat using raycasting so that the player will sit on the appropriate height regardless of the height of the seat. Remember to set the visiblity of this object to false so that the user cannot see it. The following is an extreme example where you can see in action:
![GIF](https://github.com/user-attachments/assets/c57370c6-9a30-405e-919f-ee25fd5a1eb4)
### Configuration
```
var moveSpeed = 0.03;
var rotateSpeed = 0.08;
var gap = 0.4;
```
Tweak these variables according to your liking depending on your movement speed and the distance you want to have between the character and the seat when it navigates around it.
## Built With
* [ThreeJS](https://threejs.org/) - A Javascript 3D library
## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/asharjahangir/threejs-sittingsystem/blob/main/LICENSE) file for details.
## Supplementary information
This project is not being actively developed. It was created in a short timespan therefore lacks certain features.
