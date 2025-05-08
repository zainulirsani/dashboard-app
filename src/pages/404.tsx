import styles from '@/styles/404.module.scss'
import Image from 'next/image'
const Custom404 = () => {
    return (
        <div className={styles.error}>
            <Image src="/not-found.png" alt="404" width={500}
  height={300} className={styles.error__image} />
            <h3>Halaman Tidak Ditemukan</h3>
        </div>
    )
}

export default Custom404;