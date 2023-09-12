import { renderer_t } from "./renderer.js";
import { camera_t } from "./camera.js";
import { input_t } from "./input.js";
import { game_t } from "./game.js";
import { map_t } from "./map.js";
import { init_gl } from "./gl.js";
import { texture_preload } from "./texture.js";
import { playlist } from "./playlist.js";

function main(file)
{
  const canvas = document.getElementById("display");
  init_gl(canvas);
  
  const map = new map_t();
  const renderer = new renderer_t();
  const camera = new camera_t();
  const input = new input_t();
  const game = new game_t();
  
  map.import_file(file);
  renderer.load_map_play(map);
  
  map.listen("load", () => {
    game.no_clip = false;
    camera.position.x = 25.5;
    camera.position.y = 0.5;
    camera.position.z = 25.5;
    
    setInterval(function() {
      auto_resize(canvas);
      camera.set_aspect_ratio(canvas.height / canvas.width);
      
      game.move_camera(camera, input, map);
      
      const door = game.check_door(camera, map);
      if (door) {
        document.getElementById("door").style.visibility = "visible";
        document.getElementById("redirect").href = door.url;
      } else {
        document.getElementById("door").style.visibility = "hidden";
      }
      
      renderer.clear();
      renderer.draw(camera, canvas.width, canvas.height);
    }, 15);
  });
}

function play_audio()
{
  let track_no = 0;
  
  const sound = document.createElement("audio");
  sound.src = playlist[track_no++];
  sound.setAttribute("preload", "auto");
  sound.setAttribute("controls", "none");
  sound.style.display = "none";
  document.body.appendChild(sound);
  
  sound.addEventListener("ended", () => {
    sound.src = playlist[track_no++ % playlist.length];
  });
  
  sound.addEventListener("loadeddata", () => {
    sound.play();
  });
}

function auto_resize(canvas)
{
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

function run(map_file)
{
  play_audio();
  
  document.getElementById("display").style.visibility = "visible";
  document.getElementById("bar").style.visibility = "visible";
  document.getElementById("enter").style.visibility = "hidden";
  document.getElementById("door").style.visibility = "hidden";
  
  document.getElementById("close").onclick = function() {
    document.getElementById("instructions").style.visibility = "hidden";
  };
  
  let count = 0;
  let progress = 0;
  
  const total = 3;
  
  texture_preload("assets/floor.png", () => count++ );
  texture_preload("assets/ceil.png", () => count++ );
  
  const xhr = new XMLHttpRequest();
  
  xhr.addEventListener("load", () => {
    count++;
  });
  
  xhr.addEventListener("progress", (e) => {
    progress = e.loaded / e.total;
  });
  
  xhr.open("GET", map_file);
  xhr.send();
  
  const check_load = setInterval(function() {
    if (count == total) {
      document.getElementById("instructions").style.visibility = "visible";
      clearInterval(check_load);
      main(JSON.parse(xhr.responseText));
      document.getElementById("bar").style.visibility = "hidden";
    } else {
      document.getElementById("progress").style.width = progress * 100 + "%";
    }
  }, 15);
}

window.run = run;
