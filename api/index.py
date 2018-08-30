from flask import Flask
import json
from credentials import uib_key
import urllib.request as request
from datetime import date
from icalendar import Calendar, Event


app = Flask(__name__)

config_path = "settings.json"

root_api_url = "https://tp.data.uib.no/KEYe3axy9a4a/ws/1.4"
room_event_url = root_api_url + \
    "/room.php?id={}&fromdate={}&todate={}&lang=no"

calender_events = "http://www.uib.no/nb/node/52181/eventlist.ics?event_types[]=disputation&event_types[]=trial_lecture"

current_date = date.today()


@app.route("/")
def index():
    return "Hei"


@app.route("/disp/")
def dispute():
    response = request.urlopen(calender_events).read()
    cal = Calendar.from_ical(response)
    for element in cal.walk("vevent"):
        print(element.get("dtstart").dt.date())
        print(current_date == element.get("dtstart").dt.date())

    return str(cal)


@app.route("/read")
def hello():
    print(current_date)
    config = read_config()
    zones = config["zones"]
    for zone in zones.values():
        for room in zone["rooms"]:
            fetch_room_events(room)
    save_schedule(config)

    return "complete"


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
    with open('schedule.json', 'w') as outfile:
        json.dump(data, outfile)
