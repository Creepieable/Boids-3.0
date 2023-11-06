let boids = [];
let grid;

//initial boid params
var boidcount = 500;
var boidVisionRad = 50;
var boidMaxSpeed = 2;
var boidMaxSeparationForce = .22;
var boidMaxCohesionForce = .2;
var boidMaxAlignmentForce = .2;
var boidSize = 3;
var boidColor;

var bgColor;

//debug
let showFramerate = false;
let showGrid = false;

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
    text(boids.length, 5,15);

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
                let newCount = parseInt(properties.boidcount.value);

                if(newCount < boids.length){
                    boids.splice(0, boids.length - newCount);
                }
                if(newCount > boids.length){
                    while(boids.length < newCount){
                        let boid = new Boid(random(0, width), random(0, height))
                
                        boid.visionRad = boidVisionRad;
                        boid.maxSpeed = boidMaxSpeed;
                        boid.maxSeparationForce = boidMaxSeparationForce;
                        boid.maxCohesionForce = boidMaxCohesionForce;
                        boid.maxAlignmentForce = boidMaxAlignmentForce;
                        boid.size = boidSize;
                
                        boids.push(boid);
                    }
                }
            }
        }

        if (properties.boid_cohesion) {
            if (properties.boid_cohesion.value !== "") {
                boidMaxCohesionForce = parseFloat(properties.boid_cohesion.value);
                for(let boid of boids){            
                    boid.maxCohesionForce = boidMaxCohesionForce;  
                }
            }
        }

        if (properties.boid_separation) {
            if (properties.boid_separation.value !== "") {
                boidMaxSeparationForce  = parseFloat(properties.boid_separation.value);
                for(let boid of boids){            
                    boid.maxSeparationForce = boidMaxSeparationForce;  
                }
            }
        }

        if (properties.boid_alignment) {
            if (properties.boid_alignment.value !== "") {
                boidMaxAlignmentForce = parseFloat(properties.boid_alignment.value)
                for(let boid of boids){            
                    boid.maxAlignmentForce = boidMaxAlignmentForce;  
                }
            }
        }
        
        if (properties.boid_maxspeed) {
            if (properties.boid_maxspeed.value !== "") {
                boidMaxSpeed = parseFloat(properties.boid_maxspeed.value);
                for(let boid of boids){            
                    boid.maxSpeed = boidMaxSpeed;  
                }
            }
        }

        if (properties.boid_visionradius) {
            if (properties.boid_visionradius.value !== "") {
                boidVisionRad = parseFloat(properties.boid_visionradius.value); 
                for(let boid of boids){           
                    boid.visionRad = boidVisionRad;  
                }
            }
        } 
    }
}