var width = window.innerWidth,
	height = window.innerHeight,
	k = 15,
	cubeLength = 250,
	deg = 0,
	speed = 10,
	balls = [],
	ballRadius = 6,
	numberOfBalls = 5,
	points = [],
	pointRadius = 2,
	numberOfPoints = 500,
	camera, scene, renderer, tree;

init();
animate();


function init() {
	setupEnv();
	createCube();
	createMovingBalls();
	createHiddenRandomPoints();
	tree = new kdTree(points, distance, ["x", "y", "z"]);
}

function animate() {
	requestAnimationFrame(animate);
	rotateCamera();
	moveBalls();
	renderer.render(scene, camera);
}

function createCube() {
	var geometry = new THREE.CubeGeometry(cubeLength, cubeLength, cubeLength);
	var material = new THREE.MeshBasicMaterial({
		color: 0xa3a3a3,
		wireframe: true,
		wireframeLinewidth: 1
	});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
}

function createMovingBalls() {

	var geometry = new THREE.SphereGeometry(ballRadius, 30, 30);

	for (var i = 0; i < numberOfBalls; i++) {
		var material = new THREE.MeshBasicMaterial({
			color: Math.floor(Math.random() * 16777215)
		});
		var sphere = new THREE.Mesh(geometry, material);
		var ball = {
			sphere: sphere,
			activePoints: [],
			activeLines: [],
			xSpeed: Math.random() - 0.5,
			ySpeed: Math.random() - 0.5,
			zSpeed: Math.random() - 0.5
		};
		sphere.position.x = getRandomValue();
		sphere.position.y = getRandomValue();
		sphere.position.z = getRandomValue();
		scene.add(sphere);
		balls.push(ball);
	}
	console.log(balls[0]);

}

function createHiddenRandomPoints() {

	var geometry = new THREE.SphereGeometry(pointRadius, 10, 10);
	var material = new THREE.MeshBasicMaterial({
		color: Math.floor(Math.random() * 16777215)
	});

	for (var i = 0; i < numberOfPoints; i++) {
		var sphere = new THREE.Mesh(geometry, material);
		var point = {
			sphere: sphere,
			id: i
		};
		sphere.position.x = getRandomValue();
		sphere.position.y = getRandomValue();
		sphere.position.z = getRandomValue();
		sphere.visible = false;
		scene.add(sphere);
		points.push(point);
	}
}

function rotateCamera() {
	deg = (deg + 0.4) % 360;
	camera.position.x = Math.cos(deg * Math.PI / 180) * 300;
	camera.position.z = Math.sin(deg * Math.PI / 180) * 300;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function moveBalls() {
	balls.forEach(function (ball) {
		var position = ball.sphere.position;
		position.x += ball.xSpeed * speed;
		position.y += ball.ySpeed * speed;
		position.z += ball.zSpeed * speed;
		if (Math.abs(position.x) > (cubeLength / 2)) ball.xSpeed *= -1;
		if (Math.abs(position.y) > (cubeLength / 2)) ball.ySpeed *= -1;
		if (Math.abs(position.z) > (cubeLength / 2)) ball.zSpeed *= -1;
		showKNearestPointsForBall(ball);
	});
}

function showKNearestPointsForBall(ball) {
	ball.activePoints.forEach(function (point) {
		point.sphere.visible = false;
	});
	ball.activePoints = [];
	ball.activeLines.forEach(function (line) {
		scene.remove(line);
	});
	ball.activeLines = [];
	var nearest = findNearest(ball);
	nearest.forEach(function (near) {
		var point = near[0];
		if (!point.sphere.visible) {
			point.sphere.visible = true;
			point.sphere.material = ball.sphere.material;
			ball.activePoints.push(point);

			// debugger;
			var material = new THREE.LineBasicMaterial();
			material.color = ball.sphere.material.color;
			var geometry = new THREE.Geometry();
			geometry.vertices.push(ball.sphere.position);
			geometry.vertices.push(point.sphere.position);
			var line = new THREE.Line(geometry, material);
			scene.add(line);
			ball.activeLines.push(line);
		}
	});
}

function distance(a, b) {
	if (!a.hasOwnProperty('sphere')) return 0;
	var dx = a.sphere.position.x - b.sphere.position.x;
	var dy = a.sphere.position.y - b.sphere.position.y;
	var dz = a.sphere.position.z - b.sphere.position.z;
	return dx * dx + dy * dy + dz * dz;
}

function findNearest(ball) {
	return tree.nearest(ball, k);
}

function getRandomValue() {
	return Math.random() * cubeLength - cubeLength / 2;
}

function setupEnv() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
	scene = new THREE.Scene();
}

function onWindowResize() {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}