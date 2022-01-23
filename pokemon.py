import json
import csv

from collections import defaultdict
from dataclasses import dataclass, asdict


@dataclass
class Pokemon:
    # Reflects the ordering from the original CSV file.
    number: int
    name: str
    type1: str
    type2: str
    total: int
    hp: str
    attack: str
    defense: str
    sp_attack: str
    sp_defense: str
    speed: str
    generation: int
    legendary: bool


with open("Pokemon.csv", newline="") as csvfile:
    reader = csv.reader(csvfile, delimiter=",", quotechar="|")
    all_gens = defaultdict(dict)
    next(reader)
    for row in reader:
        pokemon = Pokemon(*row)
        formes_to_ignore = "Gigantamax", "Mega"
        if any(f in pokemon.name.split(" ") for f in formes_to_ignore):
            continue
        # Nobody cares if Armaldo is Rock/Bug rather than Bug/Rock.
        pokemon.type1, pokemon.type2 = sorted((pokemon.type1, pokemon.type2))

        all_gens[pokemon.generation][pokemon.name] = asdict(pokemon)
    with open("src/allGens.json", "w") as f:
        f.write(json.dumps(all_gens, indent=4, sort_keys=True))
