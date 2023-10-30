# Minesweeper
<<<<<<< HEAD
An engaging Minesweeper game implemented using HTML, JavaScript, and CSS, providing customizable difficulty levels and dynamic grid generation for a challenging puzzle-solving experience.
=======

## Story

You work for a company that wants to recreate old built-in Windows games to make them playable in a Web browser.
One of your colleagues has started the implementation, but he was asked to switch to another project after drawing the initial state of the game. Now it's your turn to do the rest of the work!
It is important to have the same look and feel like in the good old [Windows XP Minesweeper](https://minesweeper.online/)!

## What are you going to learn?

- Handle user interactions with JavaScript event handlers.
- Find DOM elements by their class names, IDs, data-attributes, or any other kind of selectors.
- Change the style, class name, or any other attribute of DOM elements.
- Measure and show time with built-in JavaScript functions.

## Tasks

1. Implement mine flagging on right-clicking an unopened field.
    - When right-clicking an unopened field, a flag icon appears.
    - When right-clicking a flagged field, the flag disappears.
    - When right-clicking the playfield, the context menu stays hidden.

2. Implement field opening on left-clicking an unopened field.
    - When clicking a field that does not contain a mine, the field style changes to `open`.
    - When clicking a field that contains a mine, a mine icon appears.
    - Once a field is opened, it cannot be closed again. (That is, nothing happens when clicking the field.)
    - Flagged fields cannot be opened. (That is, nothing happens, when clicking the field, unless the flag is removed.)
    - When clicking a field that does not contain a mine, a number (1-8) appears, hinting the number of mines in neighboring fields. If the neighboring fields contain no mines, the opened field is empty ('0' does not need to appear), and its style is `open`.

3. Implement a counter that counts the remaining flags.
    - The `#flags-left-counter` element shows the number of remaining flags. At the start of the game, this number is equal to the number of mines.

4. Make it possible to win the game if the player finds all mines.
    - When all fields that do not contain a mine are opened, a victory message appears.
    - After winning, the game does not respond to clicks on the fields.

5. Make it possible to lose the game if a player steps on a mine.
    - When clicking a field which contains a mine, a game over message appears.
    - Upon losing the game, all mines are revealed.
    - After losing, the game does not respond to clicks on the fields.

6. [OPTIONAL] Implement a counter that counts the elapsed time in the game.
    - The `#elapsed-time-counter` element counts the seconds from the first click of the player.
    - Upon wining or losing the game, the elapsed time counter immediately stops.

7. [OPTIONAL] Make field opening automatic when the fields have zero mines and are stacked together.
    - When clicking a field which has no neighbors with a mine, the neighboring fields are automatically opened.
    - This is done recursively until the border of the empty area is reached.

## General requirements

None

## Hints

- Check out the reference solution for the "Create mine flagging feature" user story in the starter code.
- Open the `index.html` by starting a small HTTP server. For details, see the background materials.
- Use the script in the starter code to render the initial state, that is a play field with the specified dimensions and the specified amount of random generated mines.
- Use the data attributes that the skeleton code generates in the `div.game-field` in `game.html` as information for the logic, such as the rows or columns clicked, or the number of rows and columns.
  It is useful to store interesting information in data attributes, for example for passing values from the backend side (Python/Java/node.js/...) to frontend code (JavaScript).
- Use the icons (for example, flag, mine, etc.) in the `img` directory in the starter repo.
- Use a recursive function for the automatic area opening feature.

## Background materials

- <i class="far fa-exclamation"></i> [How to start a local HTTP server](project/curriculum/materials/pages/tools/serve-files.md)
- <i class="far fa-exclamation"></i> [Javascript – Events](project/curriculum/materials/pages/javascript/javascript-events.md)
- <i class="far fa-exclamation"></i> [Javascript – DOM manipulation](project/curriculum/materials/pages/javascript/javascript-dom.md)
- <i class="far fa-exclamation"></i> [Javascript – Debugging](project/curriculum/materials/pages/javascript/javascript-debugging.md)
- <i class="far fa-exclamation"></i> [Javascript – Other features](project/curriculum/materials/pages/javascript/javascript-other-features.md)
- <i class="far fa-video"></i> [The concept of recursion](https://www.youtube.com/watch?v=vPEJSJMg4jY)
>>>>>>> minesweeper-javascript-CatalinCatta/development
