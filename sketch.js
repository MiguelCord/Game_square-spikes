//var background;
var player;
var ground;
var ceiling
var spikes;
var levels;
//var clouds;

var livesSprite;
var blockSprite;
var start = true;
var gameOver = false;
var ground_Y = 430;
var ceiling_y = -10;
var min_opening = 210;

/********Action variables*******/
var GRAVITY = 0.5;
var jump = 20;
var speed = 10;
var jumping = false;
var touchIsDown = true;

var lvl = 1;
// 1 is purple, 2 is blue.

function preload() {
    /************IMAGES************/
    spikesImg = loadImage("images/spikes_2.png"); 
    spikesImgBlue = loadImage("images/spikes_blue.png");
    levelsImg = loadImage("images/level.png");
    
    /************SOUND************/
    mySound = loadSound ("assets/jump.wav");
    game_over = loadSound ("assets/game_over.wav");
    bg_music = loadSound ("assets/bg_music.mp3");
}

function setup() {
    var myCanvas = createCanvas(960, 420);
    myCanvas.parent("myP5Container");
    myCanvas.style("position", "relative");
        
    /********SOUND*********/
    bg_music.play();
    
    /********LEVELS*******/
    levels = new Group();
    
    var level = createSprite(width/2, height/2, 0, 0);
    level.addImage(levelsImg);
    levels.add(level);
    
    /*******BACKGROUND******/
    /*var img = loadImage("images/clouds.png");
    clouds = createSprite(width/2, height/2, 0, 0);
    clouds.addImage(img);*/
    
    /********CEILING******/
    ceiling = createSprite(0, ceiling_y, width * 4, height/5);
    ceiling.shapeColor = color(229, 203, 179);
    
    /********GROUND*******/
    ground = createSprite(0, ground_Y, width * 4, height/4);
    ground.shapeColor = color(229, 203, 179);
    
    /********PLAYER*******/
    player = createSprite(100, height - 41, 80, 80);
    player.shapeColor = color(255, 77, 77);
    //player.debug = true;
    
    /********SPIKES*******/
    spikes = new Group();    
}
/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
*/
function draw() {
    background("lightblue");
/*  var cloud = createSprite(width/2, height/2, 0, 0);
    cloud.addImage(cloudsImg);
    clouds.add(cloud);
    
   /*
        fill("black");
        textSize(50);
        textAlign(CENTER);
        text("Choose a difficulty level", width/2, 100);
        textSize(25);
        text("Easy ----- 1", 0, 150, width, 50);
        text("Medium --- 2", 0, 200, width, 50);
        text("Hard ----- 1", 0, 250, width, 50);
    */
        
    if (gameOver && keyWentDown("y") ){ 
        newGame();  
    }
    
    if (start) 
        drawSprites(levels);
    
    if(keyWentDown("1")|| touchIsDown ) {
        lvl = 1;
        start = false;
        
    } 
    else if(keyWentDown("2") ) {
        lvl = 2;
        start = false;
    } 
    else if(keyWentDown("3") ) {
        lvl = 3;
        start = false;
    } 
    
    console.log(start, gameOver);
    
    if (!start) { 
        if (!gameOver) {

            /**************JUMP*******************/
            if (keyDown("space") && !jumping) {
                player.velocity.y = -jump;
                jumping = true; 
                mySound.setVolume(0.1);
                mySound.play();
            } 
            
            if (touchIsDown && !jumping) {
                player.velocity.y = -jump;
                jumping = true; 
                mySound.setVolume(0.1);
                mySound.play();
            } 

            player.velocity.y += GRAVITY;
            if (player.collide(ground) ) {
                player.velocity.y = 0;
                if (jumping) jumping = false;
            }

            if (player.collide(ceiling) ) {
                player.velocity.y = 0;
                if (jumping) jumping = false;
                mySound.pause();

            }

            if (keyDown("z") && jumping ) {
                GRAVITY = 0;  
            } else {
                GRAVITY = 1;
            }
            
            if (touchIsDown && jumping ) {
                touchStarted();  
            } else {
                GRAVITY = 1;
            }
            
            /****************Player*****************/
            if (player.overlap(spikes))
                die();

            /****************Spawn spikes*****************/        
            if (frameCount%50 == 0) {           //Floor Spikes
                var spikeH = random(50, 300);
                var spike = createSprite(player.position.x + 800 + spikeH, height - 75, 80, 80);
                if (lvl == 1) spike.addImage(spikesImg);
                else if (lvl == 2) spike.addImage(spikesImgBlue);
                spikes.add(spike);
                //if (lvl == 3) spike.velocity.x = -8;
                spike.velocity.x = -5;
                spike.setCollider("circle", 0, 0, 15, 15);
                spike.debug = true;
            }

            if (spikeH < 200) {                //ceiling spikes
                spikeH = height - (height - ground_Y - 240) - (spikeH +min_opening);
                spike = createSprite(player.position.x + 800 + spikeH, height - 355, 80, 80);
                spike.mirrorY(-1);
                if (lvl == 1) spike.addImage(spikesImg);
                else if (lvl == 2) spike.addImage(spikesImgBlue);
                spikes.add(spike);
                //if (lvl == 3) spike.velocity.x = -8;
                spike.velocity.x = -5;
                spike.setCollider("circle", 0, 0, 15, 15);
                spike.debug = true;
            }

            drawSprite(player); 
            drawSprite(ground);
            drawSprite(ceiling);
            drawSprites(spikes);
            //drawSprites(clouds);
        }
        else {
            background("black");
            fill("white");
            textSize(50);
            textAlign(CENTER);
            text("GAME OVER", width/2, 150);
            textSize(25);
            text("Would you like to play again?", 0, 180, width, 50);
            text("Y/N", width/2, 240);
        }  
    }
}

function die() {
    updateSprites(false);
    gameOver = true;
    game_over.play();
    bg_music.stop();
   
}

function newGame() {
    spikes.removeSprites();
    //player.removeSprites();
    gameOver = false;
    updateSprites(true);
    player.update();
    bg_music.play();
    start = true;   
}

function touchStarted() {
    if (touchIsDown && jumping ) {
                GRAVITY = 0;  
            }
}

/*
function bg() {
    clouds = createSprite(width/2, height/2, 0, 0);
    clouds.addImage(img);
}

/*
function bg() {
    var size = 40;
        for (var x = 0; x <= width; x += size) {
                for (var y = 0; y <= height; y += size) {
                    var cloud = createSprite(width/2, height/2, 0, 0);
                    cloud.addImage(cloudsImg);
                    clouds.add(cloud);
                }
            }
}
*/


