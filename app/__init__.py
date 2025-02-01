from flask import Flask
from app.config import Config
from app.extensions import db, migrate
from app.routes.routes import routes

def create_app():
    app = Flask(__name__, static_folder="static")
    app.config.from_object(Config)

    # Inisialisasi database dan migrasi
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprint
    app.register_blueprint(routes)

    return app