
{/* ---------------------------------------------------------------------------
    Component: English Home Content Component
    Created: 01-January-2026
    Purpose: To display the English content for the Home page when English language 
             is selected.
    --------------------------------------------------------------------------*/}
import styles from '@styles/EnglishHomeContent.module.css';

export default function EnglishHomeContent() {

  return (
    <div className={styles.innerBox}>
          <h2 className={`${styles.subtitle}`}>
            Cholasimmapuram Koyil Kandhadai Chandamarutham
          </h2>
          <h1 className={`${styles.title}`}>Doddaiyachar Swami Thirumaligai</h1>
          <h2 className={styles.subtitle}>(KKC Periyappangar Swamy Thirumaligai)</h2>
          <hr className={styles.separator} />
          <p className={`${styles.regularParagraph}`}>
            This is a dedicated information sharing platform for Thirumaligai disciples.<br /><br />
            Through this platform, disciples can share the following information about themselves. This new initiative leverages technology to securely store information that was previously maintained in Excel sheets and diaries. The shared information is securely stored using well-reputed database services with very reliable data-security capabilities from Amazon that are extensively used by many large organisations worldwide.<br /><br />
            The information shared on this platform will only be used by the Thirumaligai. We assure you that no information shared on this platform will be disclosed or shared outside by the Thirumaligai administration.<br /><br />
            Additionally, through this platform, Thirumaligai disciples can stay informed about events related to Thirumaligai / Thirukkadigai Temple and discourses / other events that take place on direction from our Acharyan.
          </p>
          <h2 className={`${styles.subheading}`}>Information about Disciples</h2>
          <ol className={styles.list}>
            <li className={`${styles.listitem}`}>Full Name</li>
            <li className={`${styles.listitem}`}>Phone Number</li>
            <li className={`${styles.listitem}`}>Email Address (if available)</li>
            <li className={`${styles.listitem}`}>Home Address</li>
            <li className={`${styles.listitem}`}>Birth Details<sup>1</sup></li>
            <li className={`${styles.listitem}`}>Family Details<sup>2</sup></li>
            <li className={`${styles.listitem}`}>Thirumaligai Association<sup>3</sup></li>
            <li className={`${styles.listitem}`}>Profession<sup>4</sup></li>
            <li className={`${styles.listitem}`}>Important Dates<sup>5</sup></li>
            <li className={`${styles.listitem}`}>Skills and Interests<sup>6</sup></li>
          </ol>
          <hr className={styles.separator} />
          <div className={`${styles.footnote}`}>
            <p><sup>1</sup> Date of Birth, Gotra, Tamil Year, Tamil Month, Nakshatra</p>
            <p><sup>2</sup> Spouse, children's names and phone numbers</p>
            <p><sup>3</sup> Details of Panchasamskaram, Acharyan's name</p>
            <p><sup>4</sup> Vaidheekam, temple service, family business, retired, government/private job, self-employed (optional)</p>
            <p><sup>5</sup> Marriage, children's birth (optional)</p>
            <p><sup>6</sup> Music, writing, volunteering (optional)</p>
          </div>
        </div>
    );
}
