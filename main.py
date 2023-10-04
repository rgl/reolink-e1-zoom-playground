import os
import reolink
import urllib3
from dotenv import load_dotenv


def main():
    urllib3.disable_warnings()

    load_dotenv()

    url = os.environ.get("CAMERA_URL")
    username = os.environ.get("CAMERA_USERNAME")
    password = os.environ.get("CAMERA_PASSWORD")

    if url is None or username is None or password is None:
        raise Exception(
            "Please set the CAMERA_URL, CAMERA_USERNAME and CAMERA_PASSWORD environment variables.")

    camera = reolink.Camera(url)
    camera.login(username, password)

    dev_info = camera.get_dev_info()
    print(f"dev info: {dev_info}")
    print(f"dev name: {dev_info['name']}")
    print(f"dev model: {dev_info['model']}")
    print(f"dev hardware version: {dev_info['hardVer']}")
    print(f"dev firmware version: {dev_info['firmVer']}")

    dev_name = camera.get_dev_name()
    print(f"dev name: {dev_name}")

    ir_lights = camera.get_ir_lights()
    print(f"ir lights: {ir_lights}")

    power_led = camera.get_power_led()
    print(f"power led: {power_led}")

    channel_status = camera.get_channel_status()
    print(f"channel status: {channel_status}")

    rtsp_url = camera.get_rtsp_url()
    print(f"rtsp main stream url: {rtsp_url.main_stream_url}")
    print(f"rtsp sub stream url: {rtsp_url.sub_stream_url}")

    print(f"Setting the dev name...")
    camera.set_dev_name('Test')

    print(f"Turning off the ir lights...")
    camera.set_ir_lights(reolink.IrLightsState.OFF)

    print(f"Turning off the power led...")
    camera.set_power_led(False)


if __name__ == "__main__":
    main()
