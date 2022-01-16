import json
import csv
from collections import defaultdict
with open('Pokemon.csv', newline='') as csvfile:
     reader = csv.reader(csvfile, delimiter=',', quotechar='|')
     indexed_by_stats = defaultdict(list)
     for row in reader:
          number, name, type1, type2, total, hp, attack, defense, sp_attack, sp_defense, speed, generation, legendary = row
          formes_to_ignore = "Gigantamax",
          if (any(f in name.split(" ") for f in formes_to_ignore)):
               continue
          type1, type2 = sorted((type1, type2))
          indexed_by_stats[(hp, attack, defense, sp_attack, sp_defense, speed, type1, type2)].append(name)
     # import pdb;pdb.set_trace()
     unique = 0
     for k, v in indexed_by_stats.items():
          if len(v) > 1:
               print(k, v)
          else:
               unique += 1
     with open("pokemon.json", "w") as f:
          f.write(json.dumps(indexed_by_stats))

