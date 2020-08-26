--liquibase formatted sql

--changeset eddy:1 splitStatements:false runOnChange:true


INSERT INTO permission(id, name, description)
VALUES (1, 'admin.base', 'Администратор')
ON CONFLICT DO NOTHING;

INSERT INTO permission(id, name, description)
VALUES (2, 'user.base', 'Пользователь')
ON CONFLICT DO NOTHING;

-- Predefined permissions for admin and default user

INSERT INTO user_permission
VALUES (1, 1)
ON CONFLICT DO NOTHING;

INSERT INTO user_permission
VALUES (2, 2)
ON CONFLICT DO NOTHING;

UPDATE permission SET description_en = 'Administrator' WHERE id = 1;
UPDATE permission SET description_en = 'User' WHERE id = 2;