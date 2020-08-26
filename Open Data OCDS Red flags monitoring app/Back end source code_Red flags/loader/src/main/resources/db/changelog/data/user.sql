--liquibase formatted sql

--changeset eddy:1 splitStatements:false runOnChange:true


INSERT INTO users(email, password, name)
VALUES ('admin@datapath.com', '$2a$10$Hvl.cwZe6rBzGNkLGf7wPuUM70hQlBGpjc1ZTSgG3jtipFps9FVNm', 'ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO users(email, password, name)
VALUES ('auditor@datapath.com', '$2a$10$Hvl.cwZe6rBzGNkLGf7wPuUM70hQlBGpjc1ZTSgG3jtipFps9FVNm', 'AUDITOR')
ON CONFLICT DO NOTHING;