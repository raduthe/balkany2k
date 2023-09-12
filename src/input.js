export class input_t
{
  constructor()
  {
    this.action = {
      "forward": false,
      "back": false,
      "left": false,
      "right": false,
      "place": false,
      "door": false
    };
    
    this.key_binds = {
      "w": "forward",
      "a": "left",
      "s": "back",
      "d": "right",
      " ": "place",
      "c": "remove",
      "f": "door"
    };
    
    this.mouse_binds = {
      0: "look"
    };
    
    this.mouse_x = 0.0;
    this.mouse_y = 0.0;
    
    const canvas = document.getElementById("display");
    
    this.init_key(canvas);
    this.init_mouse(canvas);
    
    const window_prompt = window.prompt;
    window.prompt = () => {
      for (const action in this.action) {
        this.action[action] = false;
      }
      
      return window_prompt();
    };
    
    document.addEventListener("focusout", (e) => {
      for (const action in this.action) {
        this.action[action] = false;
      }
    });
  }
  
  init_mouse(canvas)
  {
    canvas.addEventListener("mousedown", (e) => {
      if (this.mouse_binds[e.button])
        this.action[this.mouse_binds[e.button]] = true;
    });
    
    canvas.addEventListener("mouseup", (e) => {
      if (this.mouse_binds[e.button])
        this.action[this.mouse_binds[e.button]] = false;
    });
    
    canvas.addEventListener("mousemove", (e) => {
      this.mouse_x = e.offsetX;
      this.mouse_y = e.offsetY;
    });
  }
  
  init_key()
  {
    document.addEventListener("keypress", (e) => {
      if (this.key_binds[e.key])
        this.action[this.key_binds[e.key]] = true;
    });
    
    document.addEventListener("keyup", (e) => {
      if (this.key_binds[e.key])
        this.action[this.key_binds[e.key]] = false;
    });
  }
}
