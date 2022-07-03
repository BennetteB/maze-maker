import { match } from "assert";

export interface Cell {
  up: Boolean;
  down: Boolean;
  left: Boolean;
  right: Boolean;

  upRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  downRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  leftRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  rightRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}

interface StackCell extends Cell{
  visited: boolean;
}

function GenerateMaze(width: number, height: number, opts?: { 
      algorithm?: "DFS",
      directionRects? : { 
        cellWidth: number; 
        wallWidth: number; 
        scale?: number; 
        draw?: CanvasRenderingContext2D},
    }) : Cell[][] {
    
  let maze : StackCell[][] = [];

    if(opts !== undefined) {
      if(opts.algorithm === undefined || opts.algorithm === "DFS") maze = GenerateDFS(width,height);
      if(opts.directionRects !== undefined) {
        if(opts.directionRects.draw !== undefined) {
          maze = getRects(maze,opts.directionRects!.cellWidth,opts.directionRects!.wallWidth,opts.directionRects!.scale);
          drawRect(maze, opts.directionRects!.draw!);
        }
        else {
          maze = getRects(maze,opts.directionRects!.cellWidth,opts.directionRects!.wallWidth,opts.directionRects!.scale)
        }
      }
    }

    return maze;
}

export default GenerateMaze;


function createMaze(height: number, width: number, isFilled : boolean) : StackCell[][] {
  const maze : StackCell[][] = [];
  for (let i = 0; i < height; i++) {
    const row: StackCell[] = [];
    for (let j = 0; j < width; j++) {
      if(isFilled) row.push({ up: true, down: true, left: true, right: true, visited: false });
      else row.push({ up: false, down: false, left: false, right: false, visited: false })
    }
    maze.push(row);
  }
  return maze;
}

function GenerateDFS(width: number, height: number) {
  const maze : StackCell[][] = createMaze(height, width, true);
  const stack : [row: number, col: number][] = [[Math.floor(Math.random() * height),Math.floor(Math.random() * width)]];

  while(true) {
    if(stack.length === 0) break;
    let cell = stack[stack.length - 1];
    maze[cell[0]][cell[1]].visited = true;
    const directions = shuffleArray(["up","down","left","right"]);
    let noOption = true;
    directions.every(element => {
      if(element === "up" && cell[0] > 0 && !maze[cell[0] - 1][cell[1]].visited) {
        stack.push([cell[0] - 1,cell[1]]); 
        maze[cell[0]][cell[1]].up = false;
        maze[cell[0] - 1][cell[1]].down = false;
        noOption = false;
        return false;
      }
      else if(element === "down" && cell[0] < (height - 1) && !maze[cell[0] + 1][cell[1]].visited) {
        stack.push([cell[0] + 1,cell[1]]); 
        maze[cell[0]][cell[1]].down = false;
        maze[cell[0] + 1][cell[1]].up = false;
        noOption = false;
        return false;
      }
      else if(element === "left" && cell[1] > 0 && !maze[cell[0]][cell[1] - 1].visited) {
        stack.push([cell[0],cell[1] - 1]); 
        maze[cell[0]][cell[1]].left = false;
        maze[cell[0]][cell[1] - 1].right = false;
        noOption = false;
        return false;
      }
      else if(element === "right" && cell[1] < (width - 1) && !maze[cell[0]][cell[1] + 1].visited) {
        stack.push([cell[0],cell[1] + 1]); 
        maze[cell[0]][cell[1]].right = false;
        maze[cell[0]][cell[1] + 1].left = false;
        noOption = false;
        return false;
      }
      return true;
    });
    if(noOption) stack.pop();
  }

  return maze;
}

function getRects(matrix: StackCell[][], cellWidth: number, wallWidth: number, scale: number | undefined) : StackCell[][] {
  matrix.forEach((row, rowi) => {
    row.forEach((col, coli) => {
      if(scale !== undefined){ 
        cellWidth = cellWidth * scale;
        wallWidth = wallWidth * scale;
      }
      const x = coli * cellWidth;
      const y = rowi * cellWidth;
      
      const totalWidth = cellWidth + wallWidth;
      const cell = matrix[rowi][coli];
      matrix[rowi][coli] = {
        upRect: {
          x: x,
          y: y,
          width: totalWidth,
          height: wallWidth
        },
        downRect: {
          x: x,
          y: y + cellWidth,
          width: totalWidth,
          height: wallWidth
        },
        leftRect: {
          x: x,
          y: y,
          width: wallWidth,
          height: totalWidth
        },
        rightRect: {
          x: x + cellWidth,
          y: y,
          width: wallWidth,
          height: totalWidth
        },
        ...cell
      }
    });
  })

  return matrix;
}

export function getMazeDimensions(MazeWidth: number, MazeHeight: number, cellWidth: number, wallWidth: number) {
  return { Width: (MazeWidth * cellWidth) + wallWidth, Height: (MazeHeight * cellWidth) + wallWidth }
}

function drawRect(matrix : Cell[][], ctx : CanvasRenderingContext2D) {
  // x and y adjusted for edge wall
  matrix.forEach((row, rowi) => {
    row.forEach((col, coli) => {
      const cell = matrix[rowi][coli];
      if(cell.up) {
        ctx.fillRect(cell.upRect!.x,cell.upRect!.y,cell.upRect!.width,cell.upRect!.height);
      }
      if(cell.down) {
        ctx.fillRect(cell.downRect!.x,cell.downRect!.y,cell.downRect!.width,cell.downRect!.height);
      }
      if(cell.left) {
        ctx.fillRect(cell.leftRect!.x,cell.leftRect!.y,cell.leftRect!.width,cell.leftRect!.height);
      }
      if(cell.right) {
        ctx.fillRect(cell.rightRect!.x,cell.rightRect!.y,cell.rightRect!.width,cell.rightRect!.height);
      }
    });
  })
}

function shuffleArray<T>(array : Array<T>) : Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
