-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/jCWWo0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.



CREATE TABLE RepresentationTable1 (
    Country Varchar   NOT NULL,
    countryCode Varchar   NOT NULL,
    Population Integer   NOT NULL,
	LHR Integer   NOT NULL,
	UHR Integer   NOT NULL,
	CPRLH Integer   NOT NULL,
	CPRUH Integer   NOT NULL,
    Group Varchar   NOT NULL,
    CONSTRAINT PK PRIMARY KEY (countryCode)
);

-- INSERT CSVs HERE


-- END