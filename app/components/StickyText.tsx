'use client'

import styles from './StickyText.module.css'

interface Fragment {
  text: string
  align: 'left' | 'right' | 'center' | 'indent'
}

interface StickyTextProps {
  fragments: Fragment[]
}

export default function StickyText({ fragments }: StickyTextProps) {
  return (
    <div className={styles.container}>
      {fragments.map((fragment, i) => (
        <div key={i} className={styles.stickyWrapper}>
          <div className={`${styles.fragment} ${styles[fragment.align]}`}>
            <p className={styles.text}>{fragment.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
