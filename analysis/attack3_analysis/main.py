import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# Open output files in append mode
with open("output.txt", "a") as output1, open("attack3-url.txt", "a") as output2:
    # Read the list of URLs from input.txt
    with open("test.txt", "r") as file:
        lines = file.read().splitlines()

    def is_different_domain(url1, url2):
        """Check if two URLs belong to different domains."""
        # Parse the URLs to extract their domains
        parsed_url1, parsed_url2 = urlparse(url1), urlparse(url2)
        domain1 = ".".join(parsed_url1.netloc.split(".")[-2:])
        domain2 = ".".join(parsed_url2.netloc.split(".")[-2:])

        # Compare the top-level and second-level domains
        return domain1 != domain2

    # Iterate through the list of URLs
    for line in lines:
        try:
            idx, url = line.split(",")
            print(idx)
            response = requests.get(url, timeout=5)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")
                links = soup.find_all("a")
                link_found = False

                for link in links:
                    href = link.get("href")
                    target = link.get("target")

                    # Ensure href is valid, is an absolute URL, and points to a different domain
                    if (
                        href
                        and href.startswith("https")
                        and is_different_domain(url, href)
                    ):
                        # Check if the 'target' attribute is not '_blank'
                        if not target or target.lower() != "_blank":
                            output1.write(f"{idx}, {url}, {href}\n")
                            link_found = True

                if link_found:
                    output2.write(f"{idx}, {url}\n")

        except Exception as e:
            print(f"Error fetching or parsing {url}: {e}")
