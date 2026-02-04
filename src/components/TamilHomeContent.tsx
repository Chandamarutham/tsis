{/* ---------------------------------------------------------------------------
    Component: Tamil Home Content Component
    Created: 01-January-2026
    Purpose: To display the Tamil content for the Home page when Tamil language 
             is selected.
    --------------------------------------------------------------------------*/}
import styles from '@styles/TamilHomeContent.module.css';

export default function TamilHomeContent() {

  return (
    <div className={styles.innerBox}>
        <h2 className={styles.subtitle}>சோளசிம்மபுரம் கோயில் கந்தாடை சண்டமாருதம்</h2>
        <h1 className={styles.title}>தொட்டையாச்சார் ஸ்வாமி திருமாளிகை</h1>
        <h2 className={styles.subtitle}>(KKC பெரியப்பங்கார் ஸ்வாமி திருமாளிகை)</h2>        
        <hr className={styles.separator} />
        <p className={styles.regularParagraph}>
        இது திருமாளிகை சிஷ்யர்களுக்கான பிரத்யேக தகவல் பகிரும் தளம்.<br /> <br />
        இத்தளத்தின் மூலம் சிஷ்யர்கள் கீழ்கண்ட தகவல்களை பகிரலாம். இனிவரும் திருமாளிகை மற்று கோயில் நிகழ்ச்சிகள் பற்றி, திருமாளிகையும் பகிரலாம்.  இது நாள் வரை Excel Sheetஇலும், diaryகளிலும் குறித்து வைக்கப்பட்ட விஷயங்கள் நிலைத்திருக்க, தொழில்நுட்பத்தின் உதவியுடன் இந்த புதிய முயற்சி. இப்படி பகிரப்பட்ட தகவல்கள், உலகின் மிகப் பெரிய நிறுவனங்களும் உபயோகிக்கும் அமேஜான் நிறுவனத்தின் database serviceஇல் உருவாக்கப்பட்டு, அவர்களது தகவல் பாதுகாப்பு தொழில்நுட்பத்தின் மூலம் பத்திரமாக இருக்கும்படி அமைக்கப்பெற்றுள்ளது.<br /><br />
        இத்தளத்தில் பகிரப்பட்ட தகவல்கள், திருமாளிகை மற்றும் கோயில் நிர்வாகத்தினால் மட்டுமே பயன்படுத்தப்படும். இத்தளத்தின் மூலம் பகிரப்பட்ட எந்தவொரு தகவலும், திருமாளிகை மற்றும் கோயில் நிர்வாகத்தினால் வெளியிடப்படாது என்பதை உறுதியாக தெரிவித்துக்கொள்கிறோம்.<br /><br />
        மேலும், இத்தளத்தின் மூலம், திருமாளிகை சிஷ்யர்கள், திருமாளிகை / திருக்கடிகை திருக்கோயில்களின் நிகழ்ச்சிகள் மற்றும் ஆச்சார்யன் நியமனத்தில் நடக்கும் உபன்யாஸங்கள் / இதர நிகழ்வுகள் பற்றிய தகவல்களை அறியலாம். 
        </p>
        <h2 className={styles.subheading}>சிஷ்யர்கள் பற்றிய தகவல்கள்</h2>
        <ol className={styles.list}>
            <li className={styles.listitem}>முழுபெயர் </li>
            <li className={styles.listitem}>தொலைபேசி எண்</li>
            <li className={styles.listitem}>மின்னஞ்சல் முகவரி (இருப்பின்)</li>
            <li className={styles.listitem}>வீட்டு முகவரி</li>
            <li className={styles.listitem}>பிறப்பு<sup>1</sup></li>
            <li className={styles.listitem}>குடும்பம்<sup>2</sup></li>
            <li className={styles.listitem}>திருமாளிகை சம்பந்தம்<sup>3</sup></li>
            <li className={styles.listitem}>லௌகீக / வைதீக பணி<sup>4</sup></li>
            <li className={styles.listitem}>முக்கிய தேதிகள்<sup>5</sup></li>
            <li className={styles.listitem}>திறமைகள் மற்றும் ஆர்வங்கள்<sup>6</sup></li>
        </ol>
        <hr className={styles.separator} />
        <div className={styles.footnote}>
            <p><sup>1</sup> பிறந்த தேதி, கோத்திரம், தமிழ் வருடம், தமிழ் மாதம், நட்சத்திரம்</p>
            <p><sup>2</sup> மனைவி, மக்கள் தம் பெயர்களும் தொலைபேசி எண்களும்</p>
            <p><sup>3</sup> பஞ்சஸம்ஸ்காரம் நடந்ததா, ஆச்சார்யன் யார் என்ற விவரங்கள்</p>
            <p><sup>4</sup> வைதீகம், கோயில் கைங்கர்யம், குடும்பவேலை, ஓய்வு பெற்றவர், அரசு/தனியார் வேலை, சுயவேலை (விருப்பமிருப்பின்)</p>
            <p><sup>5</sup> திருமணம், குழந்தைகள் பிறப்பு (விருப்பமிருப்பின்)</p>
            <p><sup>6</sup> இசை, எழுத்து, தொண்டு (விருப்பமிருப்பின்)</p>
        </div>
    </div>
    );
}
