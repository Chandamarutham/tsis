import { useContext } from 'react';
import { LanguageContext } from "@utils/languageContext";
import TamilHomeContent from '@components/TamilHomeContent';
import EnglishHomeContent from '@components/EnglishHomeContent';
import styles from '@styles/HomePage.module.css';


export default function HomePage() {
  const language = useContext(LanguageContext)?.language;
  return (
    <div className={styles.container}>
      {language === 'ta' ?  <TamilHomeContent /> :<EnglishHomeContent />} 
    </div>
  );
}
