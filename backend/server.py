from __future__ import annotations

import json
import os
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

CAFES = [
    {
        "name": "Forestry Coffee Bar",
        "neighborhood": "Kitsilano",
        "rating": 4.9,
        "vibes": ["quiet", "cozy", "focused"],
        "features": ["fast wi-fi", "outlets", "roastery"],
    },
    {
        "name": "Paper Crane Cafe",
        "neighborhood": "Mount Pleasant",
        "rating": 4.7,
        "vibes": ["bright", "airy", "creative"],
        "features": ["natural light", "patio", "pastries"],
    },
    {
        "name": "Harbour Brew",
        "neighborhood": "Coal Harbour",
        "rating": 4.8,
        "vibes": ["scenic", "calm", "modern"],
        "features": ["harbor view", "laptop friendly", "tea bar"],
    },
    {
        "name": "Juniper & Oak",
        "neighborhood": "Gastown",
        "rating": 4.6,
        "vibes": ["moody", "late-night", "industrial"],
        "features": ["late hours", "signature lattes", "communal tables"],
    },
    {
        "name": "Brightside Coffee",
        "neighborhood": "Yaletown",
        "rating": 4.5,
        "vibes": ["minimal", "quiet", "focused"],
        "features": ["noise-rated", "ergonomic seating", "salad bowls"],
    },
    {
        "name": "Fern + Finch",
        "neighborhood": "Commercial Drive",
        "rating": 4.8,
        "vibes": ["nature", "cozy", "warm"],
        "features": ["plant wall", "oat milk", "community board"],
    },
]


class CafeFinderHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def do_GET(self) -> None:
        if self.path.rstrip("/") == "/api/cafes":
            payload = {"cafes": CAFES}
            response = json.dumps(payload).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()
            self.wfile.write(response)
            return

        if self.path in {"/", ""}:
            self.path = "/index.html"

        super().do_GET()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), CafeFinderHandler)
    print(f"CafeFinder server running on http://0.0.0.0:{port}")
    server.serve_forever()
