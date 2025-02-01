# app/routes/routes.py
from flask import Blueprint, request, jsonify
from twilio.rest import Client
from app.extensions import db
from app.models.products_model import Product
from app.models.order_model import Order
from flask import render_template
import os

routes = Blueprint("routes", __name__)
# Inisialisasi Twilio Client
twilio_sid = os.getenv("TWILIO_SID")
twilio_token = os.getenv("TWILIO_TOKEN")
twilio_whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER")
client = Client(twilio_sid, twilio_token)
# -------------------
# Product Routes
# -------------------
@routes.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@routes.route("/cart", methods=["GET"])
def cart():
    return render_template("cart.html")

@routes.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "description": p.description, "image_url": p.image_url} for p in products])

@routes.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({"id": product.id, "name": product.name, "price": product.price, "description": product.description, "image_url": product.image_url})

@routes.route("/products", methods=["POST"])
def create_product():
    data = request.json
    new_product = Product(name=data["name"], price=data["price"], description=data.get("description"), image_url=data.get("image_url"))
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product created successfully", "product": {"id": new_product.id, "name": new_product.name}}), 201

# -------------------
# Order Routes
# -------------------

@routes.route("/orders", methods=["POST"])
def create_order():
    data = request.json
    new_order = Order(
        customer_name=data["customer_name"],
        customer_address=data["customer_address"],
        customer_phone=data["customer_phone"],
        products=str(data["products"]),  # Simpan dalam format JSON string
        total_price=data["total_price"],
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

@routes.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({
        "id": order.id,
        "customer_name": order.customer_name,
        "customer_address": order.customer_address,
        "customer_phone": order.customer_phone,
        "products": order.products,
        "total_price": order.total_price,
        "status": order.status,
    })

@routes.route("/orders/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json
    order.status = data.get("status", order.status)
    db.session.commit()
    return jsonify({"message": "Order status updated", "order_id": order.id, "status": order.status})

@routes.route("/checkout", methods=["POST"])
def checkout():
    data = request.json
    customer_name = data.get("customer_name")
    customer_phone = data.get("customer_phone")
    customer_address = data.get("customer_address")
    products = data.get("products")
    total_price = int(data.get("total_price"))  # Pastikan angka

    new_order = Order(
        customer_name=customer_name,
        customer_address=customer_address,
        customer_phone=customer_phone,
        products=products,
        total_price=total_price,
    )
    db.session.add(new_order)
    db.session.commit()

    message_body = f"Pesanan baru dari {customer_name}:\n\n" \
                   f"Alamat: {customer_address}\n" \
                   f"Produk: {products}\n" \
                   f"Total Harga: Rp{total_price:,}\n" \
                   f"Nomor Telepon: {customer_phone}"

    message = client.messages.create(
        body=message_body,
        from_=twilio_whatsapp_number,
        to=f'whatsapp:{customer_phone}'
    )

    return jsonify({"message": "Pesanan berhasil dikirim!", "message_sid": message.sid}), 201
