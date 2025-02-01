# app/config.py
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'Panzer5')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///puribakery.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False