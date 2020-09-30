CREATE TABLE FSRV_PROD_MODEL (
    SEQ_ID int NOT NULL,
    TYPE char(6) NOT NULL,
    FREQ char(1) NOT NULL,
    SETTLE_PERIOD int NOT NULL,
    FOREIGN KEY (SEQ_ID) REFERENCES FSRV_PROD(FSRV_ID)
);