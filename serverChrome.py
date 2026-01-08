from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException
from subprocess import Popen, DEVNULL
from time import sleep, perf_counter
import os, sys, socket

PORT = 8000

def wait_for_port(host, port, timeout=5.0):
    deadline = perf_counter() + timeout
    while perf_counter() < deadline:
        with socket.socket() as s:
            s.settimeout(0.25)
            try:
                s.connect((host, port))
                return True
            except OSError:
                sleep(0.1)
    return False

def make_driver():
    options = Options()
    options.add_experimental_option(
        "excludeSwitches",
        ["enable-automation", "enable-logging"]
    )
    options.add_argument("--guest")
    options.add_argument("start-maximized")
    # options.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

    try:
        return webdriver.Chrome(options=options)
    except WebDriverException as e:
        print("WebDriverException when starting Chrome:", e)
        raise

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    p = Popen([sys.executable, "-m", "http.server", str(PORT)],
              stdout=DEVNULL, stderr=DEVNULL)

    try:
        if not wait_for_port("127.0.0.1", PORT, timeout=5):
            print("HTTP server failed to start on port", PORT)
            return

        driver = make_driver()
        try:
            driver.get(f"http://localhost:{PORT}/main.html")
            while True:
                try:
                    _ = driver.current_url
                    sleep(1)
                except Exception:
                    break
        finally:
            driver.quit()
    finally:
        print("Browser closed! Closing server...")
        p.terminate()

if __name__ == "__main__":
    main()
