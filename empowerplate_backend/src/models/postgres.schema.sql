CREATE DATABASE empowerplate
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

GRANT TEMPORARY, CONNECT ON DATABASE empowerplate TO PUBLIC;

GRANT ALL ON DATABASE empowerplate TO postgres;


CREATE TABLE rawFood (
    id BIGSERIAL UNIQUE NOT NULL,
    grainOrFlourType VARCHAR(50) PRIMARY KEY NOT NULL,
    amountInKg DECIMAL(10, 2) DEFAULT 0
);


INSERT INTO rawFood (grainOrFlourType, amountInKg)
VALUES
    ('RICE', 0),
    ('BASMATI_RICE', 0),
    ('BROWN_RICE', 0),
    ('PARBOILED_RICE', 0),
    ('RED_RICE', 0),
    ('WHEAT', 0),
    ('BARLEY', 0),
    ('MILLET', 0),
    ('BAJRA', 0),
    ('JOWAR', 0),
    ('RAGI', 0),
    ('MAIZE', 0),
    ('WHEAT_FLOUR', 0),
    ('RICE_FLOUR', 0),
    ('MAIZE_FLOUR', 0),
    ('BESAN', 0),
    ('RAJAGIRA_FLOUR', 0),
    ('RAGI_FLOUR', 0),
    ('JOWAR_FLOUR', 0),
    ('BAJRA_FLOUR', 0),
    ('MAIDA', 0),
    ('SEMOLINA', 0),
    ('MOONG_DAAL', 0),
    ('MASOOR_DAAL', 0),
    ('URAD_DAAL', 0),
    ('CHANA_DAAL', 0),
    ('TOOR_DAAL', 0),
    ('ARHAR_DAAL', 0),
    ('RAJMA', 0),
    ('KABULI_CHANA', 0),
    ('LOBIA', 0),
    ('HORSE_GRAM', 0),
    ('QUINOA', 0),
    ('AMARANTH', 0),
    ('FLAX_SEEDS', 0),
    ('SESAME_SEEDS', 0),
    ('SOYBEAN', 0),
    ('SUNFLOWER_SEEDS', 0),
    ('CHIA_SEEDS', 0),
    ('POHA', 0),
    ('SABUDANA', 0),
    ('BROKEN_WHEAT', 0),
    ('SOOJI', 0),
    ('SAGO', 0);


CREATE TABLE cookedFood (
    id BIGSERIAL UNIQUE NOT NULL,
    ageGroup VARCHAR(50) PRIMARY KEY NOT NULL,
    count DECIMAL(10, 2) DEFAULT 0
);


INSERT INTO cookedFood (ageGroup, count)
VALUES
    ('ADULT', 0),
    ('CHILD', 0);

