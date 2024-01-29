import requests

# Define a context manager for handling files to ensure proper closure
with open("total_test_sorted.txt", "r") as input_file, open(
    "output1.txt", "a"
) as output1, open("output2.txt", "a") as output2, open(
    "output3.txt", "a"
) as output3, open(
    "all_url_filtered.txt", "a"
) as all_url:

    def has_keyword(text, keywords):
        """Check if any of the keywords exists in the given text."""
        return any(keyword in text for keyword in keywords)

    idx = 0
    for line in input_file:
        try:
            idx += 1
            print(idx)
            is_written = False  # Flag to track if any URL is written to 'all_url'
            arr = line.strip().split(",")
            record_id, url1 = arr[0], arr[1]

            r1 = requests.get(url1, timeout=2)
            if r1.status_code != 200:
                continue

            for url2 in arr[2:]:
                if not url2.startswith("https://"):
                    continue

                r2 = requests.get(url2, timeout=3)
                if r2.status_code != 200:
                    continue

                # Define keyword groups for different checks
                form_keywords = ["form"]
                login_keywords = ["password", "login", "sign up", "sign in"]
                checkout_keywords = ["checkout", "cart"]

                # Perform checks and write to the corresponding files
                if has_keyword(r1.text, form_keywords) and has_keyword(
                    r2.text, form_keywords
                ):
                    output1.write(f"{record_id},{url1},{url2}\n")
                    is_written = True
                if has_keyword(r1.text, login_keywords) and has_keyword(
                    r2.text, login_keywords
                ):
                    output2.write(f"{record_id},{url1},{url2}\n")
                    is_written = True
                if has_keyword(r1.text, checkout_keywords) and has_keyword(
                    r2.text, checkout_keywords
                ):
                    output3.write(f"{record_id},{url1},{url2}\n")
                    is_written = True

                if is_written:
                    all_url.write(f"{record_id},{url1}\n")

        except Exception as e:
            print(f"Error processing {url1}: {e}")
