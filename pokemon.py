import json
import csv
from collections import defaultdict
with open('Pokemon.csv', newline='') as csvfile:
     reader = csv.reader(csvfile, delimiter=',', quotechar='|')
     json_dump = {}
     next(reader)
     for row in reader:
          number, name, type1, type2, total, hp, attack, defense, sp_attack, sp_defense, speed, generation, legendary = row
          formes_to_ignore = "Gigantamax", "Mega"
          if (any(f in name.split(" ") for f in formes_to_ignore)):
               continue
          type1, type2 = sorted((type1, type2))
          json_dump[name] = [generation, type1, type2, hp, attack, defense, sp_attack, sp_defense, speed]
          # if len(json_dump.keys()) > 10:
          #      break
     with open("src/pokemon.json", "w") as f:
          f.write(json.dumps(json_dump))


