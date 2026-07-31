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
  "Manufacturing Excellence From China To The World": "精益制造 始于中国 服务全球",
  "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.": "Jinyu 融合了制造、OEM 生产、产品研发及全球供应链解决方案，服务于全球经销商、批发商、工程商和品牌商。",
  "Looking to expand your business?": "想要拓展您的业务？",
  "Become a Global Distributor": "成为全球经销商",
  "Product lines": "产品线系列",
  "Sq.m facility": "平方米工厂",
  "Countries exported": "出口国家与地区",
  "9001 Certified": "9001 认证体系",
  "Manufacturing excellence": "制造实力",
  "Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.": "依托深厚的工程技术积累，我们制造符合全球市场需求的高品质产品。广州生产基地代表了现代制造业的顶尖能力。",
  "Advanced manufacturing": "先进制造",
  "State-of-the-art production facilities equipped with automated assembly lines for precision and scale.": "拥有先进的自动化生产线和精密的装配流水线。",
  "Rigorous quality control": "严格质量控制",
  "Comprehensive testing protocols ensuring every appliance and lighting fixture meets international safety standards.": "完善的全流程检测机制，确保每一盏灯具均符合国际安全标准。",
  "Innovative engineering": "创新工程设计",
  "Dedicated R&D team continuously developing energy-efficient and smart technology solutions.": "专业的研发团队持续开发高效节能与智能化技术解决方案。",
  "Featured product lines": "精选产品系列",
  "Explore our signature street lighting collections, engineered for superior outdoor performance, longevity, and aesthetic appeal.": "探索我们的标志性路灯与照明系列，兼具卓越户外性能、长寿命与美学设计。",
  "View all products": "查看所有产品",
  "Latest news & insights": "最新动态与观点",
  "Stay updated with our latest technology breakthroughs, lighting guides, and company announcements.": "了解我们在照明技术突破、行业指南及公司动态方面的最新资讯。",
  "Read all insights": "阅读所有资讯",
  "Read More →": "阅读全文 →",
  "Partner with a reliable manufacturer": "与值得信赖的制造厂商合作",
  "Whether you need OEM services or bulk orders of our standard product lines, our team is ready to support your business.": "无论您需要 OEM 定制服务还是标准产品的大批量采购，我们的团队都随时为您服务。",
  "Contact our sales team": "联系我们销售团队",
  "Engineering Innovation Industrial Reliability": "工程创新 工业品质 值得信赖",
  "Jinyu specializes in the design, manufacturing, and supply of explosion-proof lighting and industrial electrical solutions for global markets": "Jinyu 专注于面向全球市场设计、制造及供应防爆灯具与工业电气解决方案。",
  "Our story": "发展历程",
  "Driven by innovation and quality, Jinyu has developed a complete manufacturing ecosystem covering mold development, die-casting, production, assembly, and OEM/ODM customization.": "在创新与品质驱动下，Jinyu 已建立涵盖模具开发、压铸、生产、组装及 OEM/ODM 定制的完整制造生态系统。",
  "Annual production exceeds 2.4 million units, supported by advanced facilities, experienced engineering teams, and strict quality control systems.": "年产量超过 240 万套，依托先进设施、经验丰富的工程团队与严苛的质量管控体系。",
  "Backed by 80+ patents and international certifications including ISO, CCC, EX, and ATEX, we deliver reliable solutions for industrial and hazardous environments worldwide.": "拥有 80 多项专利及 ISO、CCC、EX、ATEX 等国际认证，为全球工业及危险环境提供可靠解决方案。",
  "Our Core Values": "核心价值观",
  "The principles that guide our manufacturing processes and client relationships.": "指导我们制造流程与客户关系的核心准则。",
  "Precision": "精益求精",
  "We maintain strict tolerances and rigorous quality control in every stage of our manufacturing process.": "我们在生产制造的每个阶段都保持严格的公差与严苛的质量把控。",
  "Innovation": "持续创新",
  "We continuously invest in R&D to develop energy-efficient lighting and smarter, more durable appliances.": "我们持续加大研发投入，开发高效节能的照明产品和更智能耐用的电器设备。",
  "Partnership": "合作共赢",
  "We build lasting relationships with our global distributors through transparency and consistent delivery.": "我们通过透明沟通和稳定交付，与全球经销商建立长久稳固的合作关系。",
  "Product Portfolio": "产品系列全览",
  "Browse our focused range of high-performance municipal and commercial lighting solutions, engineered for precision, durability, and contemporary aesthetics.": "浏览我们专为市政和商业照明打造的高性能解决方案，兼具精密工程、耐用性与现代美感。",
  "Street Lighting": "路灯照明",
  "Landscape Lighting": "景观照明",
  "All Products": "所有产品",
  "Back to Products": "返回产品列表",
  "Go back": "返回上一页",
  "Product not found": "未找到该产品",
  "Specifications": "规格参数",
  "Quantity": "数量",
  "In stock and ready to ship worldwide": "有现货，支持全球快速发货",
  "Get in touch": "与我们联系",
  "Have questions about our platform or services? Our team is here to help you get started with professional trading.": "对我们的产品与服务有任何疑问？我们的团队随时为您解答并提供专业支持。",
  "Send us a message": "给发我们留言",
  "Contact information": "联系方式",
  "Office": "公司地址",
  "Support hours": "工作时间",
  "Need immediate assistance?": "需要紧急协助？",
  "Our support team is available during business hours to help with account setup, platform questions, and technical issues.": "我们的客服与工程团队在工作时间内随时为您解答产品与技术疑问。",
  "Partner with Jinyu Capital to bring high-quality, innovative lighting and appliance solutions to your local market. Fill out the application below to start the conversation.": "与 Jinyu Capital 合作，将优质创新的照明与电器解决方案引入您的本地市场。填写下方申请表即可开始对话。",
  "B2B & Commercial Inquiry": "B2B 与商业项目咨询",
  "Request a Project Quote": "索取项目报价方案",
  "Submit your architectural, street, or landscape lighting requirements below. Our engineering and sales team will review your specifications and provide a competitive wholesale quote.": "请在下方提交您的建筑、路灯或景观照明需求。我们的工程与销售团队将审核您的规格并提供具有竞争力的批发报价。",
  "Quote Request Received": "已收到您的报价申请",
  "Thank you for submitting your project specifications. Our sales engineers are reviewing your request and will contact you within 24 business hours.": "感谢您提交项目规格！我们的销售工程师正在审核您的申请，并将于 24 小时内联系您。",
  "Industry Insights & News": "行业洞察与新闻动态",
  "Stay informed with the latest trends in industrial manufacturing, explosion-proof technology, and robust engineering solutions.": "掌握工业制造、防爆技术和高耐久工程解决方案的最新趋势。",
  "No products found": "未找到相关产品",
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
  "Manufacturing Excellence From China To The World": "Производственное совершенство из Китая по всему миру",
  "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.": "Jinyu объединяет производство, OEM-выпуск, разработку и глобальные цепочки поставок.",
  "Looking to expand your business?": "Хотите расширить свой бизнес?",
  "Become a Global Distributor": "Стать мировым дистрибьютором",
  "Product lines": "Линейки продукции",
  "Sq.m facility": "кв.м производственных площадей",
  "Countries exported": "Стран экспорта",
  "9001 Certified": "Сертификат 9001",
  "Manufacturing excellence": "Производственное совершенство",
  "Advanced manufacturing": "Передовое производство",
  "Rigorous quality control": "Строгий контроль качества",
  "Innovative engineering": "Инновационные разработки",
  "Featured product lines": "Популярные линейки",
  "View all products": "Все товары",
  "Latest news & insights": "Новости и статьи",
  "Read all insights": "Все статьи",
  "Read More →": "Читать далее →",
  "Partner with a reliable manufacturer": "Надежное партнерство с производителем",
  "Engineering Innovation Industrial Reliability": "Инженерные инновации и надежность",
  "Our story": "Наша история",
  "Our Core Values": "Наши ценности",
  "Precision": "Точность",
  "Innovation": "Инновации",
  "Partnership": "Партнерство",
  "Product Portfolio": "Каталог продукции",
  "Street Lighting": "Уличное освещение",
  "Landscape Lighting": "Ландшафтное освещение",
  "All Products": "Все товары",
  "Back to Products": "Назад к каталогу",
  "Go back": "Назад",
  "Product not found": "Товар не найден",
  "Specifications": "Технические характеристики",
  "Quantity": "Количество",
  "In stock and ready to ship worldwide": "В наличии, готовы к отправке по всему миру",
  "Get in touch": "Связаться с нами",
  "Send us a message": "Напишите нам",
  "Contact information": "Контактная информация",
  "Office": "Офис",
  "Support hours": "Часы работы",
  "B2B & Commercial Inquiry": "B2B и коммерческие запросы",
  "Request a Project Quote": "Запросить КП по проекту",
  "Quote Request Received": "Запрос получен",
  "Industry Insights & News": "Новости и статьи отрасли",
  "No products found": "Товары не найдены",
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
  "Manufacturing Excellence From China To The World": "Excellence de fabrication de la Chine au monde entier",
  "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.": "Jinyu combine fabrication, production OEM, développement de produits et solutions de chaîne d'approvisionnement mondiale.",
  "Looking to expand your business?": "Vous souhaitez développer votre entreprise ?",
  "Become a Global Distributor": "Devenir un distributeur mondial",
  "Product lines": "Gammes de produits",
  "Sq.m facility": "m² d'installations",
  "Countries exported": "Pays d'exportation",
  "9001 Certified": "Certifié 9001",
  "Manufacturing excellence": "Excellence de fabrication",
  "Advanced manufacturing": "Fabrication avancée",
  "Rigorous quality control": "Contrôle qualité rigoureux",
  "Innovative engineering": "Ingénierie innovante",
  "Featured product lines": "Gammes vedettes",
  "View all products": "Voir tous les produits",
  "Latest news & insights": "Dernières actualités",
  "Read all insights": "Toutes les actualités",
  "Read More →": "En savoir plus →",
  "Partner with a reliable manufacturer": "Devenez partenaire d'un fabricant fiable",
  "Engineering Innovation Industrial Reliability": "Innovation d'ingénierie et fiabilité industrielle",
  "Our story": "Notre histoire",
  "Our Core Values": "Nos valeurs fondamentales",
  "Precision": "Précision",
  "Innovation": "Innovation",
  "Partnership": "Partenariat",
  "Product Portfolio": "Gamme de produits",
  "Street Lighting": "Éclairage public",
  "Landscape Lighting": "Éclairage paysager",
  "All Products": "Tous les produits",
  "Back to Products": "Retour aux produits",
  "Go back": "Retour",
  "Product not found": "Produit non trouvé",
  "Specifications": "Spécifications",
  "Quantity": "Quantité",
  "In stock and ready to ship worldwide": "En stock et prêt à être expédié dans le monde entier",
  "Get in touch": "Prendre contact",
  "Send us a message": "Envoyez-nous un message",
  "Contact information": "Informations de contact",
  "Office": "Bureau",
  "Support hours": "Heures d'ouverture",
  "B2B & Commercial Inquiry": "Demande B2B et commerciale",
  "Request a Project Quote": "Demander un devis de projet",
  "Quote Request Received": "Demande de devis reçue",
  "Industry Insights & News": "Actualités et perspectives",
  "No products found": "Aucun produit trouvé",
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
