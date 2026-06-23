import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.content}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
