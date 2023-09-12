The files will need to be hosted on a simple http server since images and other
assets can't be loaded due in local mode due to CORS.

You can host it with something simple like the python http server to test:
  https://ryanblunden.com/create-a-http-server-with-one-command-thanks-to-python-29fcfdcd240e

But to host it on your website you just need to upload the necessary files
which i've listed at the bottom in --- HOSTING ---

Please feel free to contact me if you're having trouble.

--- HOW IT WORKS ---

The main playable version is in "index.html".
This uses an iframe embed showing "play.html" which is the fullscreen version of the game.
You can customise index.html however you like.

The game reads from a map data in the file "map.json" which has both the wall
layout and the walls images stored in it.

You can make a custom map using the editor "edit.html" where you can place
walls and doors then save it to a "map.json" file.
You can then replace the current "map.json" file with the one you saved for a new wall layout.

--- EDITOR ---

[EDITOR CONTROLS]

WASD - Move around
CLICK+DRAG - Look around

SPACE - Place a wall using the currently selected image
F - Place a door using the currently selected image

Click [Choose File] at the top to import an image.
Click on images on the toolbar to select that image to place.
Click [Delete Image] to remove an image from the toolbar.
Click [Export] to save the current map layout to a file.
Click [Import] to open another "map.json" to edit again.

You can check or uncheck Collision to enable going through walls.

When you're done editing the map, save the file to the same folder as "play.html" named "map.json".
Then when you open "index.html" the map should have changed.

If it doesn't it may be a caching issue.
To fix this you may need to open the game in incognito mode.
If that doesn't work you may need to clear browser cache for the site the game is on.

--- ASSETS ---

There are certain things which are built into the game which you can replace
through in "assets" folder.

These are:
  - assets/ceil.png: The image used for the ceiling which will repeat
  - assets/floor.png: The image used for the floor which will repeat
  - assets/sound/: Your music files go here.

You can edit the playlist by changing the file "src/playlist.js"
Here you can reference mp3 or other audio files which are available in assets/sound

EXAMPLE:

export const playlist = [
  "assets/sound/nocturne.mp3",
  "assets/sound/claire_de_lune.mp3",
  "assets/sound/some_other_song.mp3"
];

These songs will play one after the other after when you enter the game.

--- HOSTING ---

When you're finished editing, the only files you actually need to be able to host the game are:
  - play.html
  - index.html
  - assets/
  - src/
  - map.json
You can copy these to another folder then host only these.
