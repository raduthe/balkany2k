import { vec3_t, normalize_angle } from "./math.js";

export class game_t {
  constructor()
  {
    this.prev_mouse_x = 0.0;
    this.no_clip = true;
    
    this.front_pos = new vec3_t(0.0, 0.0, 0.0);
    this.front_side = false;
  }
  
  clip_move(camera, map, move_dir)
  {
    if (this.no_clip)
      return move_dir;
    
    const x0 = camera.position.x;
    const x1 = camera.position.x + move_dir.x;
    const z0 = camera.position.z;
    const z1 = camera.position.z + move_dir.z;
    
    if (map.collide(x1, z1)) {
      if (!map.collide(x0, z1))
        return new vec3_t(0.0, 0.0, move_dir.z);
      else if (!map.collide(x1, z0))
        return new vec3_t(move_dir.x, 0.0, 0.0);
      else
        return new vec3_t(0.0, 0.0, 0.0);
    } else {
      return move_dir;
    }
  }
  
  move_camera(camera, input, map)
  {
    const key_dir = new vec3_t(0.0, 0.0, 0.0);
    
    if (input.action["forward"])
      key_dir.z += 1.0;
    
    if (input.action["left"])
      key_dir.x -= 1.0;
    
    if (input.action["back"])
      key_dir.z -= 1.0;
    
    if (input.action["right"])
      key_dir.x += 1.0;
    
    if (input.action["look"]) {
      if (this.prev_mouse_x < 0) {
        this.prev_mouse_x = input.mouse_x;
      } else {
        camera.rotation += (input.mouse_x - this.prev_mouse_x) * 0.005;
        this.prev_mouse_x = input.mouse_x;
      }
    } else {
      this.prev_mouse_x = -1;
    }
    
    const move_dir = key_dir.y_rotate(-camera.rotation).mulf(0.03);
    const clip_dir = this.clip_move(camera, map, move_dir);
    
    camera.position = camera.position.add(clip_dir);
    
    this.update_front(camera);
  }
  
  update_front(camera)
  {
    const cam_rot = normalize_angle(camera.rotation) + Math.PI;
    const cam_phase = Math.floor(0.5 + 2 * cam_rot / Math.PI);
    
    const phase_back = 1;
    const phase_right = 2;
    const phase_forward = 3;
    
    let map_x = camera.position.x;
    let map_z = camera.position.z;
    
    if (cam_phase == phase_back) {
      this.front_side = false;
    } else if (cam_phase == phase_right) {
      map_x += 1.0;
      this.front_side = true;
    } else if (cam_phase == phase_forward) {
      map_z += 1.0;
      this.front_side = false;
    } else {
      this.front_side = true;
    }
    
    this.front_pos = new vec3_t(Math.floor(map_x), 0.0, Math.floor(map_z));
  }
  
  check_door(camera, map)
  {
    return map.doors[map.get_door_id(this.front_pos, this.front_side)];
  }
};
