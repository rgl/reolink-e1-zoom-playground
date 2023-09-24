# About

This is a [Reolink E1 Zoom Camera](https://reolink.com/product/e1-zoom/) Playground.

The used [Camera HTTP API is documented by the vendor](reolink-camera-http-api-user-guide.pdf).

This was tested on a E1 Zoom Camera with the `IPC_566SD664M5MP` hardware version.

# Usage (Ubuntu)

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
