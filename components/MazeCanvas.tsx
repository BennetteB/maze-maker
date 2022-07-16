import { default as cn } from 'classnames';
import styles from '../styles/MazeCanvas.module.css';
import createPanZoom, { PanZoom } from 'panzoom';
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { execFileSync } from 'child_process';
import { isGeneratorObject } from 'util/types';
import GenerateMaze, { Cell, GetMazeDimensions, DrawRects, GetRects } from '../utils/Maze';
import { ArrowDropDownCircleOutlined, PlayCircleFilledWhite } from '@mui/icons-material';
import { useStepperContext } from '@mui/material';


type SolutionState =
  "none" |
  "sol1" |
  "sol2" |
  "fullsol";

function MazeCanvas({ options, editable, solutionState, solutionConfirm, showSolution }: {
  options: {
    mazeName: string,
    wallWidth: number,
    cellWidth: number,
    mazeWidth: number,
    mazeHeight: number,
    autogenMaze: boolean,
    keepMaze: boolean,
  },
  editable: boolean,
  solutionState: "none" | "sol1" | "sol2" | "fullsol",
  solutionConfirm: (cell1: boolean, cell2: boolean) => void,
  showSolution: "Sol1" | "Sol2" | false,
}): JSX.Element {

  const canvasDivRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [solutionWalls, setSolutionWalls] = useState<{
    cell1?: number[],
    cell1Direction?: "up" | "down" | "left" | "right",

    cell2?: number[],
    cell2Direction?: "up" | "down" | "left" | "right"
  }>({});

  const [mazeData, setMazeData] = useState<Cell[][] | null>(null);

  const [panzoomCanvas, setPanzoomCanvas] = useState<PanZoom | null>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [CanvasDimensions, setCanvasDimensions] = useState<number[]>([0, 0]);

  useEffect(() => {
    setCtx(canvasRef.current!.getContext('2d'));
    setPanzoomCanvas(createPanZoom(canvasDivRef.current as HTMLElement, {
      smoothScroll: false,
    }));
    setCanvasDimensions(GetMazeDimensions(options.mazeWidth,
      options.mazeHeight,
      options.cellWidth,
      options.wallWidth))
    console.log("initial effect");
  }, [])

  useEffect(() => {
    if (ctx === null) return;
    ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx!.fillStyle = "red";
    setCanvasDimensions(GetMazeDimensions(options.mazeWidth,
      options.mazeHeight,
      options.cellWidth,
      options.wallWidth))
    console.log("options Effect");
    if (ctx !== null) console.log(ctx!.fillStyle);
  }, [options])

  useEffect(() => {
    if (ctx !== null) {
      ctx!.fillStyle = "red";
      if (options.keepMaze) {
        setMazeData(prev => {
          const changedMaze = GetRects(prev!, options.cellWidth, options.wallWidth, 1);
          DrawRects(changedMaze, ctx!);
          return changedMaze;
        })

      }
      else if (options.autogenMaze) {
        setSolutionWalls({});
        setMazeData(GenerateMaze(options.mazeWidth, options.mazeHeight, {
          directionRects: {
            cellWidth: options.cellWidth,
            wallWidth: options.wallWidth,
            draw: ctx!,
          }
        }))
      } else {
        setSolutionWalls({});
        setMazeData(GenerateMaze(options.mazeWidth, options.mazeHeight, {
          algorithm: "None",
          directionRects: {
            cellWidth: options.cellWidth,
            wallWidth: options.wallWidth,
            draw: ctx!,
          }
        }))
      }
    }
    console.log("ctx Effect");
  }, [ctx, CanvasDimensions])

  useEffect(() => {
    if (mazeData === null) return;
    if (showSolution === "Sol1") {
      if (solutionWalls.cell1 != undefined) {
        const cell = mazeData[solutionWalls.cell1[0]][solutionWalls.cell1[1]];
        switch (solutionWalls.cell1Direction) {
          case "up":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.upRect?.x as number, cell.upRect?.y as number, cell.upRect?.width as number, cell.upRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "down":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.downRect?.x as number, cell.downRect?.y as number, cell.downRect?.width as number, cell.downRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "left":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.leftRect?.x as number, cell.leftRect?.y as number, cell.leftRect?.width as number, cell.leftRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "right":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.rightRect?.x as number, cell.rightRect?.y as number, cell.rightRect?.width as number, cell.rightRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          default:
        }

      }
    }
    else if (showSolution === "Sol2") {
      if (solutionWalls.cell2 != undefined) {
        const cell = mazeData[solutionWalls.cell2[0]][solutionWalls.cell2[1]];
        switch (solutionWalls.cell2Direction) {
          case "up":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.upRect?.x as number, cell.upRect?.y as number, cell.upRect?.width as number, cell.upRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "down":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.downRect?.x as number, cell.downRect?.y as number, cell.downRect?.width as number, cell.downRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "left":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.leftRect?.x as number, cell.leftRect?.y as number, cell.leftRect?.width as number, cell.leftRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          case "right":
            ctx!.fillStyle = "#008000";
            ctx?.fillRect(cell.rightRect?.x as number, cell.rightRect?.y as number, cell.rightRect?.width as number, cell.rightRect?.height as number);
            ctx!.fillStyle = "red";
            console.log("filled");
            break;
          default:
        }
      }
    }
    else {
      if (solutionWalls.cell1 != undefined) {
        const cell = mazeData[solutionWalls.cell1[0]][solutionWalls.cell1[1]];
        switch (solutionWalls.cell1Direction) {
          case "up":
            ctx?.fillRect(cell.upRect?.x as number, cell.upRect?.y as number, cell.upRect?.width as number, cell.upRect?.height as number);
            redrawNeighbours(solutionWalls.cell1[0], solutionWalls.cell1[1], mazeData, ctx!);
            break;
          case "down":
            ctx?.fillRect(cell.downRect?.x as number, cell.downRect?.y as number, cell.downRect?.width as number, cell.downRect?.height as number);
            redrawNeighbours(solutionWalls.cell1[0], solutionWalls.cell1[1], mazeData, ctx!);
            console.log("filled");
            break;
          case "left":
            ctx?.fillRect(cell.leftRect?.x as number, cell.leftRect?.y as number, cell.leftRect?.width as number, cell.leftRect?.height as number);
            redrawNeighbours(solutionWalls.cell1[0], solutionWalls.cell1[1], mazeData, ctx!);
            console.log("filled");
            break;
          case "right":
            ctx?.fillRect(cell.rightRect?.x as number, cell.rightRect?.y as number, cell.rightRect?.width as number, cell.rightRect?.height as number);
            redrawNeighbours(solutionWalls.cell1[0], solutionWalls.cell1[1], mazeData, ctx!);
            console.log("filled");
            break;
          default:
        }
      }
      if (solutionWalls.cell2 != undefined) {
        const cell = mazeData[solutionWalls.cell2[0]][solutionWalls.cell2[1]];
        switch (solutionWalls.cell2Direction) {
          case "up":
            ctx?.fillRect(cell.upRect?.x as number, cell.upRect?.y as number, cell.upRect?.width as number, cell.upRect?.height as number);
            redrawNeighbours(solutionWalls.cell2[0], solutionWalls.cell2[1], mazeData, ctx!);
            console.log("filled");
            break;
          case "down":
            ctx?.fillRect(cell.downRect?.x as number, cell.downRect?.y as number, cell.downRect?.width as number, cell.downRect?.height as number);
            redrawNeighbours(solutionWalls.cell2[0], solutionWalls.cell2[1], mazeData, ctx!);
            console.log("filled");
            break;
          case "left":
            ctx?.fillRect(cell.leftRect?.x as number, cell.leftRect?.y as number, cell.leftRect?.width as number, cell.leftRect?.height as number);
            redrawNeighbours(solutionWalls.cell2[0], solutionWalls.cell2[1], mazeData, ctx!);
            console.log("filled");
            break;
          case "right":
            ctx?.fillRect(cell.rightRect?.x as number, cell.rightRect?.y as number, cell.rightRect?.width as number, cell.rightRect?.height as number);
            redrawNeighbours(solutionWalls.cell2[0], solutionWalls.cell2[1], mazeData, ctx!);
            console.log("filled");
            break;
          default:
        }
      }
    }
  }, [showSolution])

  function CanvasClick(e: React.MouseEvent<HTMLElement>) {
    const boundRect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const canvasX = (e.clientX - boundRect.x) / panzoomCanvas!.getTransform().scale;
    const canvasY = (e.clientY - boundRect.y) / panzoomCanvas!.getTransform().scale;
    console.log(canvasX, canvasY);
    if (solutionState === "sol1" || solutionState === "sol2") {
      const [celli, direction] = GetSelectedWall(mazeData!, canvasX, canvasY);
      if (celli !== false) handleSolutionWalls(celli[0], celli[1], direction);
    }
    else if (editable) {
      setMazeData(prev => ChangeWall(prev!, canvasX, canvasY, ctx!, handleSolutionWalls));
    }
  }

  function handleSolutionWalls(celly: number, cellx: number, direction: "up" | "down" | "left" | "right") {
    if (solutionState === "sol1") {
      setSolutionWalls(prev => ({
        ...prev,
        cell1: [celly, cellx],
        cell1Direction: direction,
      }))
      solutionConfirm(true, solutionWalls.cell2 !== undefined ? true : false);
      return true;
    }
    else if (solutionState === 'sol2') {
      setSolutionWalls(prev => ({
        ...prev,
        cell2: [celly, cellx],
        cell2Direction: direction,
      }))
      solutionConfirm(solutionWalls.cell1 !== undefined ? true : false, true);
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <div id='canvasDiv' className={cn(styles.canvasDiv)} ref={canvasDivRef as LegacyRef<HTMLDivElement>} >
      <canvas className={cn(styles.canvas)} ref={canvasRef}
        width={CanvasDimensions[0]}
        height={CanvasDimensions[1]}
        onClick={CanvasClick} />
    </div>
  )
}

export default MazeCanvas;

function GetSelectedWall(mazeData: Cell[][],
  canvasX: number,
  canvasY: number): [number[], "up" | "down" | "left" | "right"] | [false, false] {
  let returnValue: [number[], "up" | "down" | "left" | "right"] | [false, false] = [false, false];
  mazeData.every((row, rowi) => {
    let foundCell = false;
    row.every((cell, coli) => {
      if ((canvasX >= cell.upRect!.x && canvasX <= (cell.upRect!.x + cell.upRect!.width)) &&
        canvasY >= cell.upRect!.y && canvasY <= (cell.upRect!.y + cell.upRect!.height)) {
        returnValue = [[rowi, coli], "up"];
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.downRect!.x && canvasX <= (cell.downRect!.x + cell.downRect!.width)) &&
        canvasY >= cell.downRect!.y && canvasY <= (cell.downRect!.y + cell.downRect!.height)) {
        returnValue = [[rowi, coli], "down"];
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.leftRect!.x && canvasX <= (cell.leftRect!.x + cell.leftRect!.width)) &&
        canvasY >= cell.leftRect!.y && canvasY <= (cell.leftRect!.y + cell.leftRect!.height)) {
        returnValue = [[rowi, coli], "left"];
        foundCell = true;
        return false;
      }
      if ((canvasX >= cell.rightRect!.x && canvasX <= (cell.rightRect!.x + cell.rightRect!.width)) &&
        canvasY >= cell.rightRect!.y && canvasY <= (cell.rightRect!.y + cell.rightRect!.height)) {
        returnValue = [[rowi, coli], "right"];
        foundCell = true;
        return false;
      }
      return true;
    })
    if (foundCell) return false;
    return true;
  })
  console.log(returnValue);
  return returnValue;
}

function ChangeWall(mazeData: Cell[][],
  canvasX: number,
  canvasY: number,
  ctx: CanvasRenderingContext2D,
  handleSolWalls: (celly: number, cellx: number, direction: "up" | "down" | "left" | "right") => boolean): Cell[][] {
  const [celli, orientation] = GetSelectedWall(mazeData, canvasX, canvasY);
  if (celli === false) return mazeData;
  const cell = mazeData[celli[0]][celli[1]];
  switch (orientation) {
    case "up":
      if (cell.up) {
        ctx.clearRect(cell.upRect!.x, cell.upRect!.y, cell.upRect!.width, cell.upRect!.height);
        mazeData[celli[0]][celli[1]].up = false;
        if (celli[0] > 0) mazeData[celli[0] - 1][celli[1]].down = false;
      }
      else {
        ctx.fillRect(cell.upRect!.x, cell.upRect!.y, cell.upRect!.width, cell.upRect!.height);
        mazeData[celli[0]][celli[1]].up = true;
        if (celli[0] > 0) mazeData[celli[0] - 1][celli[1]].down = true;
      }
      redrawNeighbours(celli[0], celli[1], mazeData, ctx);
      break;
    case "down":
      if (cell.down) {
        ctx.clearRect(cell.downRect!.x, cell.downRect!.y, cell.downRect!.width, cell.downRect!.height);
        mazeData[celli[0]][celli[1]].down = false;
        if (celli[0] < (mazeData.length - 1)) mazeData[celli[0] + 1][celli[1]].up = false;
      }
      else {
        ctx.fillRect(cell.downRect!.x, cell.downRect!.y, cell.downRect!.width, cell.downRect!.height);
        mazeData[celli[0]][celli[1]].down = true;
        if (celli[0] < (mazeData.length - 1)) mazeData[celli[0] + 1][celli[1]].up = true;
      }
      redrawNeighbours(celli[0], celli[1], mazeData, ctx);
      break;
    case "left":
      if (cell.left) {
        ctx.clearRect(cell.leftRect!.x, cell.leftRect!.y, cell.leftRect!.width, cell.leftRect!.height);
        mazeData[celli[0]][celli[1]].left = false;
        if (celli[1] > 0) mazeData[celli[0]][celli[1] - 1].right = false;
      }
      else {
        ctx.fillRect(cell.leftRect!.x, cell.leftRect!.y, cell.leftRect!.width, cell.leftRect!.height);
        mazeData[celli[0]][celli[1]].left = true;
        if (celli[1] > 0) mazeData[celli[0]][celli[1] - 1].right = true;
      }
      redrawNeighbours(celli[0], celli[1], mazeData, ctx);
      break;
    case "right":
      if (cell.right) {
        ctx.clearRect(cell.rightRect!.x, cell.rightRect!.y, cell.rightRect!.width, cell.rightRect!.height);
        mazeData[celli[0]][celli[1]].right = false;
        if (celli[1] < (mazeData[0].length - 1)) mazeData[celli[0]][celli[1] + 1].left = false;
      }
      else {
        ctx.fillRect(cell.rightRect!.x, cell.rightRect!.y, cell.rightRect!.width, cell.rightRect!.height);
        mazeData[celli[0]][celli[1]].right = true;
        if (celli[1] < (mazeData[0].length - 1)) mazeData[celli[0]][celli[1] + 1].left = true;
      }
      redrawNeighbours(celli[0], celli[1], mazeData, ctx);
      break;
  }
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