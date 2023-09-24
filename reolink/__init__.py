import enum
from typing import List
import requests


class IrLightsState(enum.Enum):
    AUTO = 'Auto'
    OFF = 'Off'
    ON = 'On'


class ChannelStatus:
    def __init__(self, channel: int, name: str, online: int, typeInfo: str):
        self.channel = channel
        self.name = name
        self.online = online
        self.typeInfo = typeInfo

    def __str__(self):
        return f"Channel: {self.channel}, Name: {self.name}, Online: {self.online}, Type: {self.typeInfo}"

    def __repr__(self):
        return f"ChannelStatus(channel={self.channel}, name='{self.name}', online={self.online}, typeInfo='{self.typeInfo}')"


class Camera:
    '''NB this was only tested in a Reolink E1 Zoom camera.'''

    def __init__(self, url) -> None:
        self._url = url
        self._token = None

    def login(self, username, password) -> None:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "Login",
            },
            json=[
                {
                    "cmd": "Login",
                    "param": {
                        "User": {
                            "Version": "0",
                            "userName": username,
                            "password": password,
                        }
                    }
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to login. response={r}")
        self._token = r["value"]["Token"]["name"]

    def get_dev_info(self):
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "GetDevInfo",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "GetDevInfo",
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to get dev info. response={r}")
        return r["value"]["DevInfo"]

    def get_dev_name(self) -> str:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "GetDevName",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "GetDevName",
                    "param": {
                        "channel": 0
                    }
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to get dev name. response={r}")
        return r["value"]["DevName"]["name"]

    def set_dev_name(self, name: str) -> None:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "SetDevName",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "SetDevName",
                    "param": {
                        "DevName": {
                            "name": name,
                        }
                    }
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f'failed to set dev name. response={r}')
        if r["value"]["rspCode"] != 200:
            raise Exception(
                f'failed to set dev name. response={r}')

    def get_ir_lights(self) -> IrLightsState:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "GetIrLights",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "GetIrLights",
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to get ir lights. response={r}")
        return r["value"]["IrLights"]["state"]

    def set_ir_lights(self, state: IrLightsState) -> None:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "SetIrLights",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "SetIrLights",
                    "param": {
                        "IrLights": {
                            "channel": 0,
                            "state": state.value,
                        }
                    }
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f'failed to set ir lights. response={r}')
        if r["value"]["rspCode"] != 200:
            raise Exception(
                f'failed to set set ir lights. response={r}')

    def get_power_led(self) -> bool:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "GetPowerLed",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "GetPowerLed",
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to get power led with code {r['code']}")
        return r["value"]["PowerLed"]["state"] == 'On'

    def set_power_led(self, on: bool) -> None:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "SetPowerLed",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "SetPowerLed",
                    "param": {
                        "PowerLed": {
                            "channel": 0,
                            "state": on and "On" or "Off",
                        }
                    }
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f'failed to set power led with code {r["code"]}')
        if r["value"]["rspCode"] != 200:
            raise Exception(
                f'failed to set power led with code {r["value"]["rspCode"]}')

    def get_channel_status(self) -> List[ChannelStatus]:
        response = requests.post(
            verify=False,
            url=f"{self._url}/api.cgi",
            params={
                "cmd": "GetChannelstatus",
                "token": self._token,
            },
            json=[
                {
                    "cmd": "GetChannelstatus",
                }
            ])
        response.raise_for_status()
        r = response.json()[0]
        if r["code"] != 0:
            raise Exception(f"failed to get channel status. response={r}")
        channel_statuses = []
        for item in r["value"]["status"]:
            channel_statuses.append(
                ChannelStatus(
                    channel=item['channel'],
                    name=item['name'],
                    online=item['online'],
                    typeInfo=item['typeInfo']))
        return channel_statuses
