import json
import pathlib
import re
import os
if __name__ == "__main__":
    sprites_dir = pathlib.Path("./public") / "sprites"
    data_file = "src/Libraries/Pokemon/allGens.json"
    missing = []
    with open(data_file) as f:
        data = json.load(f)
        # Try to transform the name to get the file
        for gen in data.values():
            for mon in gen.values():
                name = mon["name"].lower()
                def swap(name, prefix, suffix=None):
                    if suffix is None:
                        suffix = prefix
                    return re.sub(rf'^{prefix} (.+)', fr"\1-{suffix}", name)

                name = swap(name, "mega")
                name = swap(name, "primal")
                name = swap(name, "galarian", "galar")
                name = swap(name, "alolan", "alola")
                name = re.sub(r" size$", "", name)
                name = re.sub(r" style$", "", name)
                name = re.sub(r" plant cloak", "", name)
                name = re.sub(r" cloak", "", name)
                name = re.sub(r" average$", "", name)
                name = re.sub(r" forme", "", name)
                name = re.sub(r" shield", "", name)
                name = re.sub(r" incarnate", "", name)
                name = re.sub(rf'(.+) rotom', fr"rotom \1", name)
                name = name.replace(".", "")
                name = name.replace("'", "")
                name = re.sub(r" +", " ", name)
                name = name.replace(" ", "-")
                file_name = f"{name}"
                if mon.get("sprite"):
                    continue
                while True:
                    if os.path.exists( sprites_dir/(file_name + ".png")):
                        mon["sprite"] = (file_name + ".png")
                        break
                    else:
                        file_name = input(f"Enter the file name for {name}: ")
                        if not file_name:
                            mon["sprite"] = None
                            break

    for m in missing:
        print(m)
    print(f'Missing total of {len(missing)}')

    with open(data_file, "w") as f:
        json.dump(data, f, indent=4)
