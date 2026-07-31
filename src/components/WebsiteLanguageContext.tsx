"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type WebsiteLanguage = "en" | "zh" | "ru" | "fr";

type TranslationValues = Record<string, string | number>;

type WebsiteLanguageContextValue = {
  language: WebsiteLanguage;
  setLanguage: (language: WebsiteLanguage) => void;
  t: (message: string, values?: TranslationValues) => string;
};

const STORAGE_KEY = "jinyu_website_language";
const LANGUAGE_CHANGE_EVENT = "jinyu-website-language-change";

// Chinese Dictionary
const zh: Record<string, string> = {
  "Home": "首页",
  "About": "关于我们",
  "Products": "产品中心",
  "Blog": "新闻动态",
  "Distributor": "经销商",
  "Contact": "联系我们",
  "Request a quote": "索取报价",
  "Request a Quote": "索取报价",
  "Explore products": "浏览产品",
  "Contact sales": "联系销售",
  "Quick links": "快速链接",
  "Follow us": "关注我们",
  "Your trusted manufacturer of premium lighting equipment and appliances, delivering engineering excellence and quality since 2018.": "您值得信赖的高端照明设备与电器制造商，自 2018 年起致力于卓越工程与品质。",
  "Manufacturing Excellence": "制造实力",
  "Featured Product Lines": "精选产品系列",
  "Explosion-Proof Lighting": "防爆照明",
  "Landscape & Urban Lamps": "景观与路灯",
  "OEM / ODM Custom Manufacturing": "OEM / ODM 定制制造",
  "Commercial & Industrial Lighting": "商业与工业照明",
  "Global Standards & Certifications": "国际标准与认证",
  "ISO 9001, ATEX, and CE certified production lines for extreme durability and hazardous environments.": "拥有 ISO 9001、ATEX 和 CE 认证生产线，具备极高耐用性，适用于恶劣及危险环境。",
  "Engineered for Safety & Performance": "精于安全 卓于性能",
  "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions.": "高性能防爆照明、建筑景观照明及定制 OEM/ODM 制造解决方案。",
  "Explore Catalogue": "浏览产品目录",
  "Become a Distributor": "成为经销商",
  "Join our global network of authorized regional distributors and partners.": "加入我们的全球授权区域经销商与合作伙伴网络。",
  "Apply Now": "立即申请",
  "All Categories": "所有类别",
  "Street Lamps": "路灯",
  "Landscape Lamps": "景观灯",
  "Ceiling Lights": "吸顶灯",
  "Wall Sconces": "壁灯",
  "Pendant Lamps": "吊灯",
  "Industrial Lighting": "工业照明",
  "Search products...": "搜索产品...",
  "Sort by": "排序方式",
  "Featured": "精选推荐",
  "Price: Low to High": "价格：从低到高",
  "Price: High to Low": "价格：从高到低",
  "View Details": "查看详情",
  "Add to Cart": "加入购物车",
  "In Stock": "有现货",
  "Out of Stock": "暂无现货",
  "Minimum Order:": "最小起订量：",
  "About Jinyu Capital": "关于 Jinyu Capital",
  "Leading Manufacturer of Industrial & Architectural Lighting": "领先的工业与建筑照明制造商",
  "Established in 2018 in Guangzhou, Jinyu Capital specialized in high-grade LED fixtures, explosion-proof luminaires, and specialized outdoor lighting systems.": "Jinyu Capital 于 2018 年成立于广州，专注于高等级 LED 灯具、防爆灯具及专业户外照明系统。",
  "Our Mission": "我们的使命",
  "Quality Assurance": "质量保证",
  "R&D Innovation": "研发创新",
  "Global Presence": "全球化布局",
  "Contact Us": "联系我们",
  "Get in Touch": "保持联系",
  "We're here to answer your questions, assist with custom OEM/ODM requests, and support your project requirements.": "我们随时解答您的疑问，协助处理 OEM/ODM 定制需求，并为您的项目提供支持。",
  "Full Name": "姓名",
  "Email Address": "电子邮箱",
  "Phone Number": "电话号码",
  "Company Name": "公司名称",
  "Project Type / Details": "项目类型 / 详细说明",
  "Send Message": "发送消息",
  "Submit Quote Request": "提交报价申请",
  "Thank you for reaching out! We will reply within 24 hours.": "感谢您的联系！我们将在 24 小时内回复。",
  "Subscribe to our Newsletter": "订阅我们的邮件更新",
  "Enter your email...": "输入您的电子邮箱...",
  "Subscribe": "订阅",
  "All rights reserved.": "保留所有权利。",
  "Chinese": "中文",
  "English": "English",
  "Russian": "Русский",
  "French": "Français",
  "Language": "语言",
};

// Russian Dictionary
const ru: Record<string, string> = {
  "Home": "Главная",
  "About": "О нас",
  "Products": "Продукция",
  "Blog": "Блог",
  "Distributor": "Дистрибьюторам",
  "Contact": "Контакты",
  "Request a quote": "Запросить КП",
  "Request a Quote": "Запросить КП",
  "Explore products": "Каталог продукции",
  "Contact sales": "Связаться с нами",
  "Quick links": "Быстрые ссылки",
  "Follow us": "Мы в соцсетях",
  "Your trusted manufacturer of premium lighting equipment and appliances, delivering engineering excellence and quality since 2018.": "Ваш надежный производитель осветительного оборудования премиум-класса с 2018 года.",
  "Manufacturing Excellence": "Производственное совершенство",
  "Featured Product Lines": "Популярные линейки",
  "Explosion-Proof Lighting": "Взрывозащищенное освещение",
  "Landscape & Urban Lamps": "Ландшафтное и уличное освещение",
  "OEM / ODM Custom Manufacturing": "Контрактное производство OEM / ODM",
  "Commercial & Industrial Lighting": "Коммерческое и промышленное освещение",
  "Global Standards & Certifications": "Стандарты и сертификация",
  "ISO 9001, ATEX, and CE certified production lines for extreme durability and hazardous environments.": "Сертифицированное производство ISO 9001, ATEX и CE для опасных зон и жестких условий.",
  "Engineered for Safety & Performance": "Надежность и производительность",
  "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions.": "Высокопроизводительное взрывозащищенное и ландшафтное освещение, решения OEM/ODM.",
  "Explore Catalogue": "Смотреть каталог",
  "Become a Distributor": "Стать дистрибьютором",
  "Join our global network of authorized regional distributors and partners.": "Присоединяйтесь к международной сети авторизованных дистрибьюторов.",
  "Apply Now": "Подать заявку",
  "All Categories": "Все категории",
  "Street Lamps": "Уличные светильники",
  "Landscape Lamps": "Ландшафтные светильники",
  "Ceiling Lights": "Потолочные светильники",
  "Wall Sconces": "Настенные бра",
  "Pendant Lamps": "Подвесные светильники",
  "Industrial Lighting": "Промышленное освещение",
  "Search products...": "Поиск товаров...",
  "Sort by": "Сортировка",
  "Featured": "Популярные",
  "Price: Low to High": "Цена: по возрастанию",
  "Price: High to Low": "Цена: по убыванию",
  "View Details": "Подробнее",
  "Add to Cart": "В корзину",
  "In Stock": "В наличии",
  "Out of Stock": "Нет в наличии",
  "Minimum Order:": "Мин. заказ:",
  "About Jinyu Capital": "О компании Jinyu Capital",
  "Leading Manufacturer of Industrial & Architectural Lighting": "Ведущий производитель промышленного и архитектурного освещения",
  "Established in 2018 in Guangzhou, Jinyu Capital specialized in high-grade LED fixtures, explosion-proof luminaires, and specialized outdoor lighting systems.": "Компания Jinyu Capital основана в 2018 году в Гуанчжоу и специализируется на высококлассных светодиодных и взрывозащищенных светильниках.",
  "Our Mission": "Наша миссия",
  "Quality Assurance": "Контроль качества",
  "R&D Innovation": "Исследования и разработки",
  "Global Presence": "Глобальное присутствие",
  "Contact Us": "Связаться с нами",
  "Get in Touch": "Оставайтесь на связи",
  "We're here to answer your questions, assist with custom OEM/ODM requests, and support your project requirements.": "Мы готовы ответить на ваши вопросы, помочь с заказами OEM/ODM и поддержать ваш проект.",
  "Full Name": "Полное имя",
  "Email Address": "Адрес эл. почты",
  "Phone Number": "Номер телефона",
  "Company Name": "Название компании",
  "Project Type / Details": "Тип проекта / Детали",
  "Send Message": "Отправить сообщение",
  "Submit Quote Request": "Отправить запрос",
  "Thank you for reaching out! We will reply within 24 hours.": "Спасибо за обращение! Мы ответим в течение 24 часов.",
  "Subscribe to our Newsletter": "Подписка на рассылку",
  "Enter your email...": "Введите ваш email...",
  "Subscribe": "Подписаться",
  "All rights reserved.": "Все права защищены.",
  "Chinese": "中文",
  "English": "English",
  "Russian": "Русский",
  "French": "Français",
  "Language": "Язык",
};

// French Dictionary
const fr: Record<string, string> = {
  "Home": "Accueil",
  "About": "À propos",
  "Products": "Produits",
  "Blog": "Blog",
  "Distributor": "Distributeurs",
  "Contact": "Contact",
  "Request a quote": "Demander un devis",
  "Request a Quote": "Demander un devis",
  "Explore products": "Explorer les produits",
  "Contact sales": "Contacter les ventes",
  "Quick links": "Liens rapides",
  "Follow us": "Suivez-nous",
  "Your trusted manufacturer of premium lighting equipment and appliances, delivering engineering excellence and quality since 2018.": "Votre fabricant de confiance d'équipements d'éclairage haut de gamme depuis 2018.",
  "Manufacturing Excellence": "Excellence de fabrication",
  "Featured Product Lines": "Gammes vedettes",
  "Explosion-Proof Lighting": "Éclairage antidéflagrant",
  "Landscape & Urban Lamps": "Éclairage paysager et urbain",
  "OEM / ODM Custom Manufacturing": "Fabrication sur mesure OEM / ODM",
  "Commercial & Industrial Lighting": "Éclairage commercial et industriel",
  "Global Standards & Certifications": "Normes et certifications mondiales",
  "ISO 9001, ATEX, and CE certified production lines for extreme durability and hazardous environments.": "Lignes de production certifiées ISO 9001, ATEX et CE.",
  "Engineered for Safety & Performance": "Conçu pour la sécurité et la performance",
  "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions.": "Éclairage antidéflagrant et paysager haute performance, solutions sur mesure OEM/ODM.",
  "Explore Catalogue": "Explorer le catalogue",
  "Become a Distributor": "Devenir distributeur",
  "Join our global network of authorized regional distributors and partners.": "Rejoignez notre réseau mondial de distributeurs agréés.",
  "Apply Now": "Postuler maintenant",
  "All Categories": "Toutes les catégories",
  "Street Lamps": "Lampadaires urbains",
  "Landscape Lamps": "Éclairage paysager",
  "Ceiling Lights": "Plafonniers",
  "Wall Sconces": "Appliques murales",
  "Pendant Lamps": "Suspensions",
  "Industrial Lighting": "Éclairage industriel",
  "Search products...": "Rechercher des produits...",
  "Sort by": "Trier par",
  "Featured": "En vedette",
  "Price: Low to High": "Prix : du + bas au + haut",
  "Price: High to Low": "Prix : du + haut au + bas",
  "View Details": "Voir les détails",
  "Add to Cart": "Ajouter au panier",
  "In Stock": "En stock",
  "Out of Stock": "Rupture de stock",
  "Minimum Order:": "Commande min :",
  "About Jinyu Capital": "À propos de Jinyu Capital",
  "Leading Manufacturer of Industrial & Architectural Lighting": "Fabricant leader d'éclairage industriel et architectural",
  "Established in 2018 in Guangzhou, Jinyu Capital specialized in high-grade LED fixtures, explosion-proof luminaires, and specialized outdoor lighting systems.": "Fondée en 2018 à Guangzhou, Jinyu Capital est spécialisée dans les luminaires LED haute qualité et antidéflagrants.",
  "Our Mission": "Notre mission",
  "Quality Assurance": "Assurance qualité",
  "R&D Innovation": "Recherche et Innovation",
  "Global Presence": "Présence mondiale",
  "Contact Us": "Contactez-nous",
  "Get in Touch": "Prendre contact",
  "We're here to answer your questions, assist with custom OEM/ODM requests, and support your project requirements.": "Nous sommes à votre disposition pour répondre à vos questions et traiter vos demandes OEM/ODM.",
  "Full Name": "Nom complet",
  "Email Address": "Adresse e-mail",
  "Phone Number": "Numéro de téléphone",
  "Company Name": "Nom de l'entreprise",
  "Project Type / Details": "Type de projet / Détails",
  "Send Message": "Envoyer le message",
  "Submit Quote Request": "Soumettre la demande",
  "Thank you for reaching out! We will reply within 24 hours.": "Merci de nous avoir contactés ! Nous vous répondrons sous 24h.",
  "Subscribe to our Newsletter": "S'abonner à la newsletter",
  "Enter your email...": "Entrez votre e-mail...",
  "Subscribe": "S'abonner",
  "All rights reserved.": "Tous droits réservés.",
  "Chinese": "中文",
  "English": "English",
  "Russian": "Русский",
  "French": "Français",
  "Language": "Langue",
};

const WebsiteLanguageContext = createContext<WebsiteLanguageContextValue | null>(null);

function subscribeToLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

function getLanguageSnapshot(): WebsiteLanguage {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "zh" || saved === "ru" || saved === "fr" || saved === "en" ? saved : "en";
}

function getServerLanguageSnapshot(): WebsiteLanguage {
  return "en";
}

function interpolate(message: string, values?: TranslationValues) {
  if (!values) return message;
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    message,
  );
}

export function WebsiteLanguageProvider({ children }: { children: React.ReactNode }) {
  // Default for the public website is English ("en")
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language === "zh" ? "zh-CN" : language === "ru" ? "ru" : language === "fr" ? "fr" : "en";
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [language]);

  const setLanguage = useCallback((nextLanguage: WebsiteLanguage) => {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  const t = useCallback(
    (message: string, values?: TranslationValues) => {
      if (language === "en") return interpolate(message, values);
      const dict = language === "zh" ? zh : language === "ru" ? ru : language === "fr" ? fr : zh;
      const translated = dict[message] ?? message;
      return interpolate(translated, values);
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <WebsiteLanguageContext.Provider value={value}>
      {children}
    </WebsiteLanguageContext.Provider>
  );
}

export function useWebsiteLanguage() {
  const context = useContext(WebsiteLanguageContext);
  if (!context) throw new Error("useWebsiteLanguage must be used inside WebsiteLanguageProvider");
  return context;
}
