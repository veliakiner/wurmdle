import json
import pathlib
import re
import os
if __name__ == "__main__":
    sprites_dir = pathlib.Path("./public") / "sprites"
    data_file = "src/Libraries/Pokemon/allGens.json"
    evo_data_file = "evoData.json"
    missing = []
    with open(evo_data_file) as f:
        evo_data = json.load(f)
    with open(data_file) as f:
        data = json.load(f)
        # Try to transform the name to get the file
        all_mon_names = [mon["name"].lower() for gen in data.values() for mon in gen.values()]
        for gen in data.values():
            for mon in gen.values():
                if mon.get("evos"):
                    continue
                name = mon["name"].lower()
                try:
                    evos = evo_data[name].get("evos")
                except KeyError:
                    missing.append(name)
                    continue
                evos = [e for e in evos if e.lower() in all_mon_names] if evos else None
                if evos:
                    mon["evos"] = evos


    for m in missing:
        print(m)
    print(f'Missing total of {len(missing)}')

    with open(data_file, "w") as f:
        json.dump(data, f, indent=4)
