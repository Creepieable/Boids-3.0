class Boid{

    constructor(x, y){
        this.pos = createVector(x, y);
		this.posOld = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(2, 4));
		this.acc = createVector(0,0);

		this.visionRad = 100;
		this.maxSpeed = 4;
		this.maxSeparationForce = .3;
		this.maxCohesionForce = .2;
		this.maxAlignmentForce = .2;
		this.size = 5;
    }

	flock(flock){
		let neigbors = this.getNeigborhood(flock, this.visionRad)
		
		let separation = this.separate(neigbors);
		let alignment = this.align(neigbors);
		let coherence = this.cohere(neigbors);
		
		this.acc.add(separation);
		this.acc.add(alignment);
		this.acc.add(coherence);
	}

	getNeigborhood(flock, vision){
		let neigborhood = [];
		
		for(let member of flock){
			if(member == this) continue;			
			if(this.pos.dist(member.pos) <= vision) neigborhood.push(member);
		}
		return neigborhood;
	}

    //boid updating
    update(){
        this.vel = this.vel.add(this.acc);
		this.posOld = createVector(this.pos.x, this.pos.y);
		this.pos = this.pos.add(this.vel);
		this.vel.limit(this.maxSpeed);
		this.acc.mult(0);

        this.wrapCanvas();
    }

	wrapCanvas(){
		if(this.pos.x > width){
			this.pos.x = 0;
		}
		if(this.pos.x < 0){
			this.pos.x = width;
		}
		if(this.pos.y > height){
			this.pos.y = 0;
		}
		if(this.pos.y < 0){
			this.pos.y = height;
		}
	}

	//screen drawing
    draw(color) {
        stroke(color);
		noFill();

        let heading = this.vel.heading();
        Boid.darwTriangleBoid(this.pos.x, this.pos.y, heading, this.size);
    }

	static darwTriangleBoid(x, y,rad, size){
		triangle(
		x, y,
		rotateAround(-1*size,1*size, rad).x + x, rotateAround(-1*size, 1*size, rad).y + y,
		rotateAround(2*size, 0, rad).x + x, rotateAround(2*size, 0, rad).y + y);
		  
		triangle(
		x, y,
		rotateAround(-1*size, -1*size, rad).x + x, rotateAround(-1*size, -1*size, rad).y + y,
		rotateAround(2*size, 0, rad).x + x, rotateAround(2*size, 0, rad).y + y);
			
		triangle(
		x, y,
		rotateAround(-1*size, 1*size, rad).x + x, rotateAround(-1*size, 1*size, rad).y + y,
		rotateAround(-.5*size, 0, rad).x + x, rotateAround(-.5*size, 0, rad).y + y);

		triangle(
		x, y,
		rotateAround(-1*size, - 1*size, rad).x + x, rotateAround(-1*size, -1*size, rad).y + y,
		rotateAround(-.5*size, 0, rad).x + x, rotateAround(-.5*size, 0, rad).y + y);
	}
	
	//flocking steering forces
	separate(boids){
		let steering = createVector(0,0);
		
		for(let other of boids){
			let diff = p5.Vector.sub(this.pos, other.pos);
			
			let dist = this.pos.dist(other.pos);
			diff.div(dist * dist);
			
			steering.add(diff);
		}
		
		if(boids.length > 0){
			steering.div(boids.length);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxSeparationForce);
		}
		
		return steering;
	}
	
	align(boids){
		let steering = createVector(0,0);
		
		for(let other of boids){
			steering.add(other.vel);
		}
		
		if(boids.length > 0){
			steering.div(boids.length);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxAlignmentForce);
		}
		
		return steering;
	}
	
	cohere(boids){
		let steering = createVector(0,0);
		
		for(let other of boids){
			steering.add(other.pos);
		}
		
		if(boids.length > 0){
			steering.div(boids.length);
			steering.sub(this.pos);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxCohesionForce);
		}
		
		return steering;
	}
}

//heper function for drawing Triangle boid
///rotates point arround origin
function rotateAround(x, y, rad){
    let x1 = x*cos(rad) - y*sin(rad);
    let y1 = y*cos(rad) + x*sin(rad);
    
    return createVector(x1,y1);
}