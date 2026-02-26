// Auto-generated from JSON files - Bilingual option constants

import country from '@constants/country_prefix.json';
export const countryOptions: string[] = country.list
        .map(({ name }) => name)
        .filter((name): name is string => Boolean(name));

export interface BilingualOption {
  en: string;
  ta: string;
}

export const addressTypes: BilingualOption[] = [
  {
    en: "Current Address",
    ta: "தற்போதைய முகவரி",
  },
  {
    en: "Permanent Address",
    ta: "நிரந்தர முகவரி",
  },
];

export const birthStars: BilingualOption[] = [
  {
    en: "Aswini",
    ta: "அஸ்வினி",
  },
  {
    en: "Barani",
    ta: "பரணி",
  },
  {
    en: "Kruthikai",
    ta: "க்ருத்திகை",
  },
  {
    en: "Rohini",
    ta: "ரோகிணி",
  },
  {
    en: "Mirugasiridam",
    ta: "மிருகசீரிஷம்",
  },
  {
    en: "Thiruvadhirai",
    ta: "திருவாதிரை",
  },
  {
    en: "Punarpoosam",
    ta: "புனர்பூசம்",
  },
  {
    en: "Poosam",
    ta: "பூசம்",
  },
  {
    en: "Ayilyam",
    ta: "ஆயிலயம்",
  },
  {
    en: "Magam",
    ta: "மகம்",
  },
  {
    en: "Pooram",
    ta: "பூரம்",
  },
  {
    en: "Uthiram",
    ta: "உத்திரம்",
  },
  {
    en: "Astham",
    ta: "அஸ்தம்",
  },
  {
    en: "Chithirai",
    ta: "சித்திரை",
  },
  {
    en: "Swathi",
    ta: "சுவாதி",
  },
  {
    en: "Visakam",
    ta: "விசாகம்",
  },
  {
    en: "Anusham",
    ta: "அனுஷம்",
  },
  {
    en: "Kettai",
    ta: "கேட்டை",
  },
  {
    en: "Mulam",
    ta: "மூலம்",
  },
  {
    en: "Puradam",
    ta: "பூராடம்",
  },
  {
    en: "Uthiradam",
    ta: "உத்திராடம்",
  },
  {
    en: "Tiruvonam",
    ta: "திருவோணம்",
  },
  {
    en: "Avittam",
    ta: "அவிட்டம்",
  },
  {
    en: "Sadayam",
    ta: "சதயம்",
  },
  {
    en: "Purattadhi",
    ta: "பூரட்டாதி",
  },
  {
    en: "Uttrttadhi",
    ta: "உத்திரட்டாதி",
  },
  {
    en: "Revathi",
    ta: "ரேவதி",
  },
];

export const genders: BilingualOption[] = [
  { en: "Male", ta: "ஆண்" },
  { en: "Female", ta: "பெண்" },
];

export const interests: BilingualOption[] = [
  { ta: "இசை", en: "Music" },
  { ta: "ஓவியம்", en: "Painting" },
  { ta: "நடனம்", en: "Dance" },
  { ta: "சுலோகங்கள் / பிரபந்தம்", en: "Shlokas / Prabandam" },
  { ta: "உபந்யாஸம்", en: "Upanyasa" },
  { ta: "இலக்கியம்", en: "Literature" },
  { ta: "மென்பொருள்", en: "Software" },
  { ta: "சேவை / கைங்கர்யங்கள்", en: "Service" },
];

export const marriageStatuses: BilingualOption[] = [
  { en: "Single", ta: "திருமணமாகாதவர்" },
  { en: "Married", ta: "திருமணமானவர்" },
  { en: "Widowed", ta: "துணையிழந்தவர்" },
  { en: "Divorced", ta: "விவாகரத்தானவர்" },
];

export const panchasamskaram: BilingualOption[] = [
  { en: "Not done", ta: "நடக்கவில்லை" },
  { en: "Sri U.Ve Periyappangar Swamy", ta: "ஶ்ரீ உ.வே பெரியப்பங்கார் ஸ்வாமி" },
  { en: "Sri U.Ve Singarachar Swamy", ta: "ஶ்ரீ உ.வே சிங்கராசர் ஸ்வாமி" },
  { en: "Sri U.Ve Yoganrusimhan Swamy", ta: "ஶ்ரீ உ.வே யோகந்ருசிம்மன் ஸ்வாமி" },
];

export const participationEvents: BilingualOption[] = [
  {
    en: "Maasi Uthiraadam",
    ta: "மாசி உத்திராடம்",
  },
  {
    en: "Thirumaligai Mandagapadi",
    ta: "திருமாளிகை மண்டகப்படி",
  },
  {
    en: "Mahacharyar Mahotsavam",
    ta: "மஹாசார்யர் மஹோத்ஸவம்",
  },
  {
    en: "Thirukkadigai Utsavams",
    ta: "திருக்கடிகை உற்சவங்கள்",
  },
  {
    en: "Divyadesa Mangalasasanams",
    ta: "திவ்யதேச மங்களாசாசனங்கள்",
  },
  {
    en: "Other Religious Events",
    ta: "இதர நிகழ்வுகள்",
  },
];

export const professions: BilingualOption[] = [
  { en: "Vaideeham", ta: "வைதீக வேலை" },
  { en: "Temple Kainkaryam", ta: "கோயில் கைங்கர்யம்" },
  { en: "Teaching", ta: "பாடசாலை வேலை" },
  { en: "Student", ta: "மாணவர்" },
  { en: "Employed in Pvt/Govt", ta: "அரசு/தனியார் வேலை" },
  { en: "Homemaker", ta: "வீட்டுப்பணியாளர்" },
  { en: "Retired", ta: "ஓய்வுபெற்றவர்" },
  { en: "Self-employed", ta: "சுய தொழில்" },
];

export const tamilMonths: BilingualOption[] = [
  {
    ta: "சித்திரை",
    en: "Chithirai",
  },
  {
    ta: "வைகாசி",
    en: "Vaikasi",
  },
  {
    ta: "ஆனி",
    en: "Aani",
  },
  {
    ta: "ஆடி",
    en: "Aadi",
  },
  {
    ta: "ஆவணி",
    en: "Aavani",
  },
  {
    ta: "புரட்டாசி",
    en: "Purattaasi",
  },
  {
    ta: "ஐப்பசி",
    en: "Aippasi",
  },
  {
    ta: "கார்த்திகை",
    en: "Kaarthigai",
  },
  {
    ta: "மார்கழி",
    en: "Maargazhi",
  },
  {
    ta: "தை",
    en: "Thai",
  },
  {
    ta: "மாசி",
    en: "Maasi",
  },
  {
    ta: "பங்குனி",
    en: "Panguni",
  },
];

export const titles: BilingualOption[] = [
  {
    en: "Your Identity",
    ta: "உங்கள் அடையாளம்",
  },
  {
    en: "Address Details",
    ta: "முகவரி விவரங்கள்",
  },
  {
    en: "Your Details",
    ta: "உங்கள் விவரங்கள்",
  },
  {
    en: "Family Details",
    ta: "குடும்ப விவரங்கள்",
  },
  {
    en: "Communication",
    ta: "தொலைதொடர்பு",
  },
  {
    en: "Submission",
    ta: "சமர்ப்பித்தல்",
  },
  {
    en: "Confirmation",
    ta: "உறுதிப்படுத்தல்",
  },
  {
    en: "Completion",
    ta: "நிறைவு",
  },
];
