import { default as cn } from 'classnames';
import styles from '../styles/MazeCanvas.module.css';
import createPanZoom, { PanZoom } from 'panzoom';
import React, { LegacyRef, useEffect, useRef } from 'react';
import { execFileSync } from 'child_process';
import { isGeneratorObject } from 'util/types';
import GenerateMaze, { Cell, getMazeDimensions } from '../utils/Maze';
import { ArrowDropDownCircleOutlined, PlayCircleFilledWhite } from '@mui/icons-material';
import { useStepperContext } from '@mui/material';


function MazeCanvas({ options }: { options: { editable: boolean } }): JSX.Element {
  const canvasDivRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let ctx: CanvasRenderingContext2D;

  const wallWidth = 15;
  const cellWidth = 90;

  const MazeWidth = 100;
  const MazeHeight = 100;

  let mazeData: Cell[][];

  let panzoomCanvas: PanZoom;

  const { Width: CanvasWidth, Height: CanvasHeight } = getMazeDimensions(MazeWidth, MazeHeight, cellWidth, wallWidth);

  useEffect(() => {
    panzoomCanvas = createPanZoom(canvasDivRef.current as HTMLElement, {
      smoothScroll: false,
    });
    ctx = (canvasRef.current as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx!.fillStyle = "red";
    mazeData = GenerateMaze(MazeWidth, MazeHeight, {
      directionRects: {
        cellWidth: cellWidth,
        wallWidth: wallWidth,
        draw: ctx,
      }
    })
    console.log(CanvasWidth, CanvasHeight);
  }, [])



  function CanvasClick(e: React.MouseEvent<HTMLElement>) {
    if (!options.editable) return;
    const boundRect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const canvasX = (e.clientX - boundRect.x) / panzoomCanvas.getTransform().scale;
    const canvasY = (e.clientY - boundRect.y) / panzoomCanvas.getTransform().scale;
    // console.log(boundRect.x, boundRect.y);
    console.log(canvasX, canvasY);
    mazeData = ChangeWall(mazeData, canvasX, canvasY, ctx);
  }
  return (
    <div id='canvasDiv' className={cn(styles.canvasDiv)} ref={canvasDivRef as LegacyRef<HTMLDivElement>} >
      <canvas className={cn(styles.canvas)} ref={canvasRef}
        width={CanvasWidth}
        height={CanvasHeight}
        onClick={CanvasClick} />
    </div>
  )
}

export default MazeCanvas;

function ChangeWall(mazeData: Cell[][], canvasX: number, canvasY: number, ctx: CanvasRenderingContext2D): Cell[][] {
  mazeData.every((row, rowi) => {
    let foundCell = false;
    row.every((cell, coli) => {
      if ((canvasX >= cell.upRect!.x && canvasX <= (cell.upRect!.x + cell.upRect!.width)) &&
        canvasY >= cell.upRect!.y && canvasY <= (cell.upRect!.y + cell.upRect!.height)) {
        console.log(rowi, coli);
        if (cell.up) {
          ctx.clearRect(cell.upRect!.x, cell.upRect!.y, cell.upRect!.width, cell.upRect!.height);
          mazeData[rowi][coli].up = false;
          if (rowi > 0) mazeData[rowi - 1][coli].down = false;
        }
        else {
          ctx.fillRect(cell.upRect!.x, cell.upRect!.y, cell.upRect!.width, cell.upRect!.height);
          mazeData[rowi][coli].up = true;
          if (rowi > 0) mazeData[rowi - 1][coli].down = true;
        }
        redrawNeighbours(rowi, coli, mazeData, ctx);
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.downRect!.x && canvasX <= (cell.downRect!.x + cell.downRect!.width)) &&
        canvasY >= cell.downRect!.y && canvasY <= (cell.downRect!.y + cell.downRect!.height)) {
        console.log(rowi, coli);
        if (cell.down) {
          ctx.clearRect(cell.downRect!.x, cell.downRect!.y, cell.downRect!.width, cell.downRect!.height);
          mazeData[rowi][coli].down = false;
          if (rowi < (mazeData.length - 1)) mazeData[rowi + 1][coli].up = false;
        }
        else {
          ctx.fillRect(cell.downRect!.x, cell.downRect!.y, cell.downRect!.width, cell.downRect!.height);
          mazeData[rowi][coli].down = true;
          if (rowi < (mazeData.length - 1)) mazeData[rowi + 1][coli].up = true;
        }
        redrawNeighbours(rowi, coli, mazeData, ctx);
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.leftRect!.x && canvasX <= (cell.leftRect!.x + cell.leftRect!.width)) &&
        canvasY >= cell.leftRect!.y && canvasY <= (cell.leftRect!.y + cell.leftRect!.height)) {
        console.log(rowi, coli);
        if (cell.left) {
          ctx.clearRect(cell.leftRect!.x, cell.leftRect!.y, cell.leftRect!.width, cell.leftRect!.height);
          mazeData[rowi][coli].left = false;
          if (coli > 0) mazeData[rowi][coli - 1].right = false;
        }
        else {
          ctx.fillRect(cell.leftRect!.x, cell.leftRect!.y, cell.leftRect!.width, cell.leftRect!.height);
          mazeData[rowi][coli].left = true;
          if (coli > 0) mazeData[rowi][coli - 1].right = true;
        }
        redrawNeighbours(rowi, coli, mazeData, ctx);
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.rightRect!.x && canvasX <= (cell.rightRect!.x + cell.rightRect!.width)) &&
        canvasY >= cell.rightRect!.y && canvasY <= (cell.rightRect!.y + cell.rightRect!.height)) {
        console.log(rowi, coli);
        if (cell.right) {
          ctx.clearRect(cell.rightRect!.x, cell.rightRect!.y, cell.rightRect!.width, cell.rightRect!.height);
          mazeData[rowi][coli].right = false;
          if (coli < (mazeData[0].length - 1)) mazeData[rowi][coli + 1].left = false;
        }
        else {
          ctx.fillRect(cell.rightRect!.x, cell.rightRect!.y, cell.rightRect!.width, cell.rightRect!.height);
          mazeData[rowi][coli].right = true;
          if (coli < (mazeData[0].length - 1)) mazeData[rowi][coli + 1].left = true;
        }
        redrawNeighbours(rowi, coli, mazeData, ctx);
        foundCell = true;
        return false;
      }
      return true;
    });
    if (foundCell) return false;
    return true;
  });

  return mazeData;
}

function redrawNeighbours(rowi: number, coli: number, mazeData: Cell[][], ctx: CanvasRenderingContext2D) {
  const neighbours = [];

  neighbours.push(mazeData[rowi][coli]);
  if (rowi > 0) neighbours.push(mazeData[rowi - 1][coli]);
  if (rowi < (mazeData.length - 1)) neighbours.push(mazeData[rowi + 1][coli]);
  if (coli > 0) neighbours.push(mazeData[rowi][coli - 1]);
  if (coli < (mazeData[0].length - 1)) neighbours.push(mazeData[rowi][coli + 1]);

  neighbours.forEach(cell => {
    if (cell.up) ctx.fillRect(cell.upRect!.x, cell.upRect!.y, cell.upRect!.width, cell.upRect!.height)
    if (cell.down) ctx.fillRect(cell.downRect!.x, cell.downRect!.y, cell.downRect!.width, cell.downRect!.height)
    if (cell.left) ctx.fillRect(cell.leftRect!.x, cell.leftRect!.y, cell.leftRect!.width, cell.leftRect!.height)
    if (cell.right) ctx.fillRect(cell.rightRect!.x, cell.rightRect!.y, cell.rightRect!.width, cell.rightRect!.height)
  })
}