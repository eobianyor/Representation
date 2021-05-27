#################################################
###        IMPORT NECESSARY LIBRARIES         ###
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

from datetime import datetime

from config import dbuser, dbpassword, dbhost, dbport, dbname

#################################################
####              FLASK SETUP                ####
#################################################
app = Flask(__name__)

#################################################
####              DATABASE SETUP             ####
#################################################

######################## CONNECTION STRINGS #############################
# connection_string1 = f'{pg_user}:{password}@localhost:5432/{db_name}'
connection_string2 = f'{dbuser}:{dbpassword}@database-1.cvmfiiilpm7y.us-east-1.rds.amazonaws.com:{dbport}/{dbname}'
# Heroku connection_string = postgres://

try:
    db_uri = os.environ['DATABASE_URL']
except KeyError:
    db_uri = f"postgresql://{connection_string2}"

print(db_uri)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri

db = SQLAlchemy(app)

######################## CONNECT TO DATABASE ############################
engine = create_engine(f'postgresql://{connection_string2}')

######################### CONNECT TO SESSION ############################
session = Session(engine)
connection = engine.connect()

repData = pd.read_sql(f"SELECT * FROM Part1_table", connection)

############# DATA CLEAN - FIX ISSUES AND RENAME COLUMNS ################
# RENAME COLUMNS
# repData = repData.rename(columns={'country': 'country', 'video_id': 'video_id', 'title': 'title', 'publishedAt': 'publishedAt', 'channelTitle': 'channelTitle', 'categoryId': 'categoryId',
                                          'trending_date': 'trending_date', 'view_count': 'views', 'likes': 'likes', 'dislikes': 'dislikes', 'comment_count': 'comments', 'thumbnail_link': 'thumbnail_link'})
connection.close()
session.close()

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
@app.route("/countryset1/<countries>/<house>")
def countryset1(countries = None, house = None):

    ##### Code to get the Dataset needed for graph #####
    ##### If statement for Country group selection #####
    if countries == 'OECD':
        countryGroup1='OECD Countries'
        countryGroup2='OECD Countries'
    elif countries == 'RANDOM':
        countryGroup1='Random Countries'
        countryGroup2='Random Countries'
    else:
        countryGroup1='OECD Countries'
        countryGroup2='Random Countries'

    ##### If statement for House selection #####
    if house == 'Upper House':
        colofInterest1='CPRUH'
        colofInterest2='UHR'
    else:
        colofInterest1='CPRLH'
        colofInterest2='LHR'

    ##### Sort dataframe by countries & house & select columns to keep #####
    barGraphData=repData[(repData["Group"] == countryGroup1)
                          | (repData["Group"] == countryGroup2)]

    ##### Filter for data that isn't 0 #####
    barGraphData=barGraphData[barGraphData[colofInterest1] != 0]

    ##### Sort data by Column of Interest #####
    sortedBarGraphData=barGraphData.sort_values(by = colofInterest1)

    ##### Select columns you want for output #####
    sortedBarGraphData=sortedBarGraphData[[
        "Country", "countryCode", "Population", colofInterest1, colofInterest2]]

    ##### Renaming columns #####
    Part1b_df = sortedBarGraphData.rename(columns ={'Country': 'country', 'countryCode': 'countryCode', 'Population': 'population', colofInterest1: 'cpr', colofInterest2: 'reps'})

    ##### Convert data to a dictionary #####
    sortedBarGraphData=sortedBarGraphData.to_dict()
    ##### Jsonify the data #####
    return jsonify(sortedBarGraphData)

######################### ROUTE FOR ALL DATA ############################
@app.route("/allData")
def allData():
    allData=repData

    allData=allData.to_dict()

    return jsonify(allData)

#################################################
####             CLOSE IF LOOP               ####
#################################################


if __name__ == "__main__":
    app.run(debug = True)

#################################################
####            END OF FLASK APP             ####
#################################################

################## ROUTE FOR BAR GRAPH LOWER HOUSE #####################
# @app.route("/dataset1/<metric>")
# def dataset1(metric):

#     # Sort dataframe by country & category & metric
#     barGraph1Data=youtubeVids[youtubeVids["Group"] == country]
#     barGraph1Data=barGraph1Data.groupby('categoryId').mean()
#     barGraph1Data=barGraph1Data[metric]

#     ##### Convert data to a dictionary #####
#     barGraph1Data=barGraph1Data.to_dict()
#     ##### Jsonify the data #####
#     return jsonify(barGraph1Data)
# ####################### ROUTE FOR LINE GRAPH ##########################
# @app.route("/dataset3/<country>/<metric>")
# def dataset3(country, metric):
#     lineData=youtubeVids[youtubeVids["country"] == country]

#     # add a timestamp column to dataframe
#     timestamps=[]
#     for index, row in lineData.iterrows():
#         t=row["publishedAt"]
#         td=datetime(t.year, t.month, t.day)
#         datetime.timestamp(td)
#         timestamps.append(datetime.timestamp(td))
#     lineData["timestamp"]=timestamps

#     # get top three categories
#     topThree=list(lineData.groupby(["categoryId"]).sum()[
#                     "likes"].sort_values(ascending=False).index[0:3])

#     # Select one category and group by timeStamp
#     first = lineData[lineData["categoryId"] == topThree[0]]
#     first = first.groupby("timestamp").sum()

#     ##### Convert data to a dictionary #####
#     first = first[metric].to_dict()
#     ##### Jsonify the data #####
#     return jsonify(first)

# ####################### ROUTE FOR TOP 10 TABLE ##########################
# @app.route("/dataset4/<country>/<category>/<metric>")
# def dataset4(country=None, category=None, metric=None):
#     # Fix the 29 vs Non profits issue
#     youtubeVids['categoryId'] = youtubeVids['categoryId'].replace(
#         ["29"], "Nonprofits & Activism")

#     # Sort dataframe by country & category
#     table_df = youtubeVids[youtubeVids["country"] == country]
#     table_df = table_df[table_df["categoryId"] == category]

#     # print('metric=', metric)
#     # Sort dataframe (largest to smallest) by metric selected
#     sorted_table_df = table_df.sort_values(by=metric, ascending=False)

#     # Remove duplicate videos from dataframe
#     sorted_table_df = sorted_table_df.drop_duplicates(
#         subset='title', keep="first")

#     # print('metric=', metric)
#     # Select top 10 (based on metric selected) from dataframe
#     top10TableData_df = sorted_table_df.nlargest(10, metric)

#     # Select columns to keep for table
#     top10TableData_df = top10TableData_df[['categoryId', 'country', 'title', 'channelTitle',
#                                            'views', 'comments', 'trending_date', 'likes', 'dislikes', 'video_id', 'thumbnail_link']]

#     ##### Convert data to a dictionary #####
#     top10TableData = top10TableData_df.to_dict(orient="records")
#     ##### Jsonify the data #####
#     # print(jsonify(top10TableData))
#     return jsonify(top10TableData)
# # return render_template('test_out.html', data=top10TableData)

# ######################### ROUTE FOR ALL DATA ############################
# @app.route("/allData")
# def allData():
#     allData = youtubeVids

#     allData = allData.to_dict()

#     return jsonify(allData)

# #################################################
# ####             CLOSE IF LOOP               ####
# #################################################


# if __name__ == "__main__":
#     app.run(debug=True)

# #################################################
# ####            END OF FLASK APP             ####
# #################################################
