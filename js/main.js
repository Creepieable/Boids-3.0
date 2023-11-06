let boids = [];
let grid;

//boid params
const boidcount = 500;
const boidVisionRad = 50;
const boidMaxSpeed = 2;
const boidMaxSeparationForce = .22;
const boidMaxCohesionForce = .2;
const boidMaxAlignmentForce = .2;
const boidSize = 3;

//debug
let showFramerate = true;
let showGrid = false;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	frameRate(60);
	
    //create all boids meta params
	for(let i = 0; i<boidcount; i++){
        let boid = new Boid(random(0, width), random(0, height))

        boid.visionRad = boidVisionRad;
		boid.maxSpeed = boidMaxSpeed;
		boid.maxSeparationForce = boidMaxSeparationForce;
		boid.maxCohesionForce = boidMaxCohesionForce;
		boid.maxAlignmentForce = boidMaxAlignmentForce;
		boid.size = boidSize;

        boids.push(boid);
	}

    //create grid vith boid vision rad
    grid = new Grid(boidVisionRad);
    grid.agents = boids;
}

function draw() {
    //fill frame
    background(20);

    //FPS text
    if(showFramerate) 
    {
        stroke(255);
        text(Math.round(frameRate()), 5,15);
    }
    //debugDraw
    if(showGrid) grid.draw();

    //update agents in grid
    grid.update();

    //handle boids
    for(let boid of boids){
        let neigbours = grid.getAgentsInNeigborhoodAt(boid.pos.x ,boid.pos.y);

		boid.flock(neigbours);
	}
    for(let boid of boids){
		boid.update();
        boid.draw();       
	}
}