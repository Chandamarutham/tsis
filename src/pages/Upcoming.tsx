import styles from '@styles/Upcoming.module.css';

export default function Upcoming() {
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h1 className={styles.title}>Under Development</h1>
                <p className={styles.message}>
                    The page you are looking for is under development. Thank you for your patience and understanding.<br /><br />
                    <p className="text-center">
                    <a href="/home" className={styles.homeLink}>Go to Home Page</a>
                    </p>
                </p>
            </div>
        </div>
    );
}
