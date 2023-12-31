import { gl } from "./gl.js";

const preloaded = {};

function scale_pot(image)
{
  const size = Math.max(image.width, image.height);
  const pot_size = 1 << 31 - Math.clz32(size);
  
  const canvas = document.createElement("CANVAS");
  canvas.width = pot_size;
  canvas.height = pot_size;
  
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  
  return canvas;
}

export function texture_load_url(path)
{
  const texture = gl.createTexture();
  
  const load = (image) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      scale_pot(image)
    );
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  };
  
  if (preloaded[path]) {
    load(preloaded[path]);
  } else {
    texture_preload(path, load);
  }
  
  return texture;
}

export function texture_load_image(image)
{
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    scale_pot(image)
  );
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
  return texture;
}

export function texture_preload(path, callback)
{
  const image = new Image();
  
  image.onload = () => {
    preloaded[path] = image;
    callback(image);
  };
  
  image.src = path;
}
