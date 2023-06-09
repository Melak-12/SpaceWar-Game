const scoreEl=document.querySelector('#score');
const canvas = document.querySelector("canvas");
const ctx=canvas.getContext('2d')

canvas.width=1024
canvas.height=576

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0 
    this.opacity=1
    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }
  draw() {
    // ctxfillStyle='red'
    // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    // if(this.image)
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
    )
    ctx.rotate(this.rotation)
    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    ctx.restore()
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}


class Porjectile {
    constructor({position,velocity}){
        this.velocity=velocity
        this.position=position
        this.radius=4
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle='red'
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.velocity = velocity;
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    ctx.save()
    ctx.globalAlpha =this.opacity
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.fades==true)
    this.opacity -= 0.1
  }
}


class InvaderPorjectile {
  constructor({ position, velocity }) {
    this.velocity = velocity;
    this.position = position;
    this.width = 3;
    this.height = 10;
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}



class Invader {
  constructor({position}) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }
  draw() {
    // ctxfillStyle='red'
    // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    // if(this.image)
    
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

  }
  update({velocity}) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;

    }
  }

  shoot(invaderProjectiles){
    invaderProjectiles.push(new InvaderPorjectile({
        position: {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height
        },
        velocity:{
            x: 0,
            y: 5
        }
    }))
  }
}



class Grid {
    constructor(){
        this.position={
            x:0,
            y:0
        }
        this.velocity={
            x:3,
            y:0
        }

        this.invaders=[]

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width=columns*30
        for(let x=0; x < columns; x++){
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                        x: x * 30,
                        y: y * 30
            }})
                )
            }    
        }

    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y=0
        if(this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x = -this.velocity.x
            this.velocity.y=30
        }
    }
}



const player= new Player()
// player.draw()
const projectiles=[]
const grids=[]
const invaderProjectiles=[]
const particels=[]
// const invader = new Invader();
const keys = {
  l: {
    pressed: false,
  },
  r: {
    pressed: false,
  },
  s: {
    pressed: false,
  }
};

let frames=0
let randomInterval=Math.floor((Math.random() * 500) + 500)
let game={
    over: false,
    active: true
}
let score=0

for (let i = 0; i < 15; i++) {
  particels.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      },
      velocity: {
        x: 0,
        y: 0.3
      },
      radius: Math.random() * 2,
      color: 'white',
    })
  );
}


function createParticels({object, color, fades}){
    for(let i =0; i<15; i++){
        particels.push(
          new Particle({
            position: {
              x: object.position.x + object.width / 2,
              y: object.position.y + object.height / 2,
            },
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
            },
            radius: Math.random() * 3,
            color: color,
            fades: true
          })
        );
    }
}


function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)
    ctx.fillStyle='grey'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    // invader.update();
    player.update()

    particels.forEach((particel, i)=>{
        if(particel.position.y - particel.radius >=canvas.height){
            particel.position.x = Math.random() * canvas.width
            particel.position.y = -particel.radius
        }

        if(particel.opacity <= 0){
            setTimeout(()=>{
                particels.splice(i, 1)
            },0)
        }else{
            particel.update();
        }
    })

    invaderProjectiles.forEach((invaderProjectile, index)=>{
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)
            },0)
        }else{
        invaderProjectile.update()
        }

        if(invaderProjectile.position.y + invaderProjectile.height >=
            player.position.y && 
            invaderProjectile.position.x + invaderProjectile.width >=
            player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width){
                setTimeout(()=>{
                    invaderProjectiles.splice(index,1)
                    player.opacity=0
                    game.over=true
                },0)
                setTimeout(() => {
                  game.active = false
                  // alert("Game over\nReload to play again")
                  if (confirm("Game over With a score: "+score +"\nPress OK to play again")) {
                    window.location.reload();
                  }
                }, 2000);
                createParticels({
                    object: player,
                    color: 'white'
                })
            }
    })

    projectiles.forEach((projectile,index)=>{
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(()=>{
                projectiles.splice(index, 1)
            },0)
        }else{
        projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
      grid.update();
      if(frames % 100 === 0 && grid.invaders.length > 0){
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
      }   

      grid.invaders.forEach((invader, i) => {
        invader.update({ velocity: grid.velocity });
        projectiles.forEach((projectile, j) => {
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find((invader2) => {
                return invader2 === invader;
              });
              const projectileFound = projectiles.find((projectile2) => {
                return projectile2 === projectile;
              });

              if (invaderFound && projectileFound) {
                score+=100
                scoreEl.innerHTML = score
                createParticels({
                  object: invader,
                  color: "#BAA0DE",
                });

                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0];
                  const lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                } else {
                  grids.splice(gridIndex, 1);
                }
              }
            }, 0);
          }
        });
      });
    });

    if(keys.l.pressed && player.position.x >=0){
        player.velocity.x = -7
        player.rotation = -0.15
    }else if(keys.r.pressed && player.position.x + player.width <= canvas.width ){
        player.velocity.x = 7
        player.rotation = 0.15
    }else{
        player.velocity.x= 0
        player.rotation = 0
    }
    // console.log(frames)
    if (frames % randomInterval === 0) {
      grids.push(new Grid());
      randomInterval = Math.floor(Math.random() * 500 + 500);
      frames = 0;
    }

    frames++
}

animate()

addEventListener('keydown',({key})=>{
    if(game.over) return
    switch (key) {
      case "ArrowLeft":
        // player.velocity.x = -5
        keys.l.pressed = true;
        break;
      case "ArrowRight":
        keys.r.pressed = true;
        break;
      case " ":
        projectiles.push(
          new Porjectile({
            position: {
              x: player.position.x + player.width / 2, 
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );
        console.log( "space")
        keys.s.pressed = true;
        break;
    }
})

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      //   player.velocity.x = -5;
      keys.l.pressed = false;
      break;
    case "ArrowRight":
      keys.r.pressed = false;
      break;
    case " ":
      keys.s.pressed = false;
      break;
  }
});
