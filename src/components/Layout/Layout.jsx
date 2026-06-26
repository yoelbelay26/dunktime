import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}
