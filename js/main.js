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

var bgColor;
var boidColor;

//debug
let showFramerate = false;
let showGrid = false;

let debugText = "";

function setup() {
    bgColor = color(40, 40, 40);
    boidColor = color(0, 255, 0);

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
    background(bgColor);

    //FPS text
    if(showFramerate) 
    {
        stroke(255);
        text(Math.round(frameRate()), 5,15);
    }

    stroke(255);
    text(debugText.toString(), 5,15);

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
        boid.draw(boidColor);       
	}
}

// Read changes made by users
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.schemecolor) {
            if (properties.schemecolor.value) {
                var bgCol = properties.schemecolor.value.split(' ');
                bgColor = color(parseFloat(bgCol[0]) * 255, parseFloat(bgCol[1]) * 255, parseFloat(bgCol[2]) * 255);
            }
        }

        if (properties.boid_color) {
            if (properties.boid_color.value) {
                var boidCol = properties.boid_color.value.split(' ');
                boidColor = color(parseFloat(boidCol[0]) * 255, parseFloat(boidCol[1]) * 255, parseFloat(boidCol[2]) * 255);
            }
        }


        if (properties.boidcount) {
            if (properties.boidcount.value !== "") {
                    // Do something with the slider value
            }
        }

        if (properties.cohesion) {
            if (properties.cohesion.value !== "") {
                for(let boid of boids){            
                    boid.maxCohesionForce = parseFloat(properties.cohesion.value);  
                }
            }
        }

        if (properties.separation) {
            if (properties.separation.value !== "") {
                for(let boid of boids){            
                    boid.maxSeparationForce = parseFloat(properties.separation.value);  
                }
            }
        }

        if (properties.alignment) {
            if (properties.alignment.value !== "") {
                for(let boid of boids){            
                    boid.maxAlignmentForce = parseFloat(properties.alignment.value);  
                }
            }
        }
        
        if (properties.maxspeed) {
            if (properties.maxspeed.value !== "") {
                for(let boid of boids){            
                    boid.maxSpeed = parseFloat(properties.maxspeed.value);  
                }
            }
        }

        if (properties.visionradius) {
            if (properties.visionradius.value !== "") {
                for(let boid of boids){            
                    boid.visionRad = parseFloat(properties.visionradius.value);  
                }
            }
        } 
    }
}