import type { ConfirmModalProps } from '@typedef/ConfirmOptions';
import styles from '@styles/ConfirmModal.module.css';

export default function ConfirmModal({
    title = 'Confirm Action',
    description = 'Are you sure?',
    confirmBtnTitle = 'Yes',
    rejectBtnTitle = 'No',
    onConfirm,
    onReject,
}: ConfirmModalProps) {
    return (
        <div className={styles.dialogWindow}>
        <div className={styles.form}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.desc}>{description}</p>
        <div className={styles.btnGroup}>
            <button
                type="button"
                onClick={onReject}
                className={styles.btnReject}
            >
                {rejectBtnTitle}
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className={styles.btnConfirm}
            >
                {confirmBtnTitle}
            </button>
        </div>
        </div>
    </div>
    );
}
