'use client'

import styles from './SectionLabel.module.css'

interface SectionLabelProps {
  label: string
  detail?: string
}

export default function SectionLabel({ label, detail }: SectionLabelProps) {
  return (
    <div className={styles.label}>
      <span className={styles.text}>{label}</span>
      {detail && <span className={styles.detail}>{detail}</span>}
    </div>
  )
}
