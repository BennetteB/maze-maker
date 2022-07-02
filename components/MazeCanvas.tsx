import {default as cn} from 'classnames';
import styles from '../styles/MazeCanvas.module.css';
import createPanZoom from 'panzoom';
import { LegacyRef, useEffect, useRef } from 'react';
import { execFileSync } from 'child_process';
import { isGeneratorObject } from 'util/types';


function MazeCanvas(props : any) : JSX.Element {
  const canvasDivRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wallWidth = 15;
  const cellWidth = 90;

  interface Cell {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }
  const mazeData : Cell[][] = [
    [{up: true, down: false, left: true, right: false}, {up: true, down: false, left: false, right: false},{up: true, down: false, left: false, right: false},{up: true, down: false, left: false, right: true}],
    [{up: false, down: false, left: true, right: false}, {up: false, down: false, left: false, right: false},{up: false, down: false, left: false, right: false},{up: false, down: false, left: false, right: true}],
    [{up: false, down: false, left: true, right: false}, {up: false, down: false, left: false, right: false},{up: false, down: false, left: false, right: false},{up: false, down: false, left: false, right: true}],
    [{up: false, down: true, left: true, right: false}, {up: false, down: true, left: false, right: false},{up: false, down: true, left: false, right: false},{up: false, down: true, left: false, right: true}],
  ]

  function drawRect(rowi : number, coli : number,matrix : Cell[][], cellWidth: number, wallWidth : number, ctx : CanvasRenderingContext2D) {
    // x and y adjusted for edge wall
    const x = (coli * cellWidth) + (wallWidth / 2);
    const y = (rowi * cellWidth) + (wallWidth / 2);

    const truex = coli * cellWidth;
    const truey = rowi * cellWidth;
    
    const totalWidth = cellWidth + wallWidth;
    const cell = matrix[rowi][coli];
    if(cell.up) {
      ctx.fillRect(truex, truey, totalWidth, wallWidth);
    }
    if(cell.down) {
      ctx.fillRect(truex, truey + cellWidth, totalWidth, wallWidth);
    }
    if(cell.left) {
      ctx.fillRect(truex, truey, wallWidth, totalWidth);
    }
    if(cell.right) {
      ctx.fillRect(truex + cellWidth, truey, wallWidth, totalWidth);
    }
  }
    
  
  useEffect(() => {
    createPanZoom(canvasDivRef.current as HTMLElement, {
      smoothScroll: false,
    });
    const ctx = (canvasRef.current as HTMLCanvasElement).getContext('2d');
    ctx!.fillStyle = "red";
    mazeData.map((row, rowi) => {
      row.map((cell, coli) => {
        drawRect(rowi, coli, mazeData, cellWidth, wallWidth, ctx!);
      })
    })
  }, [])
  return (
    <div id='canvasDiv' className={cn(styles.canvasDiv)} ref={canvasDivRef as LegacyRef<HTMLDivElement>} >
      <canvas className={cn(styles.canvas)} ref={canvasRef} 
        width={(4 * cellWidth) + wallWidth} 
        height={(4* cellWidth) + wallWidth}/>
    </div>
  )
}

export default MazeCanvas;

