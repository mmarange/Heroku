import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():

    # use render_template to serve up the index.html
    return render_template('index.html')

@app.route("/samples")
def samples():

    samples_json = open("static/data/samples.json", "r") 
    samples_data = json.load(samples_json)
    # open the json file, located at static/data/samples.json
    # use json.load() to read in the file as json
    # return that json through the Flask endpoini
    
    return samples_data


if __name__ == "__main__":
    app.run(debug=True)