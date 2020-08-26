--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true

INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('03', '03000000-1',
        'Сельскохозяйственные, рыбные продукты, продукция ферм, лесного хозяйства и сопутствующая продукция',
        'Agricultural, farming, fishing, forestry and related products',
        'Айыл чарба, балык продуктылары, фермалардын продукциялары, токой чарбасы жана коштоп жүрүүчү продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('09', '09000000-3', 'Нефтепродукты, топливо, электричество и другие источники энергии',
        'Petroleum products, fuel, electricity and other sources of energy',
        'Нефтепродуктылар, отун, электричество жана энергиянын жана башка булактары')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('14', '14000000-1', 'Продукты горной добычи, основные металлы и сопутствующие продукты',
        'Mining, basic metals and related products',
        'Тоо кен продуктылары, негизги металлдар жана коштоп жүрүүчү продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('15', '15000000-8', 'Продовольственные продукты, напитки, табак и сопутствующие продукты',
        'Food, beverages, tobacco and related products',
        'Тамак-аш продуктылары, суусундуктар, тамеки жана коштоп жүрүүчү продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('16', '16000000-5', 'Оборудование для сельского хозяйства',
        'Agricultural machinery',
        'Айыл чарбасы үчүн жабдуу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('18', '18000000-9', 'Одежда, обувь, товары для путешествий и аксессуары ',
        'Clothing, footwear, luggage articles and accessories',
        'Кийим-кече, бут кийим, саякаттоо үчүн товарлар жана аксессуарлар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('19', '19000000-6', 'Изделия из кожи, ткани, пластмассы и резины ',
        'Leather and textile fabrics, plastic and rubber materials',
        'Териден жасалган буюмдар, кездемелер, пластмассалар жана резиналар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('22', '22000000-0', 'Печатная и сопутствующая продукция ',
        'Printed matter and related products',
        'Басма жана коштоп жүрүүчү продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('24', '24000000-4', 'Химические продукты ',
        'Chemical products',
        'Химиялык продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('30', '30000000-9',
        'Компьютерное оборудование и канцелярские принадлежности, за исключением мебели и пакетов программного обеспечения',
        'Office and computing machinery, equipment and supplies except furniture and software packages',
        'Компьютердик жана кеңсе жабдуулары, эмеректерден жана программалык камсыздоо пакеттеринен сырткары')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('31', '31000000-6', 'Машины, аппараты, электрическое оборудование и расходные материалы, освещение',
        'Electrical machinery, apparatus, equipment and consumables; Lighting',
        'Машиналар, аппараттар, электр жабдуулары жана чыгым материалдары, жарыктандыруу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('32', '32000000-3',
        'Радиооборудование, телевизионное, коммуникационное, телекоммуникационное  и сопутствующее оборудование',
        'Radio, television, communication, telecommunication and related equipment',
        'Радио жабдуусу, телевизиондук, коммуникациялык, теле коммуникациялык жана коштоп жүрүүчү жабдуу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('33', '33000000-0', 'Медицинское оборудование, фармацевтическая продукция и предметы личной гигиены ',
        'Medical equipments, pharmaceuticals and personal care products',
        'Медициналык жабдуу, фармацевтик продукция жана жеке гигиена буюмдары')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('34', '34000000-7', 'Транспортное оборудование и сопутствующие продукты для транспорта',
        'Transport equipment and auxiliary products to transportation',
        'Транспорттук жабдуу жана транспорт үчүн коштоп жүрүүчү продукциялар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('35', '35000000-4', 'Оборудование безопасности, пожаротушения, полицейское и защитное оборудование',
        'Security, fire-fighting, police and defence equipment',
        'Коопсуздук жабдуусу, өрт өчүрүүчү, полициялык жана коргонуу жабдуусу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('37', '37000000-8',
        'Музыкальные инструменты, спортивные товары, игры, игрушки, предметы ремесленного творчества, предметы искусства и аксессуары',
        'Musical instruments, sport goods, games, toys, handicraft, art materials and accessories',
        'Музыкалык аспаптар, спорттук товарлар, оюнчуктар, кол өнөрчүлүк буюмдары, искусство буюмдары жана аксессуарлар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('38', '38000000-5', 'Лабораторное, оптическое и точное оборудование (за исключением очков)',
        'Laboratory, optical and precision equipments (excl. glasses)',
        'Лабораториялык, оптикалык жана так жабдуу (көз айнектерден сырткары)')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('39', '39000000-2',
        'Мебель (включая офисную мебель), мебельные аксессуары, бытовая техника (за исключением  приборов освещения) и средства для очистки',
        'Furniture (incl. office furniture), furnishings, domestic appliances (excl. lighting) and cleaning products',
        'Эмерек (кеңсе эмерегин камтуу менен), эмерек аксессуралары, тиричилик техникасы (жарыктандыруу приболорунан сырткары) жана тазалоочу каражаттар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('41', '41000000-9', 'Очищенная и собранная вода',
        'Collected and purified water',
        'Чогултулган жана тазаланган суу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('42', '42000000-6', 'Промышленное оборудование',
        'Industrial machinery',
        'Өнөр жай жабдуусу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('43', '43000000-3', 'Оборудование для горнодобывающей промышленности и строительства',
        'Machinery for mining, quarrying, construction equipment',
        'Тоо кен өндүрүшү жана курулушу үчүн жабдуу')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('45', '45000000-7', 'Строительные работы',
        'Construction work',
        'Курулуш иштери')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('48', '48000000-8', 'Программное обеспечение и информационные системы',
        'Software package and information systems',
        'Программалык камсыздоо жана маалымат тутуму')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('50', '50000000-5', 'Ремонт и техническое обслуживание',
        'Repair and maintenance services',
        'Оңдоо жана техникалык тейлөө')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('51', '51000000-9', 'Установка (за исключением программного обеспечения)',
        'Installation services (except software)',
        'Орнотуу (программалык камсыздоодон сырткары)')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('55', '55000000-0', 'Гостиничные услуги, ресторанные услуги и услуги розничной торговли',
        'Hotel, restaurant and retail trade services',
        'Мейманкана, ресторан жана чекене соода кызмат көрсөтүүлөрү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('60', '60000000-8', 'Транспортные услуги (за исключением транспортировки отходов)',
        'Transport services (excl. Waste transport)',
        'Транспорттук кызмат көрсөтүү (таштандыларды транспортировкалоодон сырткары)')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('63', '63000000-9', 'Дополнительные транспортные услуги, услуги туристических агентств',
        'Supporting and auxiliary transport services; travel agencies services',
        'Транспорттук кошумча кызмат көрсөтүү, туристтик агенттиктердин кызмат көрсөтүүлөрү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('64', '64000000-6', 'Услуги почты и телекоммуникаций',
        'Postal and telecommunications services',
        'Почта жана телекоммуникациялар кызмат көрсөтүүлөрү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('65', '65000000-3', 'Коммунальные услуги',
        'Public utilities',
        'Коммуналдык кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('66', '66000000-0', 'Финансовые и страховые услуги',
        'Financial and insurance services',
        'Финансы жана камсыздандыруу кызмат көрсөтүүлөрү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('70', '70000000-1', 'Услуги по недвижимости',
        'Real estate services',
        'Кыймылсыз мүлк боюнча кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('71', '71000000-8', 'Архитектурные, строительные, инженерные и инспекционные услуги',
        'Architectural, construction, engineering and inspection services',
        'Архитектуралык, курулуш, инженердик жана инспекциялык кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('72', '72000000-5',
        'Информационные услуги: консалтинг, разработка программного обеспечения, Интернет и техническая поддержка',
        'IT services: consulting, software development, Internet and support',
        'Маалыматтык кызмат көрсөтүүлөр: консалтинг, программалык камсыздоону иштеп чыгуу, Интернет жана техникалык колдоо')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('73', '73000000-2', 'Услуги по исследованию и разработке и связанные с ними консультативные услуги',
        'Research and development services and related consultancy services',
        'Изилдөө жана иштеп чыгуу боюнча кызмат көрсөтүүлөр жана алар менен байланышкан консультативдик кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('75', '75000000-6', 'Услуги общественного администрирования, защиты и социального обеспечения',
        'Administration, defence and social security services',
        'Коомдук администрлөө, коргоо жана социалдык камсыздоо кызмат көрсөтүүсү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('76', '76000000-3', 'Услуги, связанные с нефтяной и газовой индустрией',
        'Services related to the oil and gas industry',
        'Нефти жана газ индустриясы менен байланыштуу кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('77', '77000000-0',
        'Услуги в области сельского хозяйства, лесного хозяйства, садоводства, аквакультуры и пчеловодства',
        'Agricultural, forestry, horticultural, aquacultural and apicultural services',
        'Айыл чарба, токой чарбасы, бак өстүрүүчүлүк, аква өсүмдүктөр жана аарычылык чөйрөсүндөгү кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('79', '79000000-4',
        'Услуги для предприятий: юридические, маркетинговые, по консультированию, подбору кадров, издательской деятельности и безопасности',
        'Business services: law, marketing, consulting, recruitment, printing and security',
        'Ишканалар үчүн кызмат көрсөтүүлөр: юридикалык, маркетингдик, консультация берүү, кадрларды тандоо, басмакана иши жана коопсуздук боюнча')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('80', '80000000-4', 'Услуги в области образования и профессиональной подготовки',
        'Education and training services',
        'Билим берүү жана кесиптик даярдоо чөйрөсүндөгү кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('85', '85000000-9', 'Услуги в области здравоохранения и социального обслуживания',
        'Health and social work services',
        'Саламаттык сактоо жана социалдык тейлөө чөйрөсүндөгү кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('90', '90000000-7',
        'Услуги по удалению сточных вод,  уничтожению отходов, санитарные услуги и экологические услуги',
        'Sewage-, refuse-, cleaning-, and environmental services',
        'Агып чыккан сууларды, таштандыларды жок кылуу, санитардык жана экологиялык кызмат көрсөтүүлөр')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('92', '92000000-1', 'Отдых и развлечения, культура и спорт',
        'Recreational, cultural and sporting services',
        'Эс алуу жана көңүл ачуу, маданият жана спорт')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('98', '98000000-3', 'Предоставление прочих коммунальных, социальных и персональных услуг',
        'Other community, social and personal services',
        'Жана башка коммуналдык, социалдык жана жеке кызматтарды көрсөтүү')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('44', '44000000-0',
        'Строительство и строительные материалы; вспомогательные продукты для строительства (за исключением электрической аппаратуры)',
        'Construction structures and materials; auxiliary products to construction (excepts electric apparatus)',
        'Курулуш материалдары жана ага байланыштуу буюмдар')
ON CONFLICT DO NOTHING;
INSERT INTO okgz (code, original_code, name, name_en, name_kg)
VALUES ('93', '93000000-3', 'ЭБД ЛС и МИ КР',
        'Local eCatalogue of medicines and medical products',
        'КР ДК жана МБ МЭБ')
ON CONFLICT DO NOTHING;