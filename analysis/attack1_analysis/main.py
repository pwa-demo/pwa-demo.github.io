# Using context managers for automatic handling of file resources
with open("final_pwa.txt", "r") as input_file, open(
    "final_similar_pwa.txt", "w"
) as output_file:
    # Initialize a dictionary to map domains to their URLs
    domain_map = {}

    # Iterate over each line in the input file
    for line in input_file:
        # Strip whitespace and extract URL
        url = line.strip()
        # Extract the domain from the URL
        domain = url.replace("https://", "").split("/")[0]

        # Initialize the domain key in the dictionary if not already present
        if domain not in domain_map:
            domain_map[domain] = []

        # Append the URL to the list associated with the domain
        domain_map[domain].append(url)

    # Iterate over the domains in the dictionary
    for domain, urls in domain_map.items():
        # Only consider domains with more than one URL
        if len(urls) > 1:
            # Write the domain and its URLs to the output file, separated by commas
            output_file.write(f"{domain}," + ",".join(urls) + "\n")
