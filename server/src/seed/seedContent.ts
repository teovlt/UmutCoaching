import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Faq } from "../models/Faq.js";
import { Programme } from "../models/Programme.js";
import { getSettings } from "../models/Settings.js";

// Starting content, written to look finished so the site can go online:
// Umut reviews and corrects it in /admin. Facts he confirmed (23/11/2026,
// docs/05-decisions.md) are used as is; the rest (prices within the 80–110
// range he gave, wording, city and gym) is a coherent first draft, listed in
// docs/05-decisions.md D24.
// Never invented, because they would mislead visitors or break the law: no
// testimonials (need a client's written consent), no result figures, no
// diploma or professional card (Q13), no SIRET, legal name or insurance (Q16):
// those stay [À CONFIRMER] until he gives them.
//
// Safe to run again: existing programmes (by slug), FAQ entries (by question)
// and settings fields already filled are left untouched, so edits made in
// /admin are never overwritten. With --overwrite, the seeded programmes, FAQ
// entries and settings fields are reset to the values below (other content
// is kept).
// In production, from the api container: node dist/seed/seedContent.js

const overwrite = process.argv.includes("--overwrite");

const programmes = [
  {
    slug: "coaching-individuel",
    title: "Coaching individuel",
    summary: "Séances 1:1 en salle : technique, charges et progression suivies de près.",
    audience: "Perte ou prise de poids, prise de muscle, gain de force, posture. Débutants comme sportifs confirmés.",
    format: "salle",
    duration: "45–75 min",
    priceFrom: 80,
    priceUnit: "séance",
    currency: "EUR",
    includes: [
      "Première séance : bilan complet, mensurations et objectifs",
      "Programme écrit pour vous, ajusté chaque semaine",
      "Correction de la technique sur chaque exercice",
      "Suivi des charges et des mensurations séance après séance",
      "Questions entre les séances sur WhatsApp, réponse sous 24 h",
    ],
    steps: [
      { label: "Bilan", text: "Mensurations, historique, objectifs et photo de départ si vous le souhaitez." },
      { label: "Plan", text: "Un programme adapté à votre niveau, à votre emploi du temps et à votre objectif." },
      { label: "Séances", text: "1 à 2 séances par semaine ensemble : technique, charges, intensité." },
      { label: "Ajustements", text: "Le programme évolue chaque semaine selon vos chiffres et votre récupération." },
    ],
    featured: true,
    order: 0,
  },
  {
    slug: "coaching-en-ligne",
    title: "Coaching en ligne",
    summary: "Programme personnalisé, bilan chaque dimanche, ajustements à distance.",
    audience: "Débutants et sportifs amateurs qui s'entraînent seuls et veulent un cadre et un suivi.",
    format: "hybride",
    duration: "bilan hebdo",
    priceFrom: 110,
    priceUnit: "mois",
    currency: "EUR",
    includes: [
      "Bilan de départ en visio ou en salle",
      "Programme personnalisé dans un Google Sheets",
      "Bilan chaque dimanche : charges, mensurations, ressenti",
      "Programme ajusté chaque semaine",
      "Échanges sur WhatsApp, réponse sous 24 h",
    ],
    steps: [
      { label: "Bilan", text: "Un échange pour faire le point : niveau, matériel disponible, objectifs, contraintes." },
      { label: "Programme", text: "Vous recevez votre programme détaillé, exercice par exercice, avec les charges cibles." },
      { label: "Dimanche", text: "Vous envoyez votre bilan de la semaine : séances réalisées, chiffres, photos si vous le souhaitez." },
      { label: "Ajustements", text: "Le programme de la semaine suivante est mis à jour à partir de votre bilan." },
    ],
    order: 1,
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    summary: "Accompagnement alimentaire avec Manon, nutritionniste, en complément de l'entraînement.",
    audience: "Personnes qui s'entraînent sans savoir comment adapter leur alimentation à leur objectif.",
    format: "en-ligne",
    includes: ["Bilan alimentaire", "Recommandations adaptées à votre objectif", "Suivi à distance"],
    order: 2,
    // Hidden until Manon's qualification and the offer are confirmed (Q15)
    visible: false,
  },
  {
    slug: "pre-post-natal",
    title: "Pré / post-natal",
    summary: "Renforcement adapté pendant et après la grossesse, avec l'accord de votre médecin ou sage-femme.",
    audience: "Futures et jeunes mamans souhaitant garder ou reprendre une activité encadrée.",
    format: "hybride",
    order: 3,
    // Health-sensitive: hidden until the qualification and format are confirmed (Q18)
    visible: false,
  },
];

const faqs = [
  {
    question: "Je débute complètement, c'est pour moi ?",
    answer:
      "Oui. La première séance sert justement à partir de votre niveau réel : on apprend les mouvements de base avant d'ajouter de la charge.",
  },
  {
    question: "Combien de séances par semaine ?",
    answer: "En général 1 à 2 séances avec moi, complétées si besoin par des séances en autonomie prévues dans votre programme.",
  },
  {
    question: "Comment se passe la première séance ?",
    answer:
      "Mensurations détaillées, échange sur vos objectifs et votre historique, photo de départ si vous le souhaitez, puis une première prise en main en salle.",
  },
  {
    question: "Comment se passe le coaching en ligne ?",
    answer:
      "Votre programme est dans un Google Sheets, on échange sur WhatsApp, vous faites votre bilan chaque dimanche et je réponds sous 24 h.",
  },
  {
    question: "Faut-il un abonnement à une salle ?",
    answer:
      "Pour le coaching individuel, oui : les séances ont lieu en salle et l'accès reste à votre charge. Pour le coaching en ligne, le programme s'adapte au matériel dont vous disposez.",
  },
  {
    question: "En combien de temps verrai-je des résultats ?",
    answer:
      "Cela dépend de votre point de départ, de votre régularité et de votre récupération. C'est pour ça que tout est mesuré : on voit chaque semaine ce qui bouge et on ajuste.",
  },
  {
    question: "Puis-je annuler une séance ?",
    answer: "Oui, gratuitement jusqu'à 24 h avant. Au-delà, la séance est due.",
  },
  {
    question: "Comment payer ?",
    answer: "En espèces ou par virement.",
  },
  {
    question: "Dans quelle langue se passe le coaching ?",
    answer: "En français, en turc ou en anglais, au choix.",
  },
];

// D18: no "years of experience", he is a new coach
const metrics = [{ value: "24", unit: "h", label: "délai de réponse" }];

// Contact details confirmed by Umut on 23/11/2026; city and gym from his
// answers to Q1/Q14 ("Bellegarde", "peut-être Profit Valserhône"), to check
const siteSettings = {
  city: "Bellegarde-sur-Valserine",
  country: "France",
  gym: "Profit Valserhône",
  phone: "06 31 76 49 99",
  email: "umut.coachsportif@gmail.com",
  hours: "lun–ven 09:00–18:00 · sam 09:00–15:00",
};

const socials = [
  { label: "Instagram", url: "https://www.instagram.com/umut.coachsportif" },
  { label: "TikTok", url: "https://www.tiktok.com/@umut.coachsportif" },
];

const about = {
  title: "Umut, coach musculation.",
  text: [
    "Je m'entraîne en musculation depuis plus de quatre ans. Ce qui m'a fait progresser, ce n'est pas la motivation du moment : c'est de noter mes séances, de mesurer et d'ajuster.",
    "C'est cette méthode que je vous propose : un point de départ chiffré, un programme écrit pour vous et revu chaque semaine, et un suivi au kilo près.",
    "Je coache en salle à Bellegarde-sur-Valserine et en ligne, en français, en turc ou en anglais. Débutant ou confirmé, on part de votre niveau réel.",
  ].join("\n\n"),
  tags: ["force", "prise-de-masse", "sèche"],
};

// Confirmed on 23/11/2026; VAT depends on his legal status (Q16), shown on the
// site as [À CONFIRMER] until set in /admin › Mentions légales
const pricingTerms = [
  "Bilan de départ inclus dans les offres",
  "Sans engagement de durée",
  "Annulation gratuite jusqu'à 24 h avant, sinon la séance est due",
  "Paiement en espèces ou par virement",
];

// English and Turkish versions of the content above (docs/05-decisions.md
// D25), stored under `i18n` and editable in /admin. Same facts, translated.
const programmeTranslations: Record<string, { en: object; tr: object }> = {
  "coaching-individuel": {
    en: {
      title: "One-to-one coaching",
      summary: "One-to-one sessions at the gym: technique, loads and progress closely tracked.",
      audience: "Weight loss or gain, muscle gain, strength gain, posture. Beginners and experienced lifters alike.",
      duration: "45–75 min",
      priceUnit: "session",
      includes: [
        "First session: full assessment, measurements and goals",
        "A programme written for you, adjusted every week",
        "Technique corrected on every exercise",
        "Loads and measurements tracked session after session",
        "Questions between sessions on WhatsApp, reply within 24 h",
      ],
      steps: [
        { label: "Assessment", text: "Measurements, history, goals and a starting photo if you wish." },
        { label: "Plan", text: "A programme suited to your level, your schedule and your goal." },
        { label: "Sessions", text: "1 to 2 sessions a week together: technique, loads, intensity." },
        { label: "Adjustments", text: "The programme changes every week based on your numbers and your recovery." },
      ],
    },
    tr: {
      title: "Birebir koçluk",
      summary: "Salonda birebir seanslar: teknik, ağırlıklar ve ilerleme yakından takip edilir.",
      audience: "Kilo verme veya alma, kas kazanımı, kuvvet artışı, duruş. Yeni başlayanlar da deneyimli sporcular da.",
      duration: "45–75 dk",
      priceUnit: "seans",
      includes: [
        "İlk seans: kapsamlı değerlendirme, ölçüler ve hedefler",
        "Size özel yazılan, her hafta güncellenen bir program",
        "Her egzersizde teknik düzeltme",
        "Ağırlıklar ve ölçüler seanstan seansa takip edilir",
        "Seanslar arasında WhatsApp'tan sorular, 24 saat içinde yanıt",
      ],
      steps: [
        { label: "Değerlendirme", text: "Ölçüler, geçmiş, hedefler ve isterseniz bir başlangıç fotoğrafı." },
        { label: "Plan", text: "Seviyenize, programınıza ve hedefinize uygun bir program." },
        { label: "Seanslar", text: "Haftada 1-2 ortak seans: teknik, ağırlık, yoğunluk." },
        { label: "Ayarlamalar", text: "Program, rakamlarınıza ve toparlanmanıza göre her hafta güncellenir." },
      ],
    },
  },
  "coaching-en-ligne": {
    en: {
      title: "Online coaching",
      summary: "A personalised programme, a check-in every Sunday, adjustments from a distance.",
      audience: "Beginners and amateur athletes who train on their own and want structure and follow-up.",
      duration: "weekly check-in",
      priceUnit: "month",
      includes: [
        "Starting assessment by video call or at the gym",
        "A personalised programme in a Google Sheet",
        "Check-in every Sunday: loads, measurements, how you feel",
        "Programme adjusted every week",
        "Chat on WhatsApp, reply within 24 h",
      ],
      steps: [
        { label: "Assessment", text: "A call to take stock: level, equipment available, goals, constraints." },
        { label: "Programme", text: "You receive your detailed programme, exercise by exercise, with target loads." },
        { label: "Sunday", text: "You send your weekly check-in: sessions done, numbers, photos if you wish." },
        { label: "Adjustments", text: "Next week's programme is updated from your check-in." },
      ],
    },
    tr: {
      title: "Online koçluk",
      summary: "Kişiye özel program, her pazar haftalık değerlendirme, uzaktan ayarlamalar.",
      audience: "Tek başına antrenman yapan, bir çerçeve ve takip isteyen yeni başlayanlar ve amatör sporcular.",
      duration: "haftalık değerlendirme",
      priceUnit: "ay",
      includes: [
        "Görüntülü görüşmeyle veya salonda başlangıç değerlendirmesi",
        "Google Sheets'te kişiye özel program",
        "Her pazar değerlendirme: ağırlıklar, ölçüler, hisler",
        "Her hafta güncellenen program",
        "WhatsApp üzerinden iletişim, 24 saat içinde yanıt",
      ],
      steps: [
        { label: "Değerlendirme", text: "Durum tespiti için bir görüşme: seviye, mevcut ekipman, hedefler, kısıtlar." },
        { label: "Program", text: "Hedef ağırlıklarla, egzersiz egzersiz detaylı programınızı alırsınız." },
        { label: "Pazar", text: "Haftalık değerlendirmenizi gönderirsiniz: yapılan seanslar, rakamlar, isterseniz fotoğraflar." },
        { label: "Ayarlamalar", text: "Sonraki haftanın programı değerlendirmenize göre güncellenir." },
      ],
    },
  },
  nutrition: {
    en: {
      title: "Nutrition",
      summary: "Nutrition support with Manon, nutritionist, alongside your training.",
      audience: "People who train without knowing how to adapt their diet to their goal.",
      includes: ["Diet assessment", "Recommendations suited to your goal", "Remote follow-up"],
    },
    tr: {
      title: "Beslenme",
      summary: "Antrenmanınıza ek olarak diyetisyen Manon ile beslenme desteği.",
      audience: "Antrenman yapan ama beslenmesini hedefine göre nasıl ayarlayacağını bilmeyenler.",
      includes: ["Beslenme değerlendirmesi", "Hedefinize uygun öneriler", "Uzaktan takip"],
    },
  },
  "pre-post-natal": {
    en: {
      title: "Pre / postnatal",
      summary: "Adapted strength training during and after pregnancy, with your doctor's or midwife's approval.",
      audience: "Expecting and new mothers who want to keep up or resume a supervised activity.",
    },
    tr: {
      title: "Doğum öncesi / sonrası",
      summary: "Doktorunuzun veya ebenizin onayıyla, hamilelik sırasında ve sonrasında uyarlanmış kuvvet antrenmanı.",
      audience: "Gözetimli bir aktiviteyi sürdürmek veya yeniden başlamak isteyen anne adayları ve yeni anneler.",
    },
  },
};

// Keyed by the French question
const faqTranslations: Record<string, { en: object; tr: object }> = {
  "Je débute complètement, c'est pour moi ?": {
    en: {
      question: "I'm a complete beginner, is this for me?",
      answer: "Yes. The first session is there precisely to start from your real level: we learn the basic movements before adding load.",
    },
    tr: {
      question: "Tamamen yeni başlıyorum, bu bana uygun mu?",
      answer: "Evet. İlk seans tam olarak gerçek seviyenizden başlamak içindir: ağırlık eklemeden önce temel hareketleri öğreniriz.",
    },
  },
  "Combien de séances par semaine ?": {
    en: {
      question: "How many sessions a week?",
      answer: "Usually 1 to 2 sessions with me, plus, if needed, sessions on your own planned in your programme.",
    },
    tr: {
      question: "Haftada kaç seans?",
      answer: "Genellikle benimle 1-2 seans; gerekirse programınızda planlanan bireysel seanslarla tamamlanır.",
    },
  },
  "Comment se passe la première séance ?": {
    en: {
      question: "What happens in the first session?",
      answer:
        "Detailed measurements, a talk about your goals and your history, a starting photo if you wish, then a first hands-on session at the gym.",
    },
    tr: {
      question: "İlk seans nasıl geçiyor?",
      answer:
        "Detaylı ölçüler, hedefleriniz ve geçmişiniz üzerine bir konuşma, isterseniz başlangıç fotoğrafı, ardından salonda ilk uygulama.",
    },
  },
  "Comment se passe le coaching en ligne ?": {
    en: {
      question: "How does online coaching work?",
      answer: "Your programme is in a Google Sheet, we chat on WhatsApp, you send your check-in every Sunday and I reply within 24 h.",
    },
    tr: {
      question: "Online koçluk nasıl işliyor?",
      answer:
        "Programınız bir Google Sheets dosyasında, WhatsApp'tan yazışırız, her pazar değerlendirmenizi gönderirsiniz ve 24 saat içinde yanıt veririm.",
    },
  },
  "Faut-il un abonnement à une salle ?": {
    en: {
      question: "Do I need a gym membership?",
      answer:
        "For one-to-one coaching, yes: sessions take place at the gym and access is at your expense. For online coaching, the programme adapts to the equipment you have.",
    },
    tr: {
      question: "Salon üyeliği gerekiyor mu?",
      answer:
        "Birebir koçluk için evet: seanslar salonda yapılır ve salon erişimi size aittir. Online koçlukta program, elinizdeki ekipmana göre uyarlanır.",
    },
  },
  "En combien de temps verrai-je des résultats ?": {
    en: {
      question: "How soon will I see results?",
      answer:
        "It depends on your starting point, your consistency and your recovery. That's why everything is measured: we see what moves every week and adjust.",
    },
    tr: {
      question: "Sonuçları ne zaman görürüm?",
      answer:
        "Başlangıç noktanıza, düzenliliğinize ve toparlanmanıza bağlıdır. Bu yüzden her şey ölçülür: her hafta neyin değiştiğini görür ve ayarlarız.",
    },
  },
  "Puis-je annuler une séance ?": {
    en: { question: "Can I cancel a session?", answer: "Yes, free of charge up to 24 h before. After that, the session is due." },
    tr: { question: "Bir seansı iptal edebilir miyim?", answer: "Evet, 24 saat öncesine kadar ücretsiz. Sonrasında seans ücreti alınır." },
  },
  "Comment payer ?": {
    en: { question: "How do I pay?", answer: "In cash or by bank transfer." },
    tr: { question: "Nasıl ödeme yapılır?", answer: "Nakit veya banka havalesiyle." },
  },
  "Dans quelle langue se passe le coaching ?": {
    en: { question: "In which language is the coaching?", answer: "In French, Turkish or English, as you prefer." },
    tr: { question: "Koçluk hangi dilde yapılıyor?", answer: "Fransızca, Türkçe veya İngilizce, tercihinize göre." },
  },
};

const settingsTranslations = {
  en: {
    hours: "Mon–Fri 09:00–18:00 · Sat 09:00–15:00",
    aboutTitle: "Umut, strength coach.",
    aboutText: [
      "I have been strength training for more than four years. What made me progress was not the motivation of the moment: it was logging my sessions, measuring and adjusting.",
      "That is the method I offer you: a measured starting point, a programme written for you and reviewed every week, and progress tracked to the kilo.",
      "I coach at the gym in Bellegarde-sur-Valserine and online, in French, Turkish or English. Beginner or experienced, we start from your real level.",
    ].join("\n\n"),
    aboutTags: ["strength", "muscle-gain", "cutting"],
    pricingTerms: [
      "Starting assessment included in every offer",
      "No minimum commitment",
      "Free cancellation up to 24 h before, otherwise the session is due",
      "Payment in cash or by bank transfer",
    ],
    metrics: [{ value: "24", unit: "h", label: "reply time" }],
  },
  tr: {
    hours: "Pzt–Cum 09:00–18:00 · Cmt 09:00–15:00",
    aboutTitle: "Umut, fitness koçu.",
    aboutText: [
      "Dört yılı aşkın süredir ağırlık antrenmanı yapıyorum. Beni ilerleten anlık motivasyon değil; seanslarımı kaydetmek, ölçmek ve ayarlamaktı.",
      "Size sunduğum yöntem de bu: ölçülmüş bir başlangıç noktası, size özel yazılan ve her hafta gözden geçirilen bir program, kilosu kilosuna takip edilen bir ilerleme.",
      "Bellegarde-sur-Valserine'de salonda ve online olarak, Fransızca, Türkçe veya İngilizce koçluk yapıyorum. Yeni başlayan ya da deneyimli, gerçek seviyenizden başlıyoruz.",
    ].join("\n\n"),
    aboutTags: ["kuvvet", "kas-kazanımı", "definasyon"],
    pricingTerms: [
      "Başlangıç değerlendirmesi tüm tekliflere dahil",
      "Süre taahhüdü yok",
      "24 saat öncesine kadar ücretsiz iptal, sonrasında seans ücreti alınır",
      "Nakit veya banka havalesiyle ödeme",
    ],
    metrics: [{ value: "24", unit: "sa", label: "yanıt süresi" }],
  },
};

/** "…moi ?" with a plain or non-breaking space: same key */
const sameText = (value: string) => value.replace(/[\u00a0\u202f]/g, " ");
const faqTranslation = (question: string) => Object.entries(faqTranslations).find(([fr]) => sameText(fr) === sameText(question))?.[1];

const run = async () => {
  await connectDB();
  if (overwrite) console.log("--overwrite: seeded content is reset");

  let created = 0;
  let translated = 0;
  for (const programme of programmes) {
    const i18n = programmeTranslations[programme.slug];
    const doc = { ...programme, ...(i18n ? { i18n } : {}) };
    const result = overwrite
      ? await Programme.updateOne({ slug: programme.slug }, { $set: doc }, { upsert: true })
      : await Programme.updateOne({ slug: programme.slug }, { $setOnInsert: doc }, { upsert: true });
    created += result.upsertedCount;
    // A programme seeded before the translations existed gets them, unless
    // an English title was already typed in /admin
    if (!overwrite && i18n && !result.upsertedCount) {
      const filled = await Programme.updateOne({ slug: programme.slug, "i18n.en.title": { $in: ["", null] } }, { $set: { i18n } });
      translated += filled.modifiedCount;
    }
  }
  if (translated) console.log(`Programmes: English and Turkish added to ${translated}`);
  console.log(`Programmes: ${created} created, ${programmes.length - created} ${overwrite ? "reset" : "already there"}`);

  created = 0;
  translated = 0;
  for (const [order, faq] of faqs.entries()) {
    const i18n = faqTranslation(faq.question);
    const doc = { ...faq, order, pages: ["accueil"], ...(i18n ? { i18n } : {}) };
    const result = await Faq.updateOne({ question: faq.question }, overwrite ? { $set: doc } : { $setOnInsert: doc }, { upsert: true });
    created += result.upsertedCount;
    if (!overwrite && i18n && !result.upsertedCount) {
      const filled = await Faq.updateOne({ question: faq.question, "i18n.en.question": { $in: ["", null] } }, { $set: { i18n } });
      translated += filled.modifiedCount;
    }
  }
  if (translated) console.log(`FAQ: English and Turkish added to ${translated}`);
  console.log(`FAQ: ${created} created, ${faqs.length - created} ${overwrite ? "reset" : "already there"}`);

  // Without --overwrite, only empty fields are filled: a value set in /admin
  // is never replaced
  const settings = await getSettings();
  const filled: string[] = [];
  const fill = (field: string, value: unknown, isEmpty: boolean) => {
    if (overwrite || isEmpty) {
      settings.set(field, value);
      filled.push(field);
    }
  };
  for (const [field, value] of Object.entries(siteSettings)) fill(field, value, !settings.get(field));
  fill("metrics", metrics, settings.metrics.length === 0);
  fill(
    "socials",
    socials,
    settings.socials.every((s) => !s.url),
  );
  fill("about.title", about.title, !settings.about?.title);
  fill("about.text", about.text, !settings.about?.text);
  fill("about.tags", about.tags, !settings.about?.tags.length);
  fill("pricingTerms", pricingTerms, !settings.pricingTerms?.length);
  fill("i18n", settingsTranslations, !settings.get("i18n.en.aboutText"));
  await settings.save();
  console.log(filled.length ? `Settings: ${overwrite ? "set" : "filled"} ${filled.join(", ")}` : "Settings: already filled in");

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
