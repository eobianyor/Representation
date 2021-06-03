#################################################
####       IMPORT NECESSARY DEPENDENCIES     ####
#################################################
import os
import pandas as pd
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import urllib

from datetime import datetime

from config import msql_serverName, msql_dbName

#################################################
####              FLASK SETUP                ####
#################################################
app = Flask(__name__)

#################################################
####              DATABASE SETUP             ####
#################################################

######################## CONNECTION STRINGS #############################
conn_str = (
    r'Driver=ODBC Driver 17 for SQL Server;'
    rf'Server={msql_serverName};'
    rf'Database={msql_dbName};'
    r'Trusted_Connection=yes;'
)
quoted_conn_str = urllib.parse.quote_plus(conn_str)
engine = create_engine(f'mssql+pyodbc:///?odbc_connect={quoted_conn_str}')

#################### APPEND DF TO TABLE IN DATABASE #####################
# cnxn = engine.connect()
# Part1_df.to_sql(name='RepresentationTable1', con=cnxn,
#                 if_exists='append', index=False)
# cnxn.close()

######## ERROR HANDLING FOR CONNECTION TO A CLOUD DB FOR HOSTING ########
# try:
#     db_uri = os.environ['DATABASE_URL']
# except KeyError:
#     db_uri = f'mssql+pyodbc:///?odbc_connect={quoted_conn_str}'

# print(db_uri)
# app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

# db = SQLAlchemy(app)

########################## CONNECT TO DATABASE ##########################
# engine = create_engine(f'postgresql://{connection_string2}')
engine = create_engine(f'mssql+pyodbc:///?odbc_connect={quoted_conn_str}')

################################ SESSION ################################
#### Connect to a Session ####
session = Session(engine)
connection = engine.connect()

#### Retreive dataset ####
repData = pd.read_sql(
    f"SELECT * FROM [dbo].[RepresentationTable2]", connection)


#### disconnect to a Session ####
connection.close()
session.close()
############################ END CONNECTION #############################

#################################################
####              HOME ROUTE                 ####
#################################################
@app.route("/")
def home():
    return render_template("index.html")

#################################################
####               DATA ROUTES               ####
#################################################

##################### ROUTE FOR HOUSE BAR GRAPH #######################
@app.route("/countryset1/<countryset1>/<house>")
def countryset1(countries=None, house=None):

    ##### Code to get the Dataset needed for graph #####
    ##### If statement for Country group selection #####
    if countries == 'OECD':
        countryGroup1 = 'OECD Countries'
        countryGroup2 = 'OECD Countries'
    elif countries == 'RANDOM':
        countryGroup1 = 'Random Countries'
        countryGroup2 = 'Random Countries'
    else:
        countryGroup1 = 'OECD Countries'
        countryGroup2 = 'Random Countries'

    ##### If statement for House selection #####
    if house == 'Upper House':
        colofInterest1 = 'CPRUH'
        colofInterest2 = 'UHR'
    else:
        colofInterest1 = 'CPRLH'
        colofInterest2 = 'LHR'

    ##### Sort dataframe by countries & house & select columns to keep #####
    barGraphData = repData[(repData["Group"] == countryGroup1)
                           | (repData["Group"] == countryGroup2)]

    ##### Filter for data that isn't 0 #####
    barGraphData = barGraphData[barGraphData[colofInterest1] != 0]

    ##### Sort data by Column of Interest #####
    sortedBarGraphData = barGraphData.sort_values(by=colofInterest1)

    ##### Select columns you want for output #####
    sortedBarGraphData = sortedBarGraphData[[
        "Country", "countryCode", "Population", colofInterest1, colofInterest2]]

    ##### Renaming columns #####
    sortedBarGraphData = sortedBarGraphData.rename(
        columns={'Country': 'country', 'countryCode': 'countryCode', 'Population': 'population', colofInterest1: 'cpr', colofInterest2: 'reps'})

    ##### Convert data to a dictionary #####
    sortedBarGraphData = sortedBarGraphData.to_dict()

    ##### Jsonify the data #####
    return jsonify(sortedBarGraphData)

######################### ROUTE FOR ALL DATA ############################
@app.route("/allData")
def allData():
    allData = repData

    allData = allData.to_dict()

    return jsonify(allData)

#################################################
####             CLOSE IF LOOP               ####
#################################################


if __name__ == "__main__":
    app.run(debug=True)

#################################################
####            END OF FLASK APP             ####
#################################################
