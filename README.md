# About

This is a [Reolink E1 Zoom Camera](https://reolink.com/product/e1-zoom/) Playground.

The used [Camera HTTP API is documented by the vendor](reolink-camera-http-api-user-guide.pdf).

This was tested on a E1 Zoom Camera with the `IPC_566SD664M5MP` hardware version.

# Notes

* The Camera does not support [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Glossary/CORS), so it cannot be directly used from a Web Browser (e.g. with the [mpegts.js library](https://github.com/xqq/mpegts.js/blob/master/docs/livestream.md)). Instead we need to use a media proxy like [MediaMTX](https://github.com/bluenviron/mediamtx), like we do in the React web application example bellow.
  * See https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin
  * See https://community.reolink.com/topic/4196/reolink-camera-api-user-guide_v8-updated-in-april-2023/13?post_id=25827
* The Camera supports [RTSP](https://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol) and [FLV](https://en.wikipedia.org/wiki/Flash_Video) (using [HTTP progressive download](https://en.wikipedia.org/wiki/Progressive_download)) streaming.
* To view the Camera streams, we can use `ffplay` as, e.g.:
  * `ffplay rtsp://viewer:viewer@127.0.0.123:554/Preview_01_main`
  * `ffplay rtsp://viewer:viewer@127.0.0.123:554/Preview_01_sub`

# Python CLI Usage (Ubuntu)

Set the Camera URL and credentials:

```bash
cat >.env <<'EOF'
CAMERA_URL="https://192.168.1.123"
CAMERA_USERNAME="admin"
CAMERA_PASSWORD="admin"
EOF
```

Install the dependencies:

```bash
python3 -m pip install -r requirements.txt
```

Run:

```bash
python3 main.py
```

# React Web Application Usage (Ubuntu 22.04)

Install the dependencies:

```bash
wget -qO- \
    https://github.com/bluenviron/mediamtx/releases/download/v1.2.0/mediamtx_v1.2.0_linux_amd64.tar.gz \
    | tar xzf - mediamtx
./mediamtx
```

Run:

```bash
cd react
npm ci
npm run serve
```
