// Тексты страницы /fintech-map/ вне интерактивной карты: календарь регуляторики, FAQ, источники.
// FAQ и источники попадают и в разметку schema.org (src/app/seo.ts).

export interface TimelineItem {
  /** ISO-дата для сортировки и сравнения со срезом; для плана без точной даты — первый день периода. */
  date: string;
  label: string;
  text: string;
  segment: string;
  planned?: boolean;
}

export const timeline: TimelineItem[] = [
  {
    date: "2026-01-01",
    label: "01.01.2026",
    text: "НДС 22%, льгота по НДС для эквайринга отменена (425-ФЗ)",
    segment: "pay.pos",
  },
  {
    date: "2026-01-01",
    label: "01.01.2026",
    text: "НДС на УСН при доходе больше 20 млн ₽; порог сохранён до 2028 года (228-ФЗ)",
    segment: "bank.sme",
  },
  {
    date: "2026-03-01",
    label: "01.03.2026",
    text: "ГИС «Антифрод»: обмен данными о мошенничестве между госорганами, банками, операторами связи и площадками",
    segment: "kyc.fraud",
  },
  {
    date: "2026-03-01",
    label: "01.03.2026",
    text: "ЕБС обязательна для онлайн-займов МФК; надзорные меры ЦБ отложил до 01.01.2027",
    segment: "kyc.bio",
  },
  {
    date: "2026-03-01",
    label: "01.03.2026",
    text: "376-ФЗ: отказаться от автосписаний по подписке должно быть так же просто, как подключиться",
    segment: "pay.ecom.subs",
  },
  {
    date: "2026-04-01",
    label: "01.04.2026",
    text: "283-ФЗ о сервисах рассрочки: операторы только из реестра ЦБ, срок рассрочки до 6 месяцев",
    segment: "pay.bnpl",
  },
  {
    date: "2026-09-01",
    label: "01.09.2026",
    text: "Закон о цифровых валютах: основная часть норм, запрет расчётов криптовалютой внутри РФ",
    segment: "kyc.crypto",
  },
  {
    date: "2026-09-01",
    label: "01.09.2026",
    text: "Цифровой рубль и единый QR: значимые банки и продавцы с выручкой больше 120 млн ₽ (248-ФЗ)",
    segment: "bank.cbdc",
  },
  {
    date: "2026-10-01",
    label: "01.10.2026",
    text: "289-ФЗ о платформенной экономике: реестр посреднических платформ, правила работы с партнёрами",
    segment: "self.platform",
  },
  {
    date: "2027-01-01",
    label: "01.01.2027",
    text: "Отчётность операторов рассрочки в ЦБ; заканчивается отсрочка надзора за ЕБС для МФК",
    segment: "pay.bnpl",
  },
  {
    date: "2027-03-01",
    label: "01.03.2027",
    text: "ЕБС обязательна для онлайн-займов МКК; заканчивается переходный период ЦБ по единому QR",
    segment: "kyc.nfo.mkk",
  },
  {
    date: "2027-04-01",
    label: "Середина 2027",
    text: "Платформа ЦБ «Антидроп» для физлиц (план регулятора)",
    segment: "kyc.tm.drop",
    planned: true,
  },
  {
    date: "2027-07-01",
    label: "01.07.2027",
    text: "Заканчивается переходный период: криптообменнику нужна запись в реестре ЦБ",
    segment: "kyc.crypto",
  },
  {
    date: "2027-09-01",
    label: "01.09.2027",
    text: "Цифровой рубль и единый QR: банки с универсальной лицензией, продавцы с выручкой больше 30 млн ₽",
    segment: "bank.cbdc",
  },
  {
    date: "2028-04-01",
    label: "01.04.2028",
    text: "Максимальный срок рассрочки сокращается до 4 месяцев",
    segment: "pay.bnpl",
  },
  {
    date: "2028-09-01",
    label: "01.09.2028",
    text: "Цифровой рубль: остальные банки и продавцы, кроме точек с выручкой меньше 5 млн ₽",
    segment: "bank.cbdc",
  },
];

export const faq: { q: string; a: string }[] = [
  {
    q: "Какие ниши в финтехе открыты для нового игрока в 2026 году?",
    a: "По карте на 29.10.2026 открыто пять окон из 57 сегментов: крипто-AML и KYT для обменников и брокеров (3,1 из 5), мониторинг риска переквалификации самозанятых (2,7), комплаенс платформ по 289-ФЗ (2,7), выявление дропов для небанков (2,7) и облегчённый AML-мониторинг для некредитных финансовых организаций (2,4). Почти все эти окна открыла новая регуляторика 2026–2027 годов.",
  },
  {
    q: "Можно ли зайти в финтех без банковской лицензии?",
    a: "Да, но не в роли банка. Новый игрок заходит как B2B-вендор: продаёт банкам и небанковским организациям модули под конкретное требование регулятора, строит сервисы поверх API банка-партнёра или работает платёжным агентом через банк. На карте барьер 1–2 означает, что начать можно без лицензии и капитала, а 4–5 — что нужны лицензия ЦБ, капитал или аккредитация.",
  },
  {
    q: "Что закон о цифровых валютах меняет для бизнеса?",
    a: "Закон подписан 4 августа 2026 года, основная часть действует с 1 сентября 2026-го. Криптообменник должен попасть в реестр Банка России, иметь капитал от 15 млн ₽ и вступить в СРО; без реестра работать можно до 1 июля 2027 года. Платить криптовалютой внутри России запрещено. Для вендоров это спрос на KYC, KYT и правила внутреннего контроля.",
  },
  {
    q: "Как считается оценка окна для входа?",
    a: "Окно = Деньги × (12 − Перегрев − Барьер) / 10 + 0,3 × Ветер. Перегрев, барьер и деньги оцениваются от 1 до 5, регуляторный ветер — от −1 до +1. От 2,4 сегмент открыт, от 1,6 до 2,4 нужен клин, то есть узкое преимущество, ниже 1,6 сегмент закрыт. Деньги стоят множителем: пустой рынок без денег окна не даёт.",
  },
  {
    q: "Насколько можно доверять оценкам на карте?",
    a: "Оценки 1–5 экспертные, это не статистика: у каждого сегмента указана достоверность — высокая, средняя или низкая. Факты о законах и цифрах сверены с источниками на 29.10.2026, ссылки собраны внизу страницы. Всё, что помечено «оценка», первоисточником не подтверждено. Карта — материал для обсуждения стратегии, а не инвестиционная рекомендация.",
  },
];

export interface Source {
  title: string;
  publisher: string;
  date?: string;
  url: string;
}

export const sources: Source[] = [
  {
    title: "Платформа «Знай своего клиента»",
    publisher: "Банк России",
    url: "https://cbr.ru/counteraction_m_ter/platform_zsk",
  },
  {
    title: "Приём цифровых рублей: этапы для бизнеса",
    publisher: "Банк России",
    url: "https://www.cbr.ru/PSystem/dr/dr_for_business/accepting_payments_dr/",
  },
  {
    title: "Обзор СБП за II квартал 2025 года",
    publisher: "Банк России",
    url: "https://cbr.ru/analytics/nps/sbp/2_2025/",
  },
  {
    title: "Президент подписал закон о цифровой валюте и цифровых правах",
    publisher: "ppt.ru",
    url: "https://ppt.ru/news/kriptovalyuta/prezident-podpisal-zakon-o-tsifrovoy-valyute-i-tsifrovykh-pravakh",
  },
  {
    title: "С 1 сентября 2026 года вступит в силу закон о цифровых валютах",
    publisher: "buh.ru",
    url: "https://buh.ru/news/s-1-sentyabrya-2026-goda-vstupit-v-silu-zakon-o-tsifrovykh-valyutakh-.html",
  },
  {
    title: "Банк России ввёл переходный период по единому QR-коду до 1 марта 2027 года",
    publisher: "ppt.ru",
    url: "https://ppt.ru/news/plateji/bank-rossii-vvel-perekhodnyy-period-po-edinomu-qr-kodu-do-1-marta-2027-goda",
  },
  { title: "Рассрочка по новым правилам: 283-ФЗ", publisher: "Контур", url: "https://kontur.ru/articles/513" },
  {
    title: "В ЦБ заявили, что ставки при покупке товаров в рассрочку могут достигать 60% годовых",
    publisher: "Интерфакс",
    url: "https://www.interfax.ru/russia/987090",
  },
  {
    title: "Федеральный закон от 04.07.2026 № 228-ФЗ: порог НДС на УСН",
    publisher: "ppt.ru",
    url: "https://ppt.ru/obzory/vstupaet-v-silu/federalnyy-zakon-04-07-2026-228-fz",
  },
  {
    title: "Отменены льготы по НДС на операции с банковскими картами",
    publisher: "ppt.ru",
    url: "https://ppt.ru/art/lgoty/otmeneny-lgoty-po-nds-na-operatsii-s-bankovskimi-kartami",
  },
  {
    title: "Запрет автосписаний за подписки без согласия с 1 марта 2026 года",
    publisher: "Главная книга",
    date: "2026-02-28",
    url: "https://glavkniga.ru/news/20552",
  },
  {
    title: "Онлайн-сервисы могут потерять около 20% выручки подписок",
    publisher: "ComNews",
    date: "2026-03-03",
    url: "https://www.comnews.ru/content/244042/2026-03-03/2026-w10/1008/onlayn-servisy-mogut-poteryat-okolo-20-vyruchki-podpisok",
  },
  {
    title: "Прогноз числа МФО на 2026–2028 годы",
    publisher: "Эксперт РА",
    date: "2026-07-16",
    url: "https://raexpert.ru/researches/publications/rg_jul16_2026",
  },
  {
    title: "Банк России не будет применять надзорные меры за выдачу займов без биометрии",
    publisher: "«Российская газета» / Рамблер",
    url: "https://finance.rambler.ru/business/56447118-bank-rossii-ne-budet-primenyat-nadzornye-mery-za-vydachu-zaymov-bez-biometrii/",
  },
  {
    title: "В России запускают систему «Антифрод» для борьбы с кибермошенничеством",
    publisher: "Sostav",
    url: "https://www.sostav.ru/publication/v-rossii-zapuskayut-sistemu-antifrod-dlya-borby-s-kibermoshennichestvom-82037.html",
  },
  {
    title: "Аналог платформы «Знай своего клиента» для физлиц могут запустить в 2027 году",
    publisher: "Интерфакс",
    url: "https://www.interfax.ru/russia/1049499",
  },
  {
    title: "Федеральный закон от 24.06.2025 № 176-ФЗ: уголовная ответственность дропперов",
    publisher: "ppt.ru",
    url: "https://ppt.ru/obzory/vstupaet-v-silu/federalnyy-zakon-24-06-2025-176-fz",
  },
  {
    title: "289-ФЗ: новые правила для маркетплейсов",
    publisher: "Точка",
    url: "https://tochka.com/knowledge/marketpleisy/289-fz-novye-pravila-marketplejsov/",
  },
  {
    title: "Число самозанятых в России превысило 17,2 млн",
    publisher: "Sostav, данные ФНС",
    date: "2026-08-21",
    url: "https://www.sostav.ru/publication/chislo-samozanyatykh-v-rossii-prevysilo-17-2-mln-86292.html",
  },
  {
    title: "MWS Cloud: рынок платёжных систем России может превысить 84 млрд рублей",
    publisher: "ComNews",
    date: "2026-04-20",
    url: "https://www.comnews.ru/content/244872/2026-04-20/2026-w17/1009/mws-cloud-rynok-platezhnykh-sistem-rossii-mozhet-prevysit-84-mlrd-rubley",
  },
  {
    title: "Доля безналичных расчётов снизилась до 88,4%",
    publisher: "Myfin",
    url: "https://ru.myfin.by/article/rossiane-stali-case-platit-nalicnymi-dola-beznalicnyh-rascetov-snizilas-do-884",
  },
  {
    title: "Прогноз числа банков на конец 2026 года",
    publisher: "Эксперт РА",
    date: "2026-06-02",
    url: "https://raexpert.ru/researches/publications/rg_jun02_2026",
  },
  {
    title: "Свести счета: ЦБ призвали ускорить принятие закона о мультибанкинге",
    publisher: "Известия / Mail.ru",
    url: "https://finance.mail.ru/article/svesti-scheta-tsb-prizvali-uskorit-prinyatie-zakona-o-multibankinge-69218284/",
  },
  {
    title: "ЦБ начинает процедуру запрета маркетплейсам скидок, связанных со способом оплаты",
    publisher: "Oborot.ru",
    url: "https://oborot.ru/news/cb-rf-nachinaet-proceduru-zapreta-marketplejsam-skidok-svyazannyh-so-sposobom-oplaty-i258970.html",
  },
  {
    title: "Central Bank of Uzbekistan approves the National Fintech Strategy for 2026–2030",
    publisher: "ЦБ Узбекистана",
    date: "2026-09-24",
    url: "https://cbu.uz/en/press_center/releases/4590809/",
  },
  {
    title: "Halyk Bank не купил Click: почему сорвалась сделка в Узбекистане",
    publisher: "FinRatings",
    url: "https://finratings.kz/news/12822-halyk-bank-ne-kupil-click-pochemu-sorvalas-sdelka-v-uzbekistane/",
  },
];
