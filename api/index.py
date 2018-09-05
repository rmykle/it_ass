from flask import Flask, jsonify
import json
from credentials import uib_key
import urllib.request as request
from datetime import date, datetime
from icalendar import Calendar, Event
from os import path
import sys
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
application = app

config_path = "settings.json"
schedule_path = "schedule.json"
log_path = "log.txt"

root_api_url = "https://tp.data.uib.no/{}/ws/1.4".format(uib_key)
room_event_url = root_api_url + \
    "/room.php?id={}&fromdate={}&todate={}&lang=no"

calender_events = "http://www.uib.no/nb/node/52181/eventlist.ics?event_types[]=disputation&event_types[]=trial_lecture"

current_date = date.today()


@app.route("/")
def index():
    return sys.version


@app.route("/test/")
def test():
    print("hei")
    return "test ok"


@app.route("/disputas/")
def dispute():
    response = request.urlopen(calender_events).read()
    cal = Calendar.from_ical(response)
    events = []
    for element in cal.walk("vevent"):
        if current_date == element.get("dtstart").dt.date():
            events.append({
                "dtstart": element["DTSTART"].dt.isoformat(),
                "dtend": element["DTEND"].dt.isoformat(),
                "summary": element["SUMMARY"] if "SUMMARY" in element else None,
                "location": element["LOCATION"] if "LOCATION" in element else None
            })

    return jsonify(events)


@app.route("/schedule/")
def hello():

    stored = read_schedule()
    if stored:
        return jsonify(stored)

    config = read_config()
    zones = config["zones"]
    config["timestamp"] = str(current_date)
    for zone in zones.values():
        for room in zone["rooms"]:
            fetch_room_events(room)

    save_schedule(config)
    log()

    return jsonify(config)


def read_schedule():
    if not path.exists(schedule_path):
        return None
    with open(schedule_path, "r") as inputfile:
        data = json.load(inputfile)
        file_stamp = datetime.strptime(data["timestamp"], "%Y-%m-%d")
        if file_stamp.date() == current_date:
            return data
        else:
            return None


def read_config():
    with open(config_path, "r") as file:
        return json.load(file)


def fetch_room_events(room):
    event_url = room_event_url.format(room["id"], current_date.strftime(
        "%Y-%m-%d"), current_date.strftime("%Y-%m-%d"))
    data = json.loads(request.urlopen(event_url).read())
    room_events = []
    for event in data["events"]:
        room_events.append({k: v for k, v in event.items()
                            if k in ('teaching-method-name', 'coursename', 'dtstart', 'dtend', 'summary')})

    room["events"] = room_events


def save_schedule(data):
    with open(schedule_path, 'w') as outfile:
        json.dump(data, outfile)


def log():
    with open(log_path, "a+") as log_file:
        log_file.write(current_date.strftime(
            "%Y-%m-%d") + "\n")
