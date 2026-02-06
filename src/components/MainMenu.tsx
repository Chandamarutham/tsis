import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUsers, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { LanguageContext } from "@utils/languageContext";
import styles from "@styles/MainMenu.module.css";

export default function MainMenu() {
  const context = useContext(LanguageContext);
  const setLanguage = context?.toggleLanguage;
  const lang = context?.language || 'ta';

  const handleLanguageChange = () => {
    if (setLanguage) {
      setLanguage();
    }    
    document.documentElement.lang = lang;
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li>
            <NavLink to="/home" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              <FontAwesomeIcon icon={faHome} /> 
              <div className={styles.menuText}>
                {lang === 'en' ? 'Home' : 'முகப்பு'}
              </div>
            </NavLink>
          </li>
          <li className={styles.dropdown}>
            <span className={styles.link}>
              <FontAwesomeIcon icon={faUsers} /> 
              <div className={styles.menuText}>
                {lang === 'en' ? 'Shishyas' : 'சிஷ்யர்கள்'}
              </div>
            </span>
            <ul className={styles.dropdownMenu}>
              <li>
                <NavLink to="/shishyas/add" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  {lang === 'en' ? 'New...' : 'புதியவர்...'}
                </NavLink>
              </li>
              <li>
                <NavLink to="/shishyas/update" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  {lang === 'en' ? 'Update...' : 'மாற்றுக...'}
                </NavLink>
              </li>
            </ul>
          </li>

          <li className={styles.dropdown}>
            <span className={styles.link}>
              <FontAwesomeIcon icon={faCalendar} /> 
              <div className={styles.menuText}>
                {lang === 'en' ? 'Events' : 'நிகழ்வுகள்'}
              </div>
            </span>
            <ul className={styles.dropdownMenu}>
               <li>
                <NavLink to="/events/view" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  {lang === 'en' ? 'View' : 'காண்க'}
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <div className={styles.buttonContainer}>
              <button 
                type="button"
                onClick={handleLanguageChange} 
                className={styles.langButton}
              >
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </li>

        </ul>
      </nav>
    </div>
  );
}
