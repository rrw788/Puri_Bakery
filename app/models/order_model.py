from app.extensions import db

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_address = db.Column(db.Text, nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    products = db.Column(db.Text, nullable=False)  # JSON format: [{"id":1, "quantity":2}, ...]
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Pending")  # Pending, Completed, Canceled

    def __repr__(self):
        return f"<Order {self.id} - {self.customer_name}>"