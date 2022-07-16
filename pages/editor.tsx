import MazeCanvas from "../components/MazeCanvas";
import { default as cn } from "classnames";
import { NextPage } from "next";
import styles from '../styles/Editor.module.css';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SaveIcon from '@mui/icons-material/Save';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TagIcon from '@mui/icons-material/Tag';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";

type State =
  "Initial" |
  "NewMaze" |
  "Editing" |
  "MazeSettings" |
  "SolutionSetting";

type SolutionState =
  "none" |
  "sol1" |
  "sol2" |
  "fullsol";


const Editor: NextPage = () => {
  const [pageState, setPageState] = useState<State>('Initial');
  const [previousState, setPreviousState] = useState<State>('Initial');
  const [activeMaze, setActiveMaze] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [solutionState, setSolutionState] = useState<SolutionState>("none");
  const [solutionOptions, setSolutionOptions] = useState<{
    cell1: boolean,
    cell2: boolean
  }>({
    cell1: false,
    cell2: false,
  });
  const [showSolutionWall, setShowSolutionWall] = useState<"Sol1" | "Sol2" | false>(false);

  const defaultOptions = {
    mazeName: 'Default',
    wallWidth: 15,
    cellWidth: 50,
    mazeWidth: 10,
    mazeHeight: 10,
    autogenMaze: false,
    keepMaze: false,
  };

  const [options, setOptions] = useState(defaultOptions)

  const [tempOptions, setTempOptions] = useState(defaultOptions);

  const SettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkboxl" ? e.target.checked : e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
    setTempOptions(prev => ({
      ...prev,
      [e.target.name]: value,
    }))
  }

  const Popup = (state: State) => {
    if (state === 'Initial') {
      return (
        <>
          <div className={cn(styles.popupBackground)}></div>
          <div className={cn(styles.popup)}>
            <button className={cn(styles.mainBtn)}
              onClick={() => { setPageState(prev => { setPreviousState(prev); return 'NewMaze' }) }}>New Maze</button>
            <button className={cn(styles.mainBtn)}>Open Maze</button>

          </div>
        </>
      )
    }
    else if (state === 'NewMaze' || state === 'MazeSettings') {
      return (
        <>
          <div className={cn(styles.popupBackground)}></div>
          <div className={cn(styles.popup)}>
            <form onSubmit={(e) => {
              e.preventDefault();
              setPageState(prev => { setPreviousState(prev); return "Editing" });
              if (state === 'NewMaze') setOptions(tempOptions);
              else if (state === 'MazeSettings') setOptions({ ...tempOptions, autogenMaze: false, keepMaze: true })
              setActiveMaze(true);
            }}>
              <div className={cn(styles.inputDiv)}>
                <label htmlFor="mazeName" className={cn(styles.nameLabel)}>Maze Name</label>
                <input type="text" id="mazeName" name="mazeName" className={cn(styles.nameInput)}
                  onChange={SettingsChange} required />
              </div>
              <div className={cn(styles.inputDiv)}>
                <label htmlFor="wallWidth">Wall Width</label>
                <input type="number" min="1" max="50" id="wallWidth" name="wallWidth"
                  defaultValue={tempOptions.wallWidth}
                  onChange={SettingsChange} required />
              </div>
              <div className={cn(styles.inputDiv)}>
                <label htmlFor="cellWidth">Cell Width</label>
                <input type="number" min="1" max="50" id="cellWidth" name="cellWidth"
                  defaultValue={tempOptions.cellWidth}
                  onChange={SettingsChange} required />
              </div>
              {state === 'NewMaze' ?
                <>
                  <div className={cn(styles.inputDiv)}>
                    <label htmlFor="mazeWidth">Maze Width</label>
                    <input type="number" min="1" max="100" id="mazeWidth" name="mazeWidth"
                      defaultValue={tempOptions.mazeWidth}
                      onChange={SettingsChange} required />
                  </div>
                  <div className={cn(styles.inputDiv)}>
                    <label htmlFor="mazeHeight">Maze Height</label>
                    <input type="number" min="1" max="100" id="mazeHeight" name="mazeHeight"
                      defaultValue={tempOptions.mazeHeight}
                      onChange={SettingsChange} required />
                  </div>
                  <div className={cn(styles.inputDiv)}>
                    <label htmlFor="autogenMaze">Autogenerate Maze</label>
                    <input type="checkbox" id="autogenMaze" name="autogenMaze"
                      defaultValue={tempOptions.autogenMaze.toString()}
                      onChange={SettingsChange} />
                  </div>
                </> : ''
              }
              <div className={styles.confirmOptionsDiv}>
                <button type="button" className={cn(styles.smallBtn)}
                  onClick={() => setPageState(previousState)}>Back</button>
                <input type="submit" value={state === 'NewMaze' ? "Create Maze" : "Save"} className={cn(styles.smallBtn)} />
              </div>
            </form>
          </div>
        </>

      )
    }
    else if (state === 'SolutionSetting') {
      return (
        <>
          <div className={cn(styles.solutionSettings)}>
            <div className={cn(styles.inputDiv)}>
              <button className={cn(solutionOptions.cell1 ? styles.solutionBtnSelected : styles.solutionBtn, solutionState === "sol1" ? styles.solutionBtnState : '',)}
                onClick={() => setSolutionState("sol1")}
                onMouseEnter={() => setShowSolutionWall("Sol1")}
                onMouseLeave={() => setShowSolutionWall(false)}>Solution Wall 1</button>
              <button className={cn(solutionOptions.cell2 ? styles.solutionBtnSelected : styles.solutionBtn, solutionState === "sol2" ? styles.solutionBtnState : '',)}
                onClick={() => setSolutionState("sol2")}
                onMouseEnter={() => setShowSolutionWall("Sol2")}
                onMouseLeave={() => setShowSolutionWall(false)}>Solution Wall 2</button>
              <button className={cn(styles.solutionBtn)}
                onClick={() => setSolutionState("fullsol")}>Solve</button>
            </div>
          </div>
        </>
      )
    }
    else if (state === 'Editing') return ("");
  }

  return (
    <div className={cn(styles.editorDiv)}>
      <div className={cn(styles.topBar)}>
        <button className={cn(styles.utilButton)} onClick={() => setPageState(prev => { setPreviousState(prev); return "NewMaze" })}>
          <AddIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}>
          <ArrowDownwardIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}>
          <SaveIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}>
          <BurstModeIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}>
          <SettingsIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
      </div>
      <div className={cn(styles.menuBar)}>
        <div className={cn(styles.menuBarItem)}>
          <button className={cn(styles.menuBarButton)}>File</button>
          <div className={cn(styles.dropDown)}>
            <button className={cn(styles.subMenuItem)}
              onMouseDown={() => setPageState(prev => { console.log("clicked"); setPreviousState(prev); return "NewMaze" })}>New</button>
            <button className={cn(styles.subMenuItem)}>Import</button>
            <button className={cn(styles.subMenuItem)}>Save</button>
            <button className={cn(styles.subMenuItem)}>Export</button>
          </div>
        </div>
        <div className={cn(styles.menuBarItem)}>
          <button className={cn(styles.menuBarButton)}>Edit</button>
          <div className={cn(styles.dropDown)}>
            <button className={cn(styles.subMenuItem)}
              onMouseDown={() => setPageState(prev => { setPreviousState(prev); return 'MazeSettings' })}>Maze Settings</button>
            <button className={cn(styles.subMenuItem)}>Export Settings</button>
          </div>
        </div>
        <div className={cn(styles.editMenuItem)}></div>
      </div>
      {Popup(pageState)}
      <div className={cn(styles.editPanel)}>
        {pageState === 'Editing' || activeMaze ? <MazeCanvas
          options={options}
          editable={editable}
          solutionState={solutionState}
          solutionConfirm={(Cell1: boolean, Cell2: boolean) => {
            setSolutionState("none");
            console.log(Cell1, Cell2);
            setSolutionOptions({
              cell1: Cell1,
              cell2: Cell2,
            })
          }}
          showSolution={showSolutionWall} /> : ""}
      </div>
      <div className={cn(styles.utilBar)}>
        <button className={cn(styles.utilButton, editable ? styles['utilButton-selected'] : '')} onClick={() => {
          setEditable(prev => !prev);
        }} title="Edit"><EditIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton, pageState === 'SolutionSetting' ? styles['utilButton-selected'] : '')}
          onClick={() => setPageState(prev => {
            if (prev === 'Editing') return 'SolutionSetting'
            else return 'Editing'
          })}><CheckCircleOutlineIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><DataThresholdingIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><AddPhotoAlternateIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><ImageNotSupportedIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><TagIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><CropSquareIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
      </div>
    </div >
  )
}

export default Editor;