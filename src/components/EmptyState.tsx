import type { ReactNode } from "react";
import { Compass } from "./Icon";
import styles from "../styles/App.module.css";
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.empty}>
      <Compass size={36} strokeWidth={1.3} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
