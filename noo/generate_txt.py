output_file = "large.txt"

for i in range(1000000):
    with open(output_file, "a") as f:
        f.write(f"a")
