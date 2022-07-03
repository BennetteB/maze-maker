import {default as cn} from 'classnames';
import styles from '../styles/MazeCanvas.module.css';
import createPanZoom from 'panzoom';
import { LegacyRef, useEffect, useRef } from 'react';
import { execFileSync } from 'child_process';
import { isGeneratorObject } from 'util/types';
import GenerateMaze, { Cell, getMazeDimensions } from '../utils/Maze';
import { PlayCircleFilledWhite } from '@mui/icons-material';


function MazeCanvas(props : any) : JSX.Element {
  const canvasDivRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wallWidth = 15;
  const cellWidth = 90;

  const MazeWidth = 10;  
  const MazeHeight = 10;

  let mazeData : Cell[][];

  const {Width : CanvasWidth, Height : CanvasHeight} = getMazeDimensions(MazeWidth, MazeHeight, cellWidth, wallWidth);
  
  useEffect(() => {
    createPanZoom(canvasDivRef.current as HTMLElement, {
      smoothScroll: false,
    });
    const ctx = (canvasRef.current as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0,0,canvasRef.current!.width,canvasRef.current!.height)
    ctx!.fillStyle = "red";
    mazeData = GenerateMaze(MazeWidth,MazeHeight,{
     directionRects: {
      cellWidth: cellWidth,
      wallWidth: wallWidth,
      draw: ctx,
     } 
    })
  }, [])
  return (
    <div id='canvasDiv' className={cn(styles.canvasDiv)} ref={canvasDivRef as LegacyRef<HTMLDivElement>} >
      <canvas className={cn(styles.canvas)} ref={canvasRef} 
        width={CanvasWidth} 
        height={CanvasHeight}/>
    </div>
  )
}

export default MazeCanvas;

