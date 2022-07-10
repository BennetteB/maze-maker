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
import { useEffect, useState } from "react";

const Editor: NextPage = () => {

  const [options, setOptions] = useState({
    editable: false,
  })

  return (
    <div className={cn(styles.editorDiv)}>
      <div className={cn(styles.topBar)}>
        <button className={cn(styles.utilButton)}><AddIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><ArrowDownwardIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><SaveIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><BurstModeIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><SettingsIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
      </div>
      <div className={cn(styles.menuBar)}>
        <div className={cn(styles.menuBarItem)}>
          <button className={cn(styles.menuBarButton)}>File</button>
          <div className={cn(styles.dropDown)}>
            <button className={cn(styles.subMenuItem)}>New</button>
            <button className={cn(styles.subMenuItem)}>Import</button>
            <button className={cn(styles.subMenuItem)}>Save</button>
            <button className={cn(styles.subMenuItem)}>Export</button>
          </div>
        </div>
        <div className={cn(styles.menuBarItem)}>
          <button className={cn(styles.menuBarButton)}>Edit</button>
          <div className={cn(styles.dropDown)}>
            <button className={cn(styles.subMenuItem)}>Wall Size</button>
            <button className={cn(styles.subMenuItem)}>Maze Colors</button>
            <button className={cn(styles.subMenuItem)}>Export Settings</button>
          </div>
        </div>
        <div className={cn(styles.editMenuItem)}></div>
      </div>
      <div className={cn(styles.editPanel)}>
        <MazeCanvas options={options} />
      </div>
      <div className={cn(styles.utilBar)}>
        <button className={cn(styles.utilButton, options.editable ? styles['utilButton-selected'] : '')} onClick={() => {
          setOptions(prev => ({ ...prev, editable: !prev.editable }))
        }} title="Edit"><EditIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
        <button className={cn(styles.utilButton)}><CheckCircleOutlineIcon className={cn(styles.utilIcon)} fontSize="inherit" /></button>
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