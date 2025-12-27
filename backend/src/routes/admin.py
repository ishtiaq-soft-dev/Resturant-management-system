"""
Admin routes
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import User, Order, Reservation, MenuItem
from datetime import datetime, timedelta
from sqlalchemy import func, extract

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/api/admin/orders", methods=["GET"])
@login_required
def admin_get_orders():
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify(
        [
            {
                "id": o.id,
                "customer": o.customer.username,
                "status": o.status,
                "total": o.total_amount,
                "date": o.created_at.isoformat(),
                "type": o.order_type,
                "payment": o.payment_method,
                "items": [
                    {"name": item.name, "quantity": item.quantity} for item in o.items
                ],
            }
            for o in orders
        ]
    )


@admin_bp.route("/api/admin/orders/<int:order_id>/status", methods=["PATCH"])
@login_required
def update_order_status(order_id):
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    data = request.get_json()
    order = Order.query.get_or_404(order_id)
    order.status = data["status"]
    db.session.commit()
    return jsonify({"message": f"Order status updated to {order.status}"}), 200


@admin_bp.route("/api/admin/reservations", methods=["GET"])
@login_required
def admin_get_reservations():
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    reservations = Reservation.query.order_by(Reservation.reservation_time.desc()).all()
    return jsonify(
        [
            {
                "id": r.id,
                "customer": r.customer.username,
                "party_size": r.party_size,
                "time": r.reservation_time.isoformat(),
                "status": r.status,
                "requests": r.special_requests,
            }
            for r in reservations
        ]
    )


@admin_bp.route("/api/admin/reservations/<int:res_id>/status", methods=["PATCH"])
@login_required
def update_reservation_status(res_id):
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    data = request.get_json()
    res = Reservation.query.get_or_404(res_id)
    res.status = data.get("status", res.status)
    db.session.commit()
    return jsonify({"message": f"Reservation status updated to {res.status}"}), 200


@admin_bp.route("/api/admin/users", methods=["GET"])
@login_required
def get_all_users():
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    users = User.query.all()
    return jsonify(
        [
            {"id": u.id, "username": u.username, "email": u.email, "role": u.role}
            for u in users
        ]
    )


@admin_bp.route("/api/admin/users/<int:user_id>/role", methods=["PATCH"])
@login_required
def update_user_role(user_id):
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.role = data.get("role", "customer")
    db.session.commit()
    return jsonify({"message": "User role updated"})


@admin_bp.route("/api/admin/analytics/sales", methods=["GET"])
@login_required
def get_sales_analytics():
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    period = request.args.get("period", "day")  # day, week, month, year

    now = datetime.utcnow()
    data = []

    if period == "day":
        # Last 30 days
        for i in range(29, -1, -1):
            date = (now - timedelta(days=i)).date()
            start = datetime.combine(date, datetime.min.time())
            end = datetime.combine(date, datetime.max.time())

            daily_sales = (
                db.session.query(func.sum(Order.total_amount))
                .filter(Order.created_at >= start, Order.created_at <= end)
                .scalar()
                or 0
            )

            daily_orders = Order.query.filter(
                Order.created_at >= start, Order.created_at <= end
            ).count()

            data.append(
                {
                    "date": date.isoformat(),
                    "sales": float(daily_sales),
                    "orders": daily_orders,
                    "label": date.strftime("%m/%d"),
                }
            )

    elif period == "week":
        # Last 12 weeks
        for i in range(11, -1, -1):
            week_start = now - timedelta(weeks=i + 1)
            week_start = week_start - timedelta(days=week_start.weekday())
            week_end = week_start + timedelta(days=6)

            weekly_sales = (
                db.session.query(func.sum(Order.total_amount))
                .filter(Order.created_at >= week_start, Order.created_at <= week_end)
                .scalar()
                or 0
            )

            weekly_orders = Order.query.filter(
                Order.created_at >= week_start, Order.created_at <= week_end
            ).count()

            data.append(
                {
                    "date": week_start.date().isoformat(),
                    "sales": float(weekly_sales),
                    "orders": weekly_orders,
                    "label": f"Week {week_start.strftime('%m/%d')}",
                }
            )

    elif period == "month":
        # Last 12 months
        for i in range(11, -1, -1):
            month_start = datetime(now.year, now.month, 1) - timedelta(days=30 * i)
            if month_start.month == 12:
                month_end = datetime(month_start.year + 1, 1, 1) - timedelta(days=1)
            else:
                month_end = datetime(
                    month_start.year, month_start.month + 1, 1
                ) - timedelta(days=1)

            monthly_sales = (
                db.session.query(func.sum(Order.total_amount))
                .filter(Order.created_at >= month_start, Order.created_at <= month_end)
                .scalar()
                or 0
            )

            monthly_orders = Order.query.filter(
                Order.created_at >= month_start, Order.created_at <= month_end
            ).count()

            data.append(
                {
                    "date": month_start.date().isoformat(),
                    "sales": float(monthly_sales),
                    "orders": monthly_orders,
                    "label": month_start.strftime("%b %Y"),
                }
            )

    elif period == "year":
        # Last 5 years
        for i in range(4, -1, -1):
            year_start = datetime(now.year - i, 1, 1)
            year_end = datetime(now.year - i, 12, 31, 23, 59, 59)

            yearly_sales = (
                db.session.query(func.sum(Order.total_amount))
                .filter(Order.created_at >= year_start, Order.created_at <= year_end)
                .scalar()
                or 0
            )

            yearly_orders = Order.query.filter(
                Order.created_at >= year_start, Order.created_at <= year_end
            ).count()

            data.append(
                {
                    "date": year_start.date().isoformat(),
                    "sales": float(yearly_sales),
                    "orders": yearly_orders,
                    "label": str(year_start.year),
                }
            )

    # Calculate totals and averages
    total_sales = sum(d["sales"] for d in data)
    total_orders = sum(d["orders"] for d in data)
    avg_sales = total_sales / len(data) if data else 0
    avg_orders = total_orders / len(data) if data else 0

    return jsonify(
        {
            "period": period,
            "data": data,
            "summary": {
                "total_sales": total_sales,
                "total_orders": total_orders,
                "average_sales": avg_sales,
                "average_orders": avg_orders,
            },
        }
    )


@admin_bp.route("/api/admin/analytics/stats", methods=["GET"])
@login_required
def get_dashboard_stats():
    if current_user.role != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    now = datetime.utcnow()
    today_start = datetime.combine(now.date(), datetime.min.time())
    week_start = now - timedelta(days=7)
    month_start = datetime(now.year, now.month, 1)

    # Today's stats
    today_sales = (
        db.session.query(func.sum(Order.total_amount))
        .filter(Order.created_at >= today_start)
        .scalar()
        or 0
    )
    today_orders = Order.query.filter(Order.created_at >= today_start).count()

    # This week's stats
    week_sales = (
        db.session.query(func.sum(Order.total_amount))
        .filter(Order.created_at >= week_start)
        .scalar()
        or 0
    )
    week_orders = Order.query.filter(Order.created_at >= week_start).count()

    # This month's stats
    month_sales = (
        db.session.query(func.sum(Order.total_amount))
        .filter(Order.created_at >= month_start)
        .scalar()
        or 0
    )
    month_orders = Order.query.filter(Order.created_at >= month_start).count()

    # Total stats
    total_sales = db.session.query(func.sum(Order.total_amount)).scalar() or 0
    total_orders = Order.query.count()
    total_users = User.query.count()
    total_menu_items = MenuItem.query.count()

    # Pending orders
    pending_orders = Order.query.filter_by(status="pending").count()

    return jsonify(
        {
            "today": {"sales": float(today_sales), "orders": today_orders},
            "week": {"sales": float(week_sales), "orders": week_orders},
            "month": {"sales": float(month_sales), "orders": month_orders},
            "total": {
                "sales": float(total_sales),
                "orders": total_orders,
                "users": total_users,
                "menu_items": total_menu_items,
                "pending_orders": pending_orders,
            },
        }
    )
