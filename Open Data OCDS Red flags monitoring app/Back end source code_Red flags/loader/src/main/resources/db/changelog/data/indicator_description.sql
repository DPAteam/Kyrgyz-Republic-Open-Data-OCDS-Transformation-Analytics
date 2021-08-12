--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true

UPDATE indicator
SET description = 'В закупке принимают участие поставщики (подрядчики) с одинаковыми контактными данными.',
    description_en = 'Bidders with the same contact information',
    description_kg = 'Сатып алууга бирдей байланыш маалыматтары менен жабдуучулар (подрядчылар) катышат.'
WHERE id = 1;
UPDATE indicator
SET description = 'Метод прямого заключения договора по дозакупке товаров, услуг или работ ссылается на метод прямого заключения договора.',
    description_en = 'The Direct Contracting (Single-source procurement) method applied without a legitimate  reason',
    description_kg = 'Товарларды, кызмат көрсөтүүлөрдү же жумуштарды жеткире сатып алуу боюнча келишимди түз түзүү ыкмасы, келишимди түз түзүү ыкмасына шилтемеленет.'
WHERE id = 2;
UPDATE indicator
SET description = '2 и больше объявления закупок методом прямого заключения договора для одного предмета закупки по причине дозакупок товаров, услуг, работ до 5% от стоимости предыдущего конкурса.',
    description_en = 'An additional procurement by single-source procurement method exceeding 5% from the previous tender value',
    description_kg = 'Мурунку конкурстун наркынан 5%га чейин товарларды, кызмат көрсөтүүлөрдү, жумуштарды жеткире сатып алуу себеби менен, сатып алуунун бир предмети үчүн келишимди түзү түзүү ыкмасы менен сатып алууларды 2 жана көп жарыялоо.'
WHERE id = 3;
UPDATE indicator
SET description = 'Прямое заключение договора по коду ОКГЗ, по которому ранее был отменен лот или конкурс.',
    description_en = 'The Direct Contracting (Single-source procurement) method applied to the previously cancelled procurement',
    description_kg = 'Ал боюнча мурда токтотулган лот же конкурс боюнча, ОКГЗ коду менен келишимди түз түзүү.'
WHERE id = 4;
UPDATE indicator
SET description = 'В конкурсе не предусмотрено никаких штрафов в процессе выполнения договора.',
    description_en = 'Contractual penalties are not stipulated in the signed contract.',
    description_kg = 'Конкурста келишимди аткаруу процессинде эч кандай айып пулдар каралган эмес.'
WHERE id = 5;
UPDATE indicator
SET description = 'Слишком низкий уровень конкуренции. Конкуренция в конкурсе на 30% ниже, чем в среднем по данному ОКГЗ коду в данном регионе.',
    description_en = 'Low level of completion. The competition level is 30% below than the average level of completion in public procurement market.',
    description_kg = 'Атаандаштык деңгээли абдан төмөн. Конкурстагы атаандаштык, ошол региондогу ОКГЗ маалыматтары боюнча орточо, 30% дан төмөн.'
WHERE id = 6;
UPDATE indicator
SET description = 'Стоимость предложений на лот отличаются на 30%.',
    description_en = 'The values of submitted bids differ by 30 % from each other',
    description_kg = 'Лот боюнча сунуштардын наркы 30%га айырмаланат.'
WHERE id = 7;
UPDATE indicator
SET description = 'На конкурс (лот) закупающей организации более 20 раз приходит всего 1 участник.',
    description_en = 'Only one bidder is more than 20 times in the procedures of a contracting authority ',
    description_kg = 'Сатып алуучу уюмдун конкурсуна (лотуна) болгону 1 катышуучу 20дан ашык жолу келет.'
WHERE id = 8;
UPDATE indicator
SET description = 'Использование "условных" единиц измерения в упрощенных торгах, где нет тендерной документации.',
    description_en = 'Manipulations with conventional units in simplified acquisition procedures without tender documentation',
    description_kg = 'Тендердик документтер жок, жөнөкөйтүлгөн тооруктарда өлчөөнүн “шарттуу” бирдиктерин колдонуу.'
WHERE id = 9;
UPDATE indicator
SET description = 'Использование "условных" единиц измерения.',
    description_en = 'Manipulations with conventional units in simplified acquisition',
    description_kg = 'Өлчөөнүн “шарттуу” бирдиктерин колдонуу.'
WHERE id = 10;
UPDATE indicator
SET description = 'Закупающая организация указала ограниченное количество квалификационных требований (только два обязательных)',
    description_en = 'A  contracting authority applied a limited number of qualification requirements for a subject-matter (two compulsory requirements).',
    description_kg = 'Сатып алуучу уюм квалификациялык талаптардын чектелген санын көрсөткөн (милдеттүү эки гана).'
WHERE id = 12;
UPDATE indicator
SET description = 'При закупке услуг и товаров, произведенных в результате деятельности подлежащей обязательному лицензированию, закупающая организация не запрашивает у поставщиков соответствующих лицензий.',
    description_en = 'A contracting authority procured goods, works or services which were subjects to mandatory licensing and certification; however, the licences have not been requested. ',
    description_kg = 'Милдеттүү лицензиялоого тиешелүү иштин натыйжасында жүргүзүлгөн товарларды жана кызмат көрсөтүүлөрдү сатып алууда, сатып алуучу уюм жабдуучудан тиешелүү лицензияны сурабайт.'
WHERE id = 13;
UPDATE indicator
SET description = 'Поставщик (подрядчик) никогда не побеждал в конкурсных процедурах других закупающих организаций.',
    description_en = 'A supplier has not been awarded in any other tenders by other contracting authorities.',
    description_kg = 'Жабдуучу (подрядчы) башка сатып алуучу уюмдарын конкурстук жол-жоболорунда эч качан жеңген эмес.'
WHERE id = 14;
UPDATE indicator
SET description = 'Закупка товаров методом прямого заключения договора превышает 5% стоимости договора, заключенного на основании проведенного конкурса при сохранении цены и технических спецификаций. Дозакупка товаров, которые ранее не закупались. Дозакупка товаров с отсылкой не на конкурс.',
    description_en = 'A contracting authority procured goods, works or services with 5% rise in price through the Direct Contracting (single-source procurement) method compared to the price of the procurement with the same technical specification procured through competitive procurement method.',
    description_kg = 'Келишимди түз  түзүү ыкмасы менен товарларды сатып алуу, бааларды жана техникалык өзгөчөлүктөрдү сактоо менен, өткөрүлгөн конкурстун негизинде түзүлгөн келишим наркын 5%га ашырат. Мурда сатылып алынбаган товарларды жеткире сатып алуу. Конкурска жөнөтүлбөгөн товарларды жеткире сатып алуу.'
WHERE id = 15;
UPDATE indicator
SET description = 'Закупающая организация использует упрощенный метод с превышением установленных законом максимальной пороговой суммы.',
    description_en = 'A contracting authority procured through the Simplified acquisition method exceeding the stipulated thresholds.',
    description_kg = 'Сатып алуучу уюм мыйзам менен белгиленген максималдуу босого суммасын ашыруу менен, “жөнөкөйлөтүлгөн ыкма менен конкурс” ыкмасын колдонот'
WHERE id = 16;
UPDATE indicator
SET description = 'Применение закупки методом прямого заключения договора с одним и тем же поставщиком по причине приобретения товаров, работ и услуг по каждой статье расходов один раз в год до минимальной пороговой суммы, используя похожие статьи ОКГЗ.',
    description_en = 'A contracting authority annually procures the subject matter from the same supplier through the Direct Contracting (single-source procurement) method applying similar CPV codes for procurement under stipulated thresholds.',
    description_kg = 'ОКГЗнын окшош беренелерин колдонуу менен, минималдуу босого суммасына чейин жылына бир жолу чыгымдардын ар бир беренеси боюнчатоварларды, жумуштарды жана кызмат көрсөтүүлөрдү сатып алуу себеби боюнчабир же ошол эле жабдуучу менен түз келишим түзүү ыкмасын сатып алууларга колдонуу'
WHERE id = 17;
UPDATE indicator
SET description = 'Неправомерное применение закупки методом прямого заключения договора по причине Статья 21. п. 4, п.п. 7. (если проводимые конкурсы были признаны несостоявшимися и повторное проведение конкурса с учетом пересмотренных требований конкурсной документации не привело к заключению договора)',
    description_en = 'A contract was awarded through the Direct Contracting (Single-source procurement) method, pursuant to article 21.4.7.',
    description_kg = '21-берененин 4-пунктунун 7-пунктчасынын себеби боюнчатүз келишим түзүү ыкмасын укуксуз колдонуу (эгерде, өткөрүлгөн конкурстар өтпөй калды деп таанылса жана конкурстук документтердин кайрадан каралган талаптарын эске алуу менен, конкурсту кайрадан өткөрүү).'
WHERE id = 18;
