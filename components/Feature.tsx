import classNames from "classnames";
import { StaticImageData } from "next/image";
import React, { FC, ReactElement } from "react";
import Image from "next/image";
import styles from '../styles/Feature.module.css';

function Feature({image, altText, children} 
  : {image : StaticImageData; altText : string; children : React.ReactNode}) {
  return (
    <div className={classNames(styles.featureDiv)}>
      <h1 className={classNames(styles.featureText)}>{children}</h1>
      <div className={classNames(styles.imageDiv)}>
        <Image src={image} alt={altText} className={classNames(styles.image)} objectFit="contain" />
      </div>
    </div>
  )

}

export default Feature;