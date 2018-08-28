from flask import Flask
import json
from credentials import uib_key
import urllib.request as request


app = Flask(__name__)

config_path = "settings.json"

root_api_url = "https://tp.data.uib.no/KEYe3axy9a4a/ws/1.4"
room_event_url = root_api_url + \
    "/room.php?id={}&fromdate={}&todate={}&lang=no"


@app.route("/")
def hello():

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
    event_url = room_event_url.format(room["id"], "2018-08-28", "2018-08-28")
    data = json.loads(request.urlopen(event_url).read())
    room_events = []
    for event in data["events"]:
        room_events.append({k: v for k, v in event.items()
                            if k in ('teaching-method-name', 'coursename', 'dtstart', 'dtend', 'summary')})

    room["events"] = room_events


def save_schedule(data):
    with open('schedule.json', 'w') as outfile:
        json.dump(data, outfile)
