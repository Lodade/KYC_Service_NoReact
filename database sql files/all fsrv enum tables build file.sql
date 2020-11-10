CREATE TABLE FSRV_PROD_TYPE_ENUM (
	PROD_TYPE char(1) NOT NULL,
	FULL_PROD_TYPE char(50) NOT NULL
) DEFAULT CHARSET = utf8;
INSERT INTO FSRV_PROD_TYPE_ENUM(PROD_TYPE,FULL_PROD_TYPE) VALUES
("A","High Interest Savings Account"),
("D","Structured Note"),
("E","Exchange Traded Fund"),
("F","Mortgage Fund"),
("G","Guaranteed Investment Certificate"),
("H","Hedge Fund"),
("I","Limited Partnership"),
("J","Private Equity Fund"),
("K","Mortgage Backed Securities"),
("L","Labour Sponsored Investment Fund"),
("M","Mutual Fund"),
("N","Principal Protected Note"),
("O","Other"),
("P","Pooled Fund"),
("Q","Non-Principle Protected Note"),
("R","Real Estate Fund"),
("S","Segregated Fund"),
("V","Venture Capital Fund"),
("W","Wrap Product"),
("X","Liquid Alternative Mutual Fund");

CREATE TABLE FSRV_LOAD_TYPE_ENUM (
	LOAD_TYPE char(4) NOT NULL,
	FULL_LOAD_TYPE char(50) NOT NULL
) DEFAULT CHARSET = utf8;
INSERT INTO FSRV_LOAD_TYPE_ENUM(LOAD_TYPE,FULL_LOAD_TYPE) VALUES
("CB","Chargeback"),
("FE","Front End Load"),
("DSC","Deferred Sales Charge"),
("LL","Low Load"),
("LL1","Low Load 1"),
("LL2","Low Load 2"),
("LL3","Low Load 3"),
("LL4","Low Load 4"),
("LL5","Low Load 5"),
("NL","No Load");

CREATE TABLE FSRV_CLASSIFICATION_ENUM (
	CLASSIFICATION char(2) NOT NULL,
	FULL_CLASSIFICATION char(50) NOT NULL
) DEFAULT CHARSET = utf8;
INSERT INTO FSRV_CLASSIFICATION_ENUM(ClASSIFICATION,FULL_CLASSIFICATION) VALUES
("01","Canadian Money Market"),
("02","U.S. Money Market"),
("03","Preferred Share Fixed Income"),
("04","Passive Inverse/Leveraged"),
("05","Commodity"),
("06","Energy Equity"),
("15","Canadian Equity"),
("17","Canadian Focused Equity"),
("18","North American Equity"),
("21","U.S. Equity"),
("22","U.S. Small/Mid Cap Equity"),
("23","European Equity"),
("25","Asia Pacific ex-Japan Equity"),
("26","Asia/Pacific Equity"),
("27","Global Equity"),
("28","International Equity"),
("29","Emerging Markets Equity"),
("32","Precious Metals Equity"),
("33","Natural Resources Equity"),
("34","Financial Services Equity"),
("35","Real Estate Equity"),
("36","Alternative Strategies"),
("37","Retail Venture Capital"),
("38","Miscellaneous"),
("39","Canadian Short Term Fixed Income"),
("40","Canadian Fixed Income"),
("41","Canadian Long Term Fixed Income"),
("42","Canadian Inflation Protected Fixed Income"),
("43","Global Fixed Income"),
("44","High Yield Fixed Income"),
("45","Canadian Equity Balanced"),
("46","Canadian Neutral Balanced"),
("47","Canadian Fixed Income Balanced"),
("48","Global Equity Balanced"),
("49","Global Neutral Balanced"),
("50","Global Fixed Income Balanced"),
("51","Tactical Balanced"),
("52","Canadian Dividend & Income Equity"),
("53","Canadian Small/Mid Cap Equity"),
("54","Canadian Focused Small/Mid Cap Equity"),
("55","Greater China Equity"),
("56","Global Small/Mid Cap Equity"),
("59","Short Term Target Date Portfolio"),
("60","2030 Target Date Portfolio"),
("62","Miscellaneous – Income and Real Property"),
("63","Sector Equity"),
("64","Geographic Equity"),
("67","Miscellaneous – Undisclosed Holdings"),
("68","Miscellaneous – Other"),
("69","2025 Target Date Portfolio"),
("70","Floating Rate Loan"),
("71","2035 Target Date Portfolio"),
("72","2035+ Target Date Portfolio"),
("73","Global Infrastructure Equity"),
("74","Canadian Corporate Fixed Income"),
("75","Global Corporate Fixed Income"),
("76","Emerging Markets Fixed Income"),
("77","Alternative Credit Focused"),
("78","Alternative Equity Focused"),
("79","Alternative Market Neutral"),
("80","Alternative Multi – Strategy"),
("81","Alternative Other");

CREATE TABLE FSRV_CURRENCY_ENUM (
	CURRENCY char(2) NOT NULL,
	FULL_CURRENCY char(50) NOT NULL
) DEFAULT CHARSET = utf8;
INSERT INTO FSRV_CURRENCY_ENUM(CURRENCY, FULL_CURRENCY) VALUES
("00","Canadian Dollar"),
("01","US Dollar"),
("02","Euro"),
("03","Pound Sterling");