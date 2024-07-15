import requests


def check_iframe_support(url):
    try:
        response = requests.get(url)
        headers = response.headers

        # 检查 X-Frame-Options 头
        x_frame_options = headers.get("X-Frame-Options")
        content_security_policy = headers.get("Content-Security-Policy")

        if x_frame_options:
            if "DENY" in x_frame_options or "SAMEORIGIN" in x_frame_options:
                return False

        if content_security_policy:
            if "frame-ancestors" in content_security_policy:
                if (
                    "none" in content_security_policy
                    or "self" in content_security_policy
                ):
                    return False

        return True
    except requests.exceptions.RequestException as e:
        print(f"Error checking {url}: {e}")
        return False


# 测试一些网站
websites = ["https://boa.com"]

for website in websites:
    is_supported = check_iframe_support(website)
    print(
        f"Can {website} be embedded in an iframe on any domain? {'Yes' if is_supported else 'No'}"
    )
