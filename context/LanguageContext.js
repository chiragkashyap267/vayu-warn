// context/LanguageContext.js
// ─────────────────────────────────────────────────────────────────────────────
// 4-language support: English · Hindi · Garhwali · Kumaoni
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { createContext, useContext, useState, useCallback } from "react";

const LanguageContext = createContext(null);

// ── Translation dictionary ────────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    // Navbar
    nav_alerts:    "Alerts",
    nav_map:       "Map",
    nav_report:    "Report",
    nav_admin:     "Admin",
    nav_emergency: "Emergency",
    nav_login:     "Login",
    nav_logout:    "Logout",
    nav_sustain:   "Impact",

    // Landing hero
    hero_badge:   "Live Disaster Monitoring",
    hero_h1_a:    "Stay Ahead of",
    hero_h1_b:    "Disaster",
    hero_desc:    "VayuWarn delivers real-time disaster alerts — powered by community reports and official data — directly to your screen. No delays. No refresh.",
    hero_btn_alerts:    "View Live Alerts",
    hero_btn_emergency: "Emergency Info",

    // Stats
    stat_alert_types:  "Alert Types",
    stat_realtime:     "Real-time Sync",
    stat_always_on:    "Always On",
    stat_community:    "Community",

    // Features section
    feat_heading: "Built for Crisis Moments",
    feat_subhead: "Every feature is designed for speed, clarity, and accessibility — especially in low-bandwidth conditions.",
    feat_alerts_title: "Real-Time Alerts",
    feat_alerts_desc:  "Instant Firestore-powered notifications for floods, landslides, earthquakes and more — no refresh needed.",
    feat_map_title:    "Live Disaster Map",
    feat_map_desc:     "Visualise all active alerts and crowd-sourced reports on an interactive map with colour-coded severity.",
    feat_reports_title:"Community Reports",
    feat_reports_desc: "Citizens can file disaster reports with photos and GPS location. Admins review and publish alerts instantly.",
    feat_emergency_title:"Emergency Mode",
    feat_emergency_desc:"One tap reveals helpline numbers, safety tips, and all nearby high-severity alerts in a high-contrast overlay.",

    // How it works
    how_heading: "How It Works",
    how_subhead: "Three roles, one mission — keep communities safe.",
    how_step1_title: "Citizen Reports",
    how_step1_desc:  "Any logged-in user spots a disaster and submits a geo-tagged report with a photo from their phone.",
    how_step2_title: "Admin Verification",
    how_step2_desc:  "Admins review the community report in the dashboard and publish a verified alert in seconds.",
    how_step3_title: "Instant Broadcast",
    how_step3_desc:  "The alert fires to every connected device via Firestore real-time sync — no refresh, under 1 second.",
    how_step4_title: "Emergency Action",
    how_step4_desc:  "Affected users open Emergency Mode to see helplines, safety tips, and high-severity alerts instantly.",

    // CTA
    cta_heading: "Prepare. Report. Survive.",
    cta_desc:    "Join the community. Report what you see. Save lives in your area.",
    cta_start:   "Get Started Free",
    cta_map:     "Open Map",

    // Alerts page
    alerts_live:       "Live Feed",
    alerts_heading:    "Active Alerts",
    alerts_connecting: "Connecting…",
    alerts_count:      "alerts · updates in real-time",
    alerts_search:     "Search by title or location…",
    alerts_no_match:   "No alerts match your filter",
    alerts_no_alerts:  "No active alerts",
    alerts_clear:      "The area is clear. Stay alert.",
    alerts_try_filter: "Try changing the filter or search term.",

    // Emergency page
    emergency_heading:   "Emergency Mode",
    emergency_desc:      "Activate to instantly see helplines, safety tips, and high-severity alerts near you.",
    emergency_activate:  "ACTIVATE EMERGENCY",
    emergency_caution:   "Only use during an actual emergency.",
    emergency_active:    "Emergency Mode Active",
    emergency_helplines: "Emergency Helplines",
    emergency_safety:    "Safety Instructions",
    emergency_high:      "Active High-Severity Alerts",
    emergency_none:      "No high-severity alerts currently active.",
    emergency_tap_call:  "Tap to call →",

    // Report page
    report_heading:   "Report a Disaster",
    report_subhead:   "Your report helps protect lives. All submissions are reviewed by our admin team.",
    report_type:      "Disaster Type",
    report_desc:      "Description",
    report_desc_ph:   "Describe what you're seeing — road blocked, water level rising, etc.",
    report_photo:     "Photo (optional, max 5 MB)",
    report_upload:    "Click to upload photo",
    report_location:  "Location",
    report_my_loc:    "Use My Location",
    report_getting:   "Getting location…",
    report_warning:   "Submitting false reports is harmful and may be prosecuted. Only report verified incidents.",
    report_submit:    "Submit Report",
    report_submitting:"Submitting…",
    report_done_h:    "Report Submitted!",
    report_done_p:    "Your report has been sent to the admin team for review. Thank you for keeping your community safe.",
    report_another:   "Submit Another Report",

    // Sustainability page
    sustain_heading:   "Sustainability Impact",
    sustain_subhead:   "How VayuWarn builds climate resilience across India",
  },

  hi: {
    // Navbar
    nav_alerts:    "अलर्ट",
    nav_map:       "नक्शा",
    nav_report:    "रिपोर्ट",
    nav_admin:     "एडमिन",
    nav_emergency: "आपातकाल",
    nav_login:     "लॉगिन",
    nav_logout:    "लॉगआउट",
    nav_sustain:   "प्रभाव",

    // Landing hero
    hero_badge:   "लाइव आपदा निगरानी",
    hero_h1_a:    "आपदा से",
    hero_h1_b:    "आगे रहें",
    hero_desc:    "वायुवार्न रियल-टाइम आपदा अलर्ट देता है — सामुदायिक रिपोर्ट और आधिकारिक डेटा द्वारा संचालित — सीधे आपकी स्क्रीन पर। कोई देरी नहीं।",
    hero_btn_alerts:    "लाइव अलर्ट देखें",
    hero_btn_emergency: "आपातकालीन जानकारी",

    // Stats
    stat_alert_types:  "अलर्ट प्रकार",
    stat_realtime:     "रियल-टाइम सिंक",
    stat_always_on:    "हमेशा चालू",
    stat_community:    "समुदाय",

    // Features section
    feat_heading: "संकट के क्षणों के लिए बनाया गया",
    feat_subhead: "हर फीचर गति, स्पष्टता और पहुंच के लिए डिज़ाइन किया गया है — कम बैंडविड्थ में भी।",
    feat_alerts_title: "रियल-टाइम अलर्ट",
    feat_alerts_desc:  "बाढ़, भूस्खलन, भूकंप आदि के लिए तत्काल Firestore-संचालित सूचनाएं — रिफ्रेश की जरूरत नहीं।",
    feat_map_title:    "लाइव आपदा नक्शा",
    feat_map_desc:     "इंटरएक्टिव नक्शे पर सभी सक्रिय अलर्ट और रिपोर्ट देखें — गंभीरता के अनुसार रंग-कोड।",
    feat_reports_title:"सामुदायिक रिपोर्ट",
    feat_reports_desc: "नागरिक फोटो और GPS लोकेशन के साथ आपदा रिपोर्ट दर्ज कर सकते हैं।",
    feat_emergency_title:"आपातकालीन मोड",
    feat_emergency_desc:"एक टैप में हेल्पलाइन नंबर, सुरक्षा टिप्स और उच्च-गंभीरता अलर्ट देखें।",

    // How it works
    how_heading: "यह कैसे काम करता है",
    how_subhead: "तीन भूमिकाएं, एक मिशन — समुदायों को सुरक्षित रखना।",
    how_step1_title: "नागरिक रिपोर्ट",
    how_step1_desc:  "कोई भी लॉग-इन उपयोगकर्ता आपदा देखकर जियो-टैग्ड रिपोर्ट फोटो सहित भेज सकता है।",
    how_step2_title: "एडमिन सत्यापन",
    how_step2_desc:  "एडमिन डैशबोर्ड में रिपोर्ट की समीक्षा करके कुछ सेकंड में सत्यापित अलर्ट प्रकाशित करते हैं।",
    how_step3_title: "तत्काल प्रसारण",
    how_step3_desc:  "अलर्ट Firestore रियल-टाइम सिंक के जरिए हर जुड़े डिवाइस पर 1 सेकंड से कम में पहुंचता है।",
    how_step4_title: "आपातकालीन कार्रवाई",
    how_step4_desc:  "प्रभावित उपयोगकर्ता आपातकालीन मोड खोलकर हेल्पलाइन, सुरक्षा टिप्स और अलर्ट देखते हैं।",

    // CTA
    cta_heading: "तैयार रहें। रिपोर्ट करें। बचें।",
    cta_desc:    "समुदाय से जुड़ें। जो देखें वो रिपोर्ट करें। अपने इलाके में जीवन बचाएं।",
    cta_start:   "मुफ्त शुरू करें",
    cta_map:     "नक्शा खोलें",

    // Alerts page
    alerts_live:       "लाइव फीड",
    alerts_heading:    "सक्रिय अलर्ट",
    alerts_connecting: "कनेक्ट हो रहा है…",
    alerts_count:      "अलर्ट · रियल-टाइम अपडेट",
    alerts_search:     "शीर्षक या स्थान से खोजें…",
    alerts_no_match:   "आपके फिल्टर से मेल खाने वाला कोई अलर्ट नहीं",
    alerts_no_alerts:  "कोई सक्रिय अलर्ट नहीं",
    alerts_clear:      "क्षेत्र सुरक्षित है। सतर्क रहें।",
    alerts_try_filter: "फिल्टर या खोज शब्द बदलें।",

    // Emergency page
    emergency_heading:   "आपातकालीन मोड",
    emergency_desc:      "सक्रिय करने पर हेल्पलाइन, सुरक्षा टिप्स और उच्च-गंभीरता अलर्ट तुरंत दिखें।",
    emergency_activate:  "आपातकाल सक्रिय करें",
    emergency_caution:   "केवल वास्तविक आपातकाल में उपयोग करें।",
    emergency_active:    "आपातकालीन मोड सक्रिय",
    emergency_helplines: "आपातकालीन हेल्पलाइन",
    emergency_safety:    "सुरक्षा निर्देश",
    emergency_high:      "सक्रिय उच्च-गंभीरता अलर्ट",
    emergency_none:      "अभी कोई उच्च-गंभीरता अलर्ट नहीं।",
    emergency_tap_call:  "कॉल करें →",

    // Report page
    report_heading:   "आपदा रिपोर्ट करें",
    report_subhead:   "आपकी रिपोर्ट जीवन बचाती है। सभी सबमिशन एडमिन टीम द्वारा समीक्षित होते हैं।",
    report_type:      "आपदा का प्रकार",
    report_desc:      "विवरण",
    report_desc_ph:   "आप क्या देख रहे हैं — सड़क अवरुद्ध, जल स्तर बढ़ रहा है, आदि।",
    report_photo:     "फोटो (वैकल्पिक, अधिकतम 5 MB)",
    report_upload:    "फोटो अपलोड करें",
    report_location:  "स्थान",
    report_my_loc:    "मेरा स्थान उपयोग करें",
    report_getting:   "स्थान प्राप्त हो रहा है…",
    report_warning:   "झूठी रिपोर्ट हानिकारक है और दंडनीय हो सकती है। केवल सत्यापित घटनाएं रिपोर्ट करें।",
    report_submit:    "रिपोर्ट सबमिट करें",
    report_submitting:"सबमिट हो रहा है…",
    report_done_h:    "रिपोर्ट सबमिट हो गई!",
    report_done_p:    "आपकी रिपोर्ट एडमिन टीम को समीक्षा के लिए भेज दी गई है। आपके समुदाय को सुरक्षित रखने के लिए धन्यवाद।",
    report_another:   "एक और रिपोर्ट करें",

    // Sustainability page
    sustain_heading:   "स्थिरता प्रभाव",
    sustain_subhead:   "वायुवार्न भारत में जलवायु लचीलापन कैसे बनाता है",
  },
  // ── Garhwali (Devanagari) ─────────────────────────────────────────────────
  ga: {
    nav_alerts: "खबर", nav_map: "नक्शो", nav_report: "रिपोर्ट", nav_admin: "एडमिन",
    nav_emergency: "आपदा", nav_login: "लॉगिन", nav_logout: "लॉगआउट", nav_sustain: "असर",
    hero_badge: "लाइव आपदा निगरानी",
    hero_h1_a: "आपदा से", hero_h1_b: "आगि रौ",
    hero_desc: "वायुवार्न रियल-टाइम आपदा खबर दिंदो — समुदाय की रिपोर्ट अर सरकारी जानकारी से — सीधो तुमरी स्क्रीन पर।",
    hero_btn_alerts: "लाइव खबर देखो", hero_btn_emergency: "आपदा जानकारी",
    stat_alert_types: "खबर के प्रकार", stat_realtime: "रियल-टाइम", stat_always_on: "हमेशा चालू", stat_community: "समुदाय",
    feat_heading: "संकट के बखत काम औंदो", feat_subhead: "हर सुविधा तेज अर साफ छन।",
    feat_alerts_title: "रियल-टाइम खबर", feat_alerts_desc: "बाढ़, भूस्खलन, भूकंप की तुरंत खबर।",
    feat_map_title: "लाइव नक्शो", feat_map_desc: "सब खबरें रंग-कोड से नक्शे पर दिखें।",
    feat_reports_title: "समुदाय रिपोर्ट", feat_reports_desc: "लोग फोटो अर GPS से रिपोर्ट भेज सकदन।",
    feat_emergency_title: "आपदा मोड", feat_emergency_desc: "एक टैप में हेल्पलाइन अर सुरक्षा टिप्स।",
    how_heading: "यी कैसे काम करदो", how_subhead: "तीन भूमिका, एक मिशन — समुदाय बचाओ।",
    how_step1_title: "नागरिक रिपोर्ट", how_step1_desc: "कोई भी यूजर आपदा देखकर GPS फोटो रिपोर्ट भेजदो।",
    how_step2_title: "एडमिन जांच", how_step2_desc: "एडमिन रिपोर्ट देखकर खबर प्रकाशित करदो।",
    how_step3_title: "तुरंत प्रसारण", how_step3_desc: "खबर 1 सेकंड में सब डिवाइस पर पौंछदी।",
    how_step4_title: "आपदा कार्रवाई", how_step4_desc: "यूजर आपदा मोड खोलकर हेल्पलाइन देखदो।",
    cta_heading: "तैयार रौ। रिपोर्ट करो। बचो।", cta_desc: "समुदाय से जुड़ो। जो देखो वो बताओ।",
    cta_start: "मुफ्त शुरू करो", cta_map: "नक्शो खोलो",
    alerts_live: "लाइव फीड", alerts_heading: "सक्रिय खबर", alerts_connecting: "जुड़ रयो छ…",
    alerts_count: "खबर · रियल-टाइम", alerts_search: "खबर या जगह खोजो…",
    alerts_no_match: "कोई खबर नि मिली", alerts_no_alerts: "कोई खबर नि छ",
    alerts_clear: "क्षेत्र सुरक्षित छ।", alerts_try_filter: "फिल्टर बदलो।",
    emergency_heading: "आपदा मोड", emergency_desc: "सक्रिय करो — हेल्पलाइन अर खबर तुरंत दिखेंली।",
    emergency_activate: "आपदा मोड चालू करो", emergency_caution: "सिर्फ असली आपदा में चालू करो।",
    emergency_active: "आपदा मोड चालू छ", emergency_helplines: "आपदा हेल्पलाइन",
    emergency_safety: "सुरक्षा निर्देश", emergency_high: "उच्च खतरा खबर",
    emergency_none: "अभी कोई उच्च खतरा नि छ।", emergency_tap_call: "कॉल करो →",
    report_heading: "आपदा रिपोर्ट करो", report_subhead: "तुमरी रिपोर्ट जीवन बचांदी।",
    report_type: "आपदा का प्रकार", report_desc: "विवरण", report_desc_ph: "क्या देख रया छौ — सड़क बंद, पानी बढ़ रयो छ…",
    report_photo: "फोटो (5 MB तक)", report_upload: "फोटो अपलोड करो",
    report_location: "जगह", report_my_loc: "मेरी जगह", report_getting: "जगह मिल रयी छ…",
    report_warning: "झूठी रिपोर्ट गलत छ। सिर्फ सच्ची घटनाएं बताओ।",
    report_submit: "रिपोर्ट भेजो", report_submitting: "भेज रयो छ…",
    report_done_h: "रिपोर्ट भेजी गे!", report_done_p: "तुमरी रिपोर्ट एडमिन टीम को मिल गी। धन्यवाद।",
    report_another: "और रिपोर्ट करो",
    sustain_heading: "स्थिरता असर", sustain_subhead: "वायुवार्न उत्तराखंड में जलवायु सुरक्षा कैसे बणांदो",
  },

  // ── Kumaoni (Devanagari) ──────────────────────────────────────────────────
  ku: {
    nav_alerts: "सूचना", nav_map: "नक्सो", nav_report: "रिपोर्ट", nav_admin: "एडमिन",
    nav_emergency: "आपद", nav_login: "लॉगिन", nav_logout: "लॉगआउट", nav_sustain: "प्रभाव",
    hero_badge: "लाइव आपद निगरानी",
    hero_h1_a: "आपद से", hero_h1_b: "आगि रौ",
    hero_desc: "वायुवार्न रियल-टाइम आपद सूचना दिंछ — समुदाय की रिपोर्ट और सरकारी जानकारी से — सीधे तुमरी स्क्रीन पर।",
    hero_btn_alerts: "लाइव सूचना देखो", hero_btn_emergency: "आपद जानकारी",
    stat_alert_types: "सूचना प्रकार", stat_realtime: "रियल-टाइम", stat_always_on: "हमेश चालू", stat_community: "समुदाय",
    feat_heading: "संकट के वखत काम औन्छ", feat_subhead: "हर सुविधा तेज अर साफ छ।",
    feat_alerts_title: "रियल-टाइम सूचना", feat_alerts_desc: "बाढ़, भूस्खलन, भूकंप की तुरंत सूचना।",
    feat_map_title: "लाइव नक्सो", feat_map_desc: "सब सूचना रंग-कोड के साथ नक्से पर दिखन।",
    feat_reports_title: "समुदाय रिपोर्ट", feat_reports_desc: "लोग फोटो और GPS से रिपोर्ट भेजि सकन।",
    feat_emergency_title: "आपद मोड", feat_emergency_desc: "एक टैप में हेल्पलाइन और सुरक्षा टिप्स।",
    how_heading: "यो कैसे काम करछ", how_subhead: "तीन भूमिका, एक मिशन — समुदाय बचाओ।",
    how_step1_title: "नागरिक रिपोर्ट", how_step1_desc: "कोई भी यूजर आपद देखिके GPS फोटो रिपोर्ट भेजछ।",
    how_step2_title: "एडमिन जाँच", how_step2_desc: "एडमिन रिपोर्ट देखिके सूचना प्रकाशित करछ।",
    how_step3_title: "तुरंत प्रसारण", how_step3_desc: "सूचना 1 सेकंड में सब डिवाइस पर पुजछ।",
    how_step4_title: "आपद कार्रवाई", how_step4_desc: "यूजर आपद मोड खोलिके हेल्पलाइन देखछ।",
    cta_heading: "तैयार रौ। रिपोर्ट करो। बचो।", cta_desc: "समुदाय से जुड़ो। जो देखो वो बताओ।",
    cta_start: "मुफ्त शुरू करो", cta_map: "नक्सो खोलो",
    alerts_live: "लाइव फीड", alerts_heading: "सक्रिय सूचना", alerts_connecting: "जुड़नै छ…",
    alerts_count: "सूचना · रियल-टाइम", alerts_search: "सूचना या जगह खोजो…",
    alerts_no_match: "कोई सूचना नि मिली", alerts_no_alerts: "कोई सूचना नि छ",
    alerts_clear: "इलाक सुरक्षित छ।", alerts_try_filter: "फिल्टर बदलो।",
    emergency_heading: "आपद मोड", emergency_desc: "चालू करो — हेल्पलाइन और सूचना तुरंत दिखिहाल।",
    emergency_activate: "आपद मोड चालू करो", emergency_caution: "सिर्फ असली आपद में चालू करो।",
    emergency_active: "आपद मोड चालू छ", emergency_helplines: "आपद हेल्पलाइन",
    emergency_safety: "सुरक्षा निर्देश", emergency_high: "उच्च खतर सूचना",
    emergency_none: "अभी कोई उच्च खतर नि छ।", emergency_tap_call: "कॉल करो →",
    report_heading: "आपद रिपोर्ट करो", report_subhead: "तुमरी रिपोर्ट जीवन बचांछ।",
    report_type: "आपद का प्रकार", report_desc: "विवरण", report_desc_ph: "क्या देख रया छौ — सड़क बंद, पाणि बढ़ रयो छ…",
    report_photo: "फोटो (5 MB तक)", report_upload: "फोटो अपलोड करो",
    report_location: "जगह", report_my_loc: "मेरी जगह", report_getting: "जगह मिलनै छ…",
    report_warning: "झूठी रिपोर्ट गलत छ। सिर्फ सच्ची घटना बताओ।",
    report_submit: "रिपोर्ट भेजो", report_submitting: "भेजनै छ…",
    report_done_h: "रिपोर्ट भेजि गे!", report_done_p: "तुमरी रिपोर्ट एडमिन टीम ले मिलि गे। धन्यवाद।",
    report_another: "और रिपोर्ट करो",
    sustain_heading: "स्थिरता प्रभाव", sustain_subhead: "वायुवार्न कुमाऊँ में जलवायु सुरक्षा कैसे बणांछ",
  },
};

// Language metadata for the picker UI
export const LANGS = [
  { code: "en", label: "EN",  flag: "🇬🇧", name: "English"   },
  { code: "hi", label: "हि",  flag: "🇮🇳", name: "हिंदी"      },
  { code: "ga", label: "गढ़", flag: "🏔️", name: "गढ़वाली"    },
  { code: "ku", label: "कुम", flag: "🏔️", name: "कुमाऊनी"    },
];

// ── Provider ──────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = useCallback((key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key, [lang]);
  // Cycle: en → hi → ga → ku → en
  const CYCLE = ["en", "hi", "ga", "ku"];
  const toggle = () => setLang((l) => CYCLE[(CYCLE.indexOf(l) + 1) % CYCLE.length]);
  const setLangDirect = (code) => setLang(code);

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLangDirect, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
