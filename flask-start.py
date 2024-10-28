from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template
import os

load_dotenv(find_dotenv())

PATH_SSL_CRT = os.environ.get("PATH_SSL_CRT")
PATH_SSL_KEY = os.environ.get("PATH_SSL_KEY")

PORT = 80  # TODO: get this from env
app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", app_data="{}")


if __name__ == "__main__":
    context = None
    if PATH_SSL_CRT and PATH_SSL_KEY:
        print("🌈🔐 ssl_context")
        context = (PATH_SSL_CRT, PATH_SSL_KEY)
    app.run(host="0.0.0.0", port=PORT, debug=False, ssl_context=context)
