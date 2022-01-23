import json
import csv

from collections import defaultdict

with open("Pokemon.csv", newline="") as csvfile:
    reader = csv.reader(csvfile, delimiter=",", quotechar="|")
    all_gens = defaultdict(dict)
    next(reader)
    for row in reader:
        (
            number,
            name,
            type1,
            type2,
            total,
            hp,
            attack,
            defense,
            sp_attack,
            sp_defense,
            speed,
            generation,
            legendary,
        ) = row
        formes_to_ignore = "Gigantamax", "Mega"
        if any(f in name.split(" ") for f in formes_to_ignore):
            continue
        type1, type2 = sorted((type1, type2))
        all_gens[generation][name] = [generation, type1, type2, hp, attack, defense, sp_attack, sp_defense, speed]
    with open("src/allGens.json", "w") as f:
        f.write(json.dumps(all_gens, indent=4, sort_keys=True))
