from datetime import date
current_date = date.today().strftime("%Y-%m-%d")
current_day_path = "schedules/" + current_date + ".json"
import json
from os import path


def read_file(file_path):
    if not path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as input_file:
        return json.load(input_file)


print(json.dumps(read_file("schedules/2018-09-29.json")))
