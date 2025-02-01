# app.py
from flask import Flask
from app.config import Config
from app.extensions import db, migrate
from app.routes.routes import routes  # Perbaiki import ini
from app import create_app

app = create_app()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Inisialisasi database dan migrasi
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprint
    app.register_blueprint(routes)  # Perbaiki ini
    
    return app

if __name__ == "__main__":
    app.run(debug=True)