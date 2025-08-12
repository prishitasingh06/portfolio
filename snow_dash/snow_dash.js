const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const replay_botton = document.getElementById("replay_botton");

let snowboarder;
let obstacle_objects;
let frame;
let game_score;
let f_game_end;
let animation_id;

const keys = {
  left: false,
  right: false,
  space: false
};

// Defining my emojis and their size
const snowboarder_emoji = "🏂";
const obstacleEmojis = ["🏔️", "🪨", "🗻"];
const emojiSize = 50;

// Function to initialize game state
function f_init() 
{
  snowboarder = {
    x: 100,
    y: 300,
    width: emojiSize,
    height: emojiSize,
    speed: 5,
    velocityY: 0,
    gravity: 0.5,
    isJumping: false
  };

  obstacle_objects = [];
  frame = 0;
  game_score = 0;
  f_game_end = false;

  replay_botton.style.display = "none";
  animation_id = requestAnimationFrame(f_game_loop);
}

// Event listeners for key controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") keys.space = false;
});

// Function for creating new obstacles at regular intervals
function f_create_obstacle() 
{
  if (frame % 100 === 0) 
  {
    const yPos = 300 + Math.random() * 30;
    obstacle_objects.push({
      x: canvas.width,
      y: yPos,
      width: emojiSize,
      height: emojiSize,
      speed: 3 + Math.random() * 2,
      emoji: obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)]
    });
  }
}

// Function to update obstacle positions and remove off-screen ones
function f_update_obstacles() 
{
  obstacle_objects.forEach(ob => (ob.x -= ob.speed));
  obstacle_objects = obstacle_objects.filter(ob => ob.x + ob.width > 0);
}

// Function to draw the snowboarder emoji on screen
function f_draw_snowboarder() 
{
  ctx.font = `${emojiSize}px serif`;
  ctx.textBaseline = "top";
  ctx.fillText(snowboarder_emoji, snowboarder.x, snowboarder.y);
}

// Function to draw all obstacle emojis on screen
function f_draw_obstacles() 
{
  ctx.font = `${emojiSize}px serif`;
  ctx.textBaseline = "top";
  obstacle_objects.forEach(ob => {
    ctx.fillText(ob.emoji, ob.x, ob.y);
  });
}

// Function to detect if the snowboarder touches any obstacle
function f_check_collisions() 
{
  for (const ob of obstacle_objects) 
  {
    if (
      snowboarder.x < ob.x + ob.width &&
      snowboarder.x + snowboarder.width > ob.x &&
      snowboarder.y < ob.y + ob.height &&
      snowboarder.y + snowboarder.height > ob.y
    ) 
    {
      return true;
    }
  }
  return false;
}

// Function to show the current score
function f_draw_score() 
{
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Current score: " + game_score, 10, 30);
}

// Function to handle movement and jump input
function f_handle_input() 
{
  if (keys.left) snowboarder.x -= snowboarder.speed;
  if (keys.right) snowboarder.x += snowboarder.speed;

  // Clamp position to canvas bounds
  if (snowboarder.x < 0) snowboarder.x = 0;
  if (snowboarder.x + snowboarder.width > canvas.width)
    snowboarder.x = canvas.width - snowboarder.width;

  // Handle jump
  if (keys.space && !snowboarder.isJumping) 
  {
    snowboarder.velocityY = -10;
    snowboarder.isJumping = true;
  }
}

// Function to apply gravity and jump physics
function f_apply_physics() 
{
  snowboarder.y += snowboarder.velocityY;
  snowboarder.velocityY += snowboarder.gravity;

  if (snowboarder.y >= 300) 
  {
    snowboarder.y = 300;
    snowboarder.velocityY = 0;
    snowboarder.isJumping = false;
  }
}

// Main game loop
function f_game_loop() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  f_handle_input();
  f_apply_physics();
  f_draw_snowboarder();

  f_create_obstacle();
  f_update_obstacles();
  f_draw_obstacles();

  f_draw_score();

  if (f_check_collisions()) 
  {
    f_game_end = true;
    cancelAnimationFrame(animation_id);
    ctx.fillStyle = "blue";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over!", 280, 200);
    replay_botton.style.display = "inline-block";
    return;
  }

  game_score++;
  frame++;
  animation_id = requestAnimationFrame(f_game_loop);
}

// Replay button click listener
replay_botton.addEventListener("click", () => 
{
  f_init();
});

// Start the game
f_init();
