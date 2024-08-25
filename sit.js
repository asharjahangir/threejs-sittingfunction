// Sitting function

// Object variables should be replaced with objects in the file directory
var player; // add your player path or object here
var seats;// add an array of seat objects here
// For the button, need to program so that only the current user is able to see the button just like "Hotspot", can also remove button and use seat model clickable
var sit; // add a sitting button path or object here
var otherPlayers; // add other players for exceptions // NPC & Other players (Replace with players in the server and NPC to check if Seats are occupied or not)
var seatChecker; // add a small cube object to act as a sensor to check the height of the seat
var smallestDistance, distance, closestSeat, closestSeatBB, seatHeight, offsetZ, seatBB, otherAvatarBB, seatObjectBB, sittingHeight;
smallestDistance = Infinity; // placeholder variable for the smallestDistance, it will be use to check which seat is closest to the avatar

var targetRotation = new THREE.Quaternion();



// Flags
var canSit = false;
var isButtonClicked = false;
var isRotating = false; // Flag to check if avatar should rotate

var operation = 1;

// Animation variables
const clock = new THREE.Clock();
const walkMixer = new THREE.AnimationMixer(player);
const sitMixer = new THREE.AnimationMixer(player);
const walkAction = walkMixer.clipAction(player.animations[0]); // walk animation
const sitAction = sitMixer.clipAction(player.animations[1]); // sit animation

//Control Variables (can change speed & gap between avatar and seat)
var moveSpeed = 0.03;
var rotateSpeed = 0.08;
var gap = 0.4;

// Initial properties for the SitButton
sit.scale.x = 0;
sit.scale.y = 0;
sit.visible = false;
sit.material.transparent = true;
sit.material.opacity = 0.85;

function update(event) {
	smallestDistance = Infinity;
	if (!canSit || operation == 0 && Math.abs(player.position.y - (sittingHeight - 0.25)) < 0.2) {
		for (var i = 0; i < seats.length; i++) { // calculate the distance for all of the seats in the Scene from the Avatar
			distanceCalculation(seats[i]);
		}
	}

	// Bounding boxes to determine the size and height of the seats
	closestSeatBB = new THREE.Box3();
	closestSeatBB.setFromObject(closestSeat);

	seatHeight = closestSeatBB.getSize(new THREE.Vector3()).y;
	seatCenter = new THREE.Vector3((closestSeatBB.max.x + closestSeatBB.min.x)/2,((closestSeatBB.max.y + closestSeatBB.min.y)/2),((closestSeatBB.max.z + closestSeatBB.min.z)/2));

	offsetZ = closestSeatBB.getSize(new THREE.Vector3()).z * 0.15;
	seatHeightChecker(closestSeat, seatHeight);

    //gap betwee
	var corners = [
		new THREE.Vector3(closestSeatBB.min.x - gap, player.position.y, closestSeatBB.max.z + gap),
		new THREE.Vector3(closestSeatBB.max.x + gap, player.position.y, closestSeatBB.max.z + gap),
		new THREE.Vector3(closestSeatBB.min.x - gap, player.position.y, closestSeatBB.min.z - gap),
		new THREE.Vector3(closestSeatBB.max.x + gap, player.position.y, closestSeatBB.min.z - gap)
	];

	// show button if near seats
	if (smallestDistance <= (closestSeatBB.getSize(new THREE.Vector3()).x + (closestSeatBB.getSize(new THREE.Vector3()).y / 2) + closestSeatBB.getSize(new THREE.Vector3()).z)) {

		if (sit.position.distanceTo(new THREE.Vector3(closestSeat.position.x, sit.position.y, closestSeat.position.z)) <= 5) {
			sit.position.lerp(new THREE.Vector3(closestSeat.position.x, sit.position.y, closestSeat.position.z), 0.2);
		}
		else {
			sit.position.copy(new THREE.Vector3(closestSeat.position.x, sit.position.y, closestSeat.position.z));
		}
		sit.position.y = sit.position.y + (seatHeight + 1 - sit.position.y) * 0.03;
		sit.scale.x = sit.scale.x + (0.8 - sit.scale.x) * 0.05;
		sit.scale.y = sit.scale.y + (0.8 - sit.scale.y) * 0.05;
		sit.visible = true;
	}
	else {
		sit.scale.x = sit.scale.x + (0 - sit.scale.x) * 0.05;
		sit.scale.y = sit.scale.y + (0 - sit.scale.y) * 0.05;
		if (sit.scale.x == 0 && sit.scale.y == 0) {
			sit.visible = false;
		}

	}

	if (canSit) {
		sit.position.y += (0 - sit.position.y) * 0.03;
		sit.scale.x += (0 - sit.scale.x) * 0.1;
		sit.scale.y += (0 - sit.scale.y) * 0.05;
		sit.material.opacity += (-1 - sit.material.opacity) * 0.03;
		if (sit.scale.x <= 0 && sit.scale.y <= 0) {
			sit.visible = false;
		}

		if (smallestDistance >= Math.abs(closestSeat.position.y) + 1) {
			walkAction.play();
			walkMixer.update(clock.getDelta());
		}

		var radius = corners[0].distanceTo(closestSeat.position);
		var distance = player.position.distanceTo(closestSeat.position);

		switch (operation) {
			case 1: // goes closer to the seat
				if (distance > radius) {
					// Calculate the direction to the closest seat
					var direction = new THREE.Vector3(closestSeat.position.x, player.position.y, closestSeat.position.z).clone().sub(player.position).normalize();

					// Create a quaternion representing the desired rotation
					var targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

					// Smoothly interpolate the current quaternion towards the target quaternion
					player.quaternion.slerp(targetQuaternion, rotateSpeed); // Adjust the factor for smoother rotation

					// Check if the rotation is close enough to proceed with movement
					if (player.quaternion.angleTo(targetQuaternion) < 0.1) { // Adjust threshold as necessary
						// Move the avatar towards the closest seat
						player.position.x += (closestSeat.position.x - player.position.x) * moveSpeed;
						player.position.z += (closestSeat.position.z - player.position.z) * moveSpeed;
					}
				} else {
					// Move away from the seat
					var away = player.position.clone().sub(closestSeat.position).normalize();
					away.y = 0; // Keep Y constant
					player.position.add(away.multiplyScalar(moveSpeed));

					// Rotate towards the seat
					direction = away.clone().normalize();
					player.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction), rotateSpeed);
				}

				if (distance <= radius + 0.1) {
					operation = 2;
				}
				break;
			case 2: // walks around the seat
				if (distance <= radius + 0.1 && !isRotating) {
					isRotating = true; // Start rotating
				}
				if (isRotating) {
					var pivot = closestSeat.position.clone();
					direction = player.position.clone().sub(pivot).normalize();
					var targetPosition = getPositionAhead(closestSeat, radius);

					// Rotate towards the target position
					var targetDirection = targetPosition.clone().sub(pivot).normalize();
					var angleToTarget = Math.atan2(targetDirection.z, targetDirection.x) - Math.atan2(direction.z, direction.x);
					var shortestAngle = THREE.MathUtils.euclideanModulo(angleToTarget + Math.PI, 2 * Math.PI) - Math.PI;
					var angle = moveSpeed; // Rotation speed

					// Rotate around the Y-axis (pivot)
					direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), shortestAngle > 0 ? -angle : angle);
					player.position.copy(pivot).add(direction.multiplyScalar(radius));

					// Keep the avatar facing the target position, locking rotation to Y-axis
					var finalDirection = targetPosition.clone().sub(player.position).normalize();
					finalDirection.y = 0; // Ignore Y component for forward direction
					finalDirection.normalize(); // Normalize the direction
					player.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), finalDirection); // Set rotation
				}

				// Check if close enough to the target position
				if (player.position.distanceTo(getPositionAhead(closestSeat, radius)) <= 1.2) {
					operation = 0; // Stop moving when close enough
				}
				break;

			case 0: // goes to the seat and sits down
				// Move towards the target position for sitting
				player.position.x += (getPositionAhead(closestSeat, (closestSeatBB.getSize(new THREE.Vector3()).z * 0.15)).x - player.position.x) * moveSpeed;
				player.position.z += (getPositionAhead(closestSeat, (closestSeatBB.getSize(new THREE.Vector3()).z * 0.15)).z - player.position.z) * moveSpeed;

				// Check vertical distance
				const verticalDistance = Math.abs(closestSeat.position.y - player.position.y);
				if (verticalDistance >= 1) {
					let direction = new THREE.Vector3(closestSeat.position.x, player.position.y, closestSeat.position.z).sub(player.position);
					player.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize()), 0.3);
				}

				// Smoothly rotate to match the seat's orientation
				targetRotation.copy(closestSeat.quaternion);
				const threshold = 0.1;
				if (player.quaternion.angleTo(targetRotation) > threshold) {
					player.quaternion.rotateTowards(targetRotation, rotateSpeed);
				} else {
					player.position.y += ((sittingHeight - 0.25) - player.position.y) * 0.06;

					// Transition to sitting
					if (Math.abs(player.position.y - (sittingHeight - 0.25)) < 0.2) {
						sitMixer.update(clock.getDelta());
						transitionToSit();
						console.log("Seated");
					}
				}
				break;
		}
	}
}

function getPositionAhead(object, units) {
	// Ensure the object has a valid position
	if (!object.position) {
		console.log("no");
	}

	// Get the object's forward direction
	var objDirection = new THREE.Vector3();
	object.getWorldDirection(objDirection);

	// Normalize the direction and multiply by the number of units
	objDirection.multiplyScalar(units);

	// Calculate the new position
	const newPosition = new THREE.Vector3();
	newPosition.copy(object.position).add(objDirection);

	return newPosition;
}

function distanceCalculation(seat) { // Determine the distance between avatar and seats to find the nearest one
	seatBB = new THREE.Box3().setFromObject(seat);

	distance = player.position.distanceTo(seat.position);

	if (distance < smallestDistance) {
		// Check if the seat is occupied by iterating over otherPlayers
		for (var i = 0; i < otherPlayers.length; i++) {
			otherAvatarBB = new THREE.Box3().setFromObject(otherPlayers[i]);
			if (otherAvatarBB.intersectsBox(seatBB)) {
				// Update smallestDistance and closestSeat to the next closest seat
				smallestDistance = Infinity;
				closestSeat = null;
				break;
			}
			else if (distance < smallestDistance) {
				smallestDistance = distance;
				closestSeat = seat;
			}
		}
	}
}

function seatHeightChecker(closestSeat, seatHeight) {
	const raycaster3 = new THREE.Raycaster(seatChecker.position, new THREE.Vector3(0, 1, 0));
	const intersects3 = raycaster3.intersectObject(closestSeat);

	seatChecker.position.copy(new THREE.Vector3(seatCenter.x, seatChecker.position.y, seatCenter.z));
	seatChecker.translateZ(offsetZ);
	if (intersects3.length > 0) {
		// Collision detected
		// closestSeat.visible = false;
		sittingHeight = seatChecker.position.y;
		seatChecker.position.y = seatHeight;
		seatChecker.quaternion.copy(closestSeat.quaternion);
		//seatChecker.translateZ(offsetZ);
		offsetZ = seatChecker.position;

	}
	else {
		// Decrease position until collision
		seatChecker.position.y -= 0.03;
	}
	offsetZ = seatChecker.position;

}

// Raycast for mouse click interaction
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.addEventListener('click', onMouseClick, false);

function onMouseClick(event) { // onMouseClick event to click on the Button
	var rect = renderer.domElement.getBoundingClientRect();
	var offsetX = event.clientX - rect.left;
	var offsetY = event.clientY - rect.top;

	mouse.x = (offsetX / rect.width) * 2 - 1;
	mouse.y = -(offsetY / rect.height) * 2 + 1;

	// Raycasting from the camera in the direction of the mouse
	raycaster.setFromCamera(mouse, camera);

	// Check for intersections with the 'sit' object
	var intersects = raycaster.intersectObject(sit);

	if (intersects.length > 0) { // if Button is clicked, the Avatar position shifts to the Seat postion (can add animation or loop to make it smoother)
		if (isButtonClicked) {
			// Button has been clicked
			canSit = true;
		} else { 
			isButtonClicked = true;
			canSit = false;

		}
	}
}

// Set up the transition time between walk and sit animations
const blendDuration = 0.8; // Adjust as needed

// Flag to keep track of whether the avatar is transitioning
let isTransitioning = false;

// Function to smoothly transition between walk and sit animations
function transitionToSit() {
	if (!isTransitioning) {
		isTransitioning = true;
		walkAction.crossFadeTo(sitAction, blendDuration, true);
		sitAction.play();
		walkMixer.update(clock.getDelta());
		walkAction.stop();
	}
}

// reset values if avatar moves (need to include touchscreen movement), the program should reset when avatar moves
function keydown( event ) {
	player.position.y = 0;
	canSit = false;
	sit.material.opacity = 0.85;
	isTransitioning = false;
	operation = 1;
}
