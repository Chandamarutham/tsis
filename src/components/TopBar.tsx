import { useContext } from 'react';

import { LanguageContext } from '@utils/languageContext';

import Mudaliyandan from "/images/Mudaliyandan.jpg";
import Mahacharyar from "/images/Mahacharyar.png";
import bannerImage from "/images/Thirumann.png";

import styles from "@styles/TopBar.module.css";

export default function TopBar() {
    const lang: string = useContext(LanguageContext)?.language || 'ta';
    return (
        <header className={styles.header}>
            <div className={styles.banner}>
                <span>
                    <div className={styles.sidePanelContainer}>
                        <img src={Mudaliyandan} className={styles.sidePanelImage} alt="Mudaliyandan" />
                    </div>
                    <p className={styles.acharyaName}>
                        {{'en': 'Mudaliyandan', 'ta': 'முதலியாண்டான்'}[lang]}
                    </p>
                </span>
                <div className={styles.mainPanel}>
                    <p className={styles.preamble}>ஶ்ரீ:</p>
                    <p className={styles.preamble}>ஶ்ரீமதே ராமாநுஜாய நம:</p>
                    <p className={styles.preamble}>ஶ்ரீஸ்ரீநிவாஸ மஹாகுரவே நம:</p>
                    <img src={bannerImage} className={styles.thirumannImage} alt="திருமண்காப்பு" /> 
                </div>
                <span>
                    <div className={styles.sidePanelContainer}>
                        <img src={Mahacharyar} className={styles.sidePanelImage} alt="Mahacharya" />
                    </div>
                    <p className={styles.acharyaName}>
                        {{'en': 'Mahacharya', 'ta': 'மஹாசாரியர்'}[lang]}
                    </p>
                </span>
            </div>
            <div className={styles.titleContainer}>
                <p className={styles.title}>
                    {
                        {
                        'en': 'Thirumaligai Shishya Info System', 
                        'ta': 'திருமாளிகை சிஷ்யர்கள் தகவல் தளம்'}[lang]
                    }
                </p>
            </div>
        </header>
    );
}
