from flask import Flask
from .config import Config  # Gunakan relative import
from .extensions import db, migrate
from .routes.routes import routes

def create_app():
    app = Flask(__name__, static_folder="static")
    app.config.from_object(Config)

    # Inisialisasi database dan migrasi
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprint
    app.register_blueprint(routes)

    return app
