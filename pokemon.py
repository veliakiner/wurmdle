import csv
import json
from collections import defaultdict
from dataclasses import dataclass, asdict

from typing import List

from distutils.util import strtobool


@dataclass
class Stats:
    hp: int
    attack: int
    defense: int
    sp_attack: int
    sp_defense: int
    speed: int


@dataclass
class Pokemon:
    # Reflects the ordering from the original CSV file.
    number: int
    name: str
    types: List[str]
    total: int
    stats: Stats
    generation: int
    legendary: bool


if __name__ == "__main__":
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
            # Nobody cares if Armaldo is Rock/Bug rather than Bug/Rock.
            types = sorted([t for t in (type1, type2) if t != ""])
            pokemon = Pokemon(
                int(number),
                name,
                types,
                int(total),
                Stats(*map(int, (hp, attack, defense, sp_attack, sp_defense, speed))),
                int(generation),
                bool(strtobool(legendary)),
            )
            formes_to_ignore = "Gigantamax", "Mega"
            if any(f in pokemon.name.split(" ") for f in formes_to_ignore):
                continue

            all_gens[pokemon.generation][pokemon.name] = asdict(pokemon)
        with open("src/allGens.json", "w") as f:
            f.write(json.dumps(all_gens, indent=4, sort_keys=True))
