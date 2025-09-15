/* 
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="container">
      {children}
    </div>
  );
};

export default Container; 
*/
import styles from "./container.module.css"

export default function Container({children}: {children: any}) {
    return <div className={styles.parentContainer}>{children}</div>
}