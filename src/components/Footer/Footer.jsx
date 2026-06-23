import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} dir="rtl">
      <span className={styles.logo}>DunkTime</span>
      <p className={styles.copy}>© {new Date().getFullYear()} כל הזכויות שמורות</p>
    </footer>
  )
}
