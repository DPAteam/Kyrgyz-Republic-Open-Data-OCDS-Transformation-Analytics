--liquibase formatted sql

--changeset eddy:1 splitStatements:false runOnChange:true


INSERT INTO users(email, password, name, verification_mail_sent)
VALUES ('admin@datapath.com', '$2a$10$Hvl.cwZe6rBzGNkLGf7wPuUM70hQlBGpjc1ZTSgG3jtipFps9FVNm', 'ADMIN', true)
ON CONFLICT DO NOTHING;

INSERT INTO users(email, password, name, verification_mail_sent)
VALUES ('auditor@datapath.com', '$2a$10$Hvl.cwZe6rBzGNkLGf7wPuUM70hQlBGpjc1ZTSgG3jtipFps9FVNm', 'AUDITOR', true)
ON CONFLICT DO NOTHING;

UPDATE users
set email    = 'kgexante.ocdstools.adm@gmail.com',
    password = '$2a$10$qv8Ng.B4rqiTP/8sMQPBT.e13VMTKyykpzrnkYWShZYnMsefTxndu'
WHERE id = 1;