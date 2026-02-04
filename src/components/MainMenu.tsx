import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faUsers, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from "@utils/useAuth";
import { LanguageContext } from "@utils/languageContext";
import styles from "@styles/MainMenu.module.css";

export default function MainMenu() {
  const { isAuthenticated } = useAuth();
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
              {isAuthenticated && (
                <li>
                  <NavLink to="/shishyas/view" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    {lang === 'en' ? 'View' : 'காண்க'}
                  </NavLink>
                </li>
              )}
              {isAuthenticated && (
                <li>
                  <NavLink to="/shishyas/notify" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    {lang === 'en' ? 'Notify' : 'அறிவிக்க'}
                  </NavLink>
                </li>
              )}
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
              {isAuthenticated && (
              <li>
                  <NavLink to="/events/add" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    
                    {lang === 'en' ? 'Add' : 'புதியது'}
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events/view" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  {lang === 'en' ? 'View' : 'காண்க'}
                </NavLink>
              </li>
              { isAuthenticated && (
              <li>
                <NavLink to="/events/reminder" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  {lang === 'en' ? 'Reminder' : 'நினைவூட்டல்'}
                </NavLink>
              </li>
              )}
            </ul>
          </li>

          <li>
            <div className={styles.buttonContainer}>
              <button onClick={handleLanguageChange} className={styles.langButton}>
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </li>

          {isAuthenticated && (
            <li className={styles.dropdown}>
              <span className={styles.link}><FontAwesomeIcon icon={faUser} />
                <div className={styles.menuText}>{lang === 'en' ? 'Profile' : 'ப்ரோஃபைல்'}</div>
              </span>
              <ul className={styles.dropdownMenu}>
                <li>
                  <NavLink to="/change-password" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    {lang === 'en' ? 'Change Password' : 'கடவுச்சொல்லை மாற்ற'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signout" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    {lang === 'en' ? 'Sign Out' : 'வெளியேற'}
                  </NavLink>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
