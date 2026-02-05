import { useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';

import type { 
    FormProps, 
    ShishyaDataResultType 
} from "@typedef/ShishyaData";

import { FormState } from '@typedef/FormState';

import styles from '@styles/ShowCompletion.module.css';

export default function ShowCompletion(
    { setParentState, currentData }: FormProps<ShishyaDataResultType>
) {
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";

    const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setParentState(FormState.GET_IDENTITY);
    };

    return(
        <form className={styles.form}>
            <h2 className={`${styles.title} ${font_style}`}>
                {{'en': 'Submission Complete', 'ta': 'சமர்ப்பிப்பு நிறைவு'}[language]}
            </h2>
            <p className={`${styles.message} ${font_style}`}>
                {currentData.message || {'en': 'Your details have been saved.', 'ta': 'உங்கள் தகவல்கள் சேமிக்கப்பட்டன.'}[language]}
            </p>
            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <span className={`${styles.detailLabel} ${font_style}`}>
                        {{'en': 'Record Count', 'ta': 'பதிவு எண்ணிக்கை'}[language]}
                    </span>
                    <span className={styles.detailValue}>{currentData.count}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={`${styles.detailLabel} ${font_style}`}>
                        {{'en': 'Current Address ID', 'ta': 'நடப்பு முகவரி அடைவு'}[language]}
                    </span>
                    <span className={styles.detailValue}>{currentData.current_address_id}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={`${styles.detailLabel} ${font_style}`}>
                        {{'en': 'Permanent Address ID', 'ta': 'நிரந்தர முகவரி அடைவு'}[language]}
                    </span>
                    <span className={styles.detailValue}>{currentData.permanent_address_id}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={`${styles.detailLabel} ${font_style}`}>
                        {{'en': 'Family ID', 'ta': 'குடும்ப அடைவு'}[language]}
                    </span>
                    <span className={styles.detailValue}>{currentData.family_id}</span>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button
                    type="button"
                    className={`${styles.okButton} ${font_style}`}
                    onClick={handleOk}
                >
                    {{'en': 'OK', 'ta': 'சரி'}[language]}
                </button>
            </div>
        </form>
    );
}