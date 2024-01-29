# PLUS Framework
## Introduction
This framework is designed to measure PWA (Progressive Web Application) permission systems. Further details are available in our paper.

## Steps to Run the Framework
1. To prepare the environment, visit https://pwa-demo.github.io/prepare. Here, you can download the browser for your mobile devices. If you are interested in downloading previous versions of a browser, a search function is also provided.
2. For measuring Permission Decision Evaluation and Browser Compatibility Analysis as discussed in our paper, visit https://pwa-demo.github.io/default. To assess Cross-Browser Permission Variability Analysis, go to https://pwa-demo.github.io/plus.
3. Pre-install Actions and post-install tests are detailed in the paper or can be inquired about by contacting the author of this repository. Due to the extensive manual effort required, we do not offer a demo for these tests unless there is significant interest.
4. For PWA and browser cleanup on your mobile devices, visit https://pwa-demo.github.io/cleanup.


## Attack Demo
* Attack 1: Real-world examples are provided in our paper. Due to space constraints, many examples could not be included.
* Attack 2: To view a demo resembling the attack described in our paper, please visit https://pwa-demo.github.io/attack. We have developed a more phishing-like attack but do not offer public access to prevent misuse by malicious attackers, especially since browser vendors have yet to address these issues. However, if you are genuinely interested, please reach out to the author of this repository.
* Attack 3: Real-world examples are discussed in our paper, with many omitted due to space limitations.

## Analysis
* Crawling PWA: The code is located in the analysis/data_collection folder. We have not included our dataset from Common Crawl due to its size. The code in this folder is intended for demonstration; a full analysis requires the use of Docker and multi-threading for efficiency.
* Attack 1 Real-World Examples: The relevant code is in the analysis/attack1_analysis folder. Input your data into final_pwa.txt in the format id, url, e.g., 1, www.google.com, and then run python3 main.py to start the analysis.
* Attack 3 Real-World Examples: Code is in the analysis/attack3_analysis folder. main.py identifies potentially vulnerable PWAs, while main1.py checks for defined keywords within two PWAs. Customization of keywords is supported. Note: This analysis requires manual effort, as some websites may not use English or have differently named checkout and login pages.
* Notes: for the dataset and how to run the code, please contact the author of this repository.


## Disclaimer
* Website content may change or become unavailable, resulting in varying results.
* Please refrain from using social engineering to uncover website owners' identities.
* Do not attempt these attacks in the real world! We disclaim any responsibility for consequences arising from such actions. 
* Details in our paper and this repository are intentionally limited to prevent misuse by malicious individuals.


**For assistance with any of the above steps, please contact the author of this repository.**