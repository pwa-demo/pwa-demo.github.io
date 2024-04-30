import json
import random
import argparse
import string

# Base manifest structure
base_manifest = {
    "name": "Starbucks",
    "short_name": "Starbucks",
    "description": "a Progressive Web App",
    "scope": "/fuzz/",
    "start_url": "/fuzz/id?=002",
    "background_color": "#000000",
    "dir": "",
    "id": "",
    "theme_color": "#ffffff",
    "display": "standalone",
    "icons": [
        {
            "src": "/fuzz/images/pwa-icon-512.png",
            "type": "image/png",
            "sizes": "512x512",
        }
    ],
}

# Predefined values for fuzzing
predefined_values = {
    "name": ["CoffeeHouse", "ExpressoMax", "BrewCorner"],
    "theme_color": ["#FF5733", "#C70039", "#900C3F"],
}


def random_string(length=10):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def random_color():
    return f"#{''.join(random.choices('0123456789ABCDEF', k=6))}"


def random_url():
    return f"/fuzz/{random_string(5)}"


def fuzz_manifest(manifest, field):
    value = None
    if field in predefined_values:
        value = random.choice(predefined_values[field])
    else:
        if field.endswith("_color"):
            value = random_color()
        elif field == "start_url" or field == "scope":
            value = random_url()
        else:
            value = random_string()

    fuzzed_manifest = json.loads(json.dumps(manifest))  # Deep copy of the manifest
    if field in fuzzed_manifest:
        fuzzed_manifest[field] = value
    elif field.startswith("icons"):
        # Handle nested fields like icons.src
        parts = field.split(".")
        if (
            len(parts) == 2
            and parts[0] == "icons"
            and parts[1] in fuzzed_manifest["icons"][0]
        ):
            fuzzed_manifest["icons"][0][parts[1]] = value

    return fuzzed_manifest


def main():
    parser = argparse.ArgumentParser(
        description="Fuzz a specific field in a JSON manifest."
    )
    parser.add_argument("field", type=str, help="The field to fuzz.")
    args = parser.parse_args()

    new_manifest = fuzz_manifest(base_manifest, args.field)
    print(json.dumps(new_manifest, indent=2))


if __name__ == "__main__":
    main()
