SELECT c.inn, cn.iso_code country_code, l.title_ru
FROM company c
         JOIN country cn ON c.country_id = cn.id
         JOIN legal_form l ON c.legal_form_id = l.id
