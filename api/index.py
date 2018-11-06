from flask import Flask, jsonify
import json
from credentials import uib_key
import urllib.request as request
from datetime import date, datetime
from icalendar import Calendar, Event
from os import path
from flask_cors import CORS
import sys
import pandas


app = Flask(__name__)
app.debug = True
CORS(app)
application = app


config_path = "settings.json"
log_path = "log.txt"

root_api_url = "https://tp.data.uib.no/{}/ws/1.4".format(uib_key)
room_event_url = root_api_url + \
    "/room.php?id={}&fromdate={}&todate={}&lang=no"

calender_events = "http://www.uib.no/nb/node/52181/eventlist.ics?event_types[]=disputation&event_types[]=trial_lecture"

current_date = date.today().strftime("%Y-%m-%d")
current_day_path = "schedules/" + current_date + ".json"

print(current_day_path)


@app.route("/")
def index():
    return sys.version


@app.route("/schedule/")
def hello():

    stored = read_schedule()

    if stored:
        return json.dumps(stored, ensure_ascii=False).encode()

    config = read_file(config_path)

    zones = config["zones"]
    config["timestamp"] = str(current_date)

    for zone in zones.values():
        for room in zone["rooms"]:
            fetch_room_events(room)

    save_schedule(config)
    log()

    return json.dumps(config, ensure_ascii=False).encode()


@app.route("/config/")
def config():
    return json.dumps(read_file(config_path))


@app.route("/disputas/")
def dispute():
    response = request.urlopen(calender_events).read()
    cal = Calendar.from_ical(response)
    events = []
    for element in cal.walk("vevent"):
        if date.today() == element.get("dtstart").dt.date():
            events.append({
                "dtstart": element["DTSTART"].dt.isoformat(),
                "dtend": element["DTEND"].dt.isoformat(),
                "summary": element["SUMMARY"] if "SUMMARY" in element else None,
                "location": element["LOCATION"] if "LOCATION" in element else None
            })

    return json.dumps(events)


@app.route("/rain/")
def is_it_raining():
    station_id = 29
    current_date = date.today().strftime("%Y-%m-%d")

    url = "https://www.bergensveret.no/ws/download?fromDate={}&toDate={}&action=period_query&s={}&params%5b%5d=RR_010&format=csv&downloadData=S%C3%B8k".format(
        current_date, current_date, station_id)
    print(url)

    dataframe = pandas.read_csv(url, sep="\t").reset_index()
    dataframe.columns = ["date", "time", "mm"]
    last_entry = dataframe.tail(1).iloc[0]
    return json.dumps(last_entry.to_dict())


def read_file(file_path):
    if not path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as input_file:
        return json.load(input_file)


def read_schedule():
    return read_file(current_day_path)


def read_config():
    with open(config_path, "r") as file:
        return json.load(file)


def fetch_room_events(room):
    event_url = room_event_url.format(room["id"], current_date, current_date)
    data = json.loads(request.urlopen(event_url).read())
    room_events = []
    for event in data["events"]:
        room_events.append({k: v for k, v in event.items()
                            if k in ('teaching-method-name', 'coursename', 'dtstart', 'dtend', 'summary')})

    room["events"] = room_events


def save_schedule(data):
    with open(current_day_path, 'w+') as outfile:
        json.dump(data, outfile)


def log():
    with open(log_path, "a+") as log_file:
        log_file.write(current_date + "\n")


if __name__ == "__main__":
    app.run(debug=True)
