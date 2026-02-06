import styles from '@styles/NotFound.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h1 className={styles.title}>404 - Page Not Found</h1>
                <p className={styles.message}>
                    The page you are looking for does not exist. Please check the URL or return to the home page.<br /><br />
                    <p className="text-center">
                    <a href="/home" className={styles.homeLink}>Go to Home Page</a>
                    </p>
                </p>
            </div>
        </div>
    );
}
