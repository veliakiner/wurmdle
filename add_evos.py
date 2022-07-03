import json
import pathlib
import re
import os
if __name__ == "__main__":
    sprites_dir = pathlib.Path("./public") / "sprites"
    data_file = "src/Libraries/Pokemon/allGens.json"
    evo_data = "evoData.json"
    missing = []
    with open(evo_data) as f:
        evos = json.load(f)
    with open(data_file) as f:
        data = json.load(f)
        # Try to transform the name to get the file
        for gen in data.values():
            for mon in gen.values():
                name = mon["name"].lower()

    for m in missing:
        print(m)
    print(f'Missing total of {len(missing)}')

    with open(data_file, "w") as f:
        json.dump(data, f, indent=4)
