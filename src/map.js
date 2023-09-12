import { vec3_t } from "./math.js";

export class wall_t {
  constructor(back, left)
  {
    this.back = back;
    this.left = left;
  }
};

export class door_t {
  constructor(id, url)
  {
    this.id = id;
    this.url = url;
  }
}

export class map_t {
  constructor()
  {
    this.width = 50;
    this.height = 50;
    
    this.walls = [];
    this.images = [];
    this.doors = {};
    
    this.callbacks = {};
    
    for (let i = 0; i < this.height; i++) {
      this.walls[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.walls[i][j] = new wall_t(0, 0);
      }
    }
  }
  
  add_image(image)
  {
    this.images.push(image);
    this.call("add_image", [image]);
  }
  
  remove_image(id)
  {
    this.images.splice(id - 1, 1);
    
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.walls[i][j].left == id)
          this.walls[i][j].left = 0;
        else if (this.walls[i][j].left > id)
          this.walls[i][j].left--;
        
        if (this.walls[i][j].back == id)
          this.walls[i][j].back = 0;
        else if (this.walls[i][j].back > id)
          this.walls[i][j].back--;
      }
    }
    
    this.call("remove_image", [id]);
  }
  
  listen(name, callback)
  {
    if (!(name in this.callbacks))
      this.callbacks[name] = [];
    
    this.callbacks[name].push(callback);
  }
  
  collide(x, y)
  {
    const d = 0.1;
    
    const x0 = x - d;
    const x1 = x + d;
    const y0 = y - d;
    const y1 = y + d;
    
    return (
      this.in_wall(x0, y0) ||
      this.in_wall(x1, y0) ||
      this.in_wall(x0, y1) ||
      this.in_wall(x1, y1)
    )
  }
  
  in_wall(x, y)
  {
    const x0 = Math.floor(x);
    const x1 = Math.floor(x + 0.2);
    const y0 = Math.floor(y);
    const y1 = Math.floor(y + 0.2);
    
    if (x0 < 0 || y0 < 0 || x1 >= this.width || y1 >= this.height)
      return true;
    
    if (this.get_solid(x1, y0, true) && x - x1 < 0.2)
      return true;
    
    if (this.get_solid(x0, y1, false) && y - y1 < 0.2)
      return true;
    
    if (this.get_solid(x1, y1, true) && x - x1 < 0.2)
      return true;
    
    if (this.get_solid(x1, y1, false) && y - y1 < 0.2)
      return true;
    
    return false;
  }
  
  get_solid(x, y, side)
  {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      const door = this.doors[this.get_door_id(new vec3_t(x, 0, y), side)];
      
      if (door)
        return door.id > 0;
      
      if (side)
        return this.walls[y][x].left > 0;
      else
        return this.walls[y][x].back > 0;
    } else {
      return true;
    }
  }
  
  get_door_id(pos, side)
  {
    if (pos.x < 0 || pos.x >= this.width || pos.z < 0 || pos.z >= this.height)
      return -1;
    
    return (pos.x + pos.z * this.width) * 2 + (side ? 1 : 0);
  }
  
  from_door_id(door_id)
  {
    const pos_id = Math.floor(door_id / 2);
    
    const x = pos_id % this.width;
    const y = Math.floor(pos_id / this.width);
    
    const side = door_id % 2 == 1;
    
    return [
      new vec3_t(x, 0, y),
      side
    ];
  }
  
  place(pos, side, id)
  {
    if (pos.x < 0 || pos.x >= this.width || pos.z < 0 || pos.z >= this.height)
      return;
    
    delete this.doors[this.get_door_id(pos, side)];
    
    if (side)
      this.walls[pos.z][pos.x].left = id;
    else
      this.walls[pos.z][pos.x].back = id;
  }
  
  place_door(pos, side, id, url)
  {
    const pos_id = this.get_door_id(pos, side);
    
    if (pos_id < 0)
      return;
    
    this.doors[pos_id] = new door_t(id, url);
    
    if (side)
      this.walls[pos.z][pos.x].left = 0;
    else
      this.walls[pos.z][pos.x].back = 0;
  }
  
  remove(pos, side)
  {
    if (pos.x < 0 || pos.x >= this.width || pos.z < 0 || pos.z >= this.height)
      return;
    
    delete this.doors[this.get_door_id(pos, side)];
    
    if (side) {
      this.walls[pos.z][pos.x].left = 0;
    } else {
      this.walls[pos.z][pos.x].back = 0;
    }
  }
  
  export_file()
  {
    const canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
    
    const walls = [];
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        walls.push(this.walls[i][j].back);
        walls.push(this.walls[i][j].left);
      }
    }
    
    const images = [];
    
    for (const image of this.images) {
      canvas.width = image.width;
      canvas.height = image.height;
      
      ctx.drawImage(image, 0, 0);
      
      images.push(canvas.toDataURL());
    }
    
    return {
      width: this.width,
      height: this.height,
      doors: this.doors,
      walls: walls,
      images: images
    };
  }
  
  import_file(file, renderer)
  {
    this.call("flush", []);
    
    this.width = file.width;
    this.height = file.height;
    this.doors = file.doors;
    
    this.walls = [];
    
    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < 2 * this.width; j += 2) {
        const back = file.walls[i * 2 * this.width + j + 0];
        const left = file.walls[i * 2 * this.width + j + 1];
        
        row.push(new wall_t(back, left));
      }
      
      this.walls.push(row);
    }
    
    this.images = [];
    
    let count = 0;
    
    for (const blob of file.images) {
      const image = new Image();
      image.src = blob;
      
      image.onload = () => {
        this.add_image(image);
        count++;
        
        if (count == file.images.length) {
          this.call("load", []);
        }
      };
    }
  }
  
  call(name, args)
  {
    if (this.callbacks[name]) {
      for (const callback of this.callbacks[name])
        callback(...args);
    }
  }
};
