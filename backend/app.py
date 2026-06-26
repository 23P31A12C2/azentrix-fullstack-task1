from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

CORS(app)

DATABASE = "budget_tracker.db"


# -----------------------------
# DATABASE CONNECTION
# -----------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# -----------------------------
# CREATE TABLES
# -----------------------------
def create_tables():

    conn = get_db()

    # USERS TABLE
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,

        email TEXT UNIQUE NOT NULL,

        password TEXT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # TRANSACTIONS TABLE
    conn.execute("""
    CREATE TABLE IF NOT EXISTS transactions (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER NOT NULL,

        transaction_type TEXT NOT NULL,

        title TEXT NOT NULL,

        category TEXT NOT NULL,

        amount REAL NOT NULL,

        transaction_date TEXT NOT NULL,

        payment_method TEXT,

        merchant TEXT,

        description TEXT,

        reference_number TEXT,

        status TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(user_id)
        REFERENCES users(id)
    )
    """)

    conn.commit()
    conn.close()


# -----------------------------
# REGISTER USER
# -----------------------------
@app.route('/api/register', methods=['POST'])
def register():

    try:

        data = request.json

        conn = get_db()
        cursor = conn.cursor()

        # CHECK EMAIL EXISTS

        cursor.execute(
            "SELECT * FROM users WHERE email=?",
            (data['email'],)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email already exists"
            }), 400

        cursor.execute(
            """
            INSERT INTO users
            (
                first_name,
                last_name,
                email,
                password
            )
            VALUES (?,?,?,?)
            """,
            (
                data['first_name'],
                data['last_name'],
                data['email'],
                data['password']
            )
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "User Registered Successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        conn.close()


# -----------------------------
# LOGIN
# -----------------------------
@app.route('/api/login', methods=['POST'])
def login():

    try:

        data = request.json

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email=?
            AND password=?
            """,
            (
                data['email'],
                data['password']
            )
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid Email or Password"
            }), 401

        return jsonify({
            "success": True,
            "user": {
                "id": user["id"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"]
            }
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        conn.close()


# -----------------------------
# CREATE TRANSACTION
# -----------------------------
@app.route('/api/transaction', methods=['POST'])
def create_transaction():

    try:

        data = request.json

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO transactions
            (
                user_id,
                transaction_type,
                title,
                category,
                amount,
                transaction_date,
                payment_method,
                merchant,
                description,
                reference_number,
                status
            )
            VALUES
            (
                ?,?,?,?,?,?,?,?,?,?,?
            )
            """,
            (
                data['user_id'],
                data['transaction_type'],
                data['title'],
                data['category'],
                data['amount'],
                data['transaction_date'],
                data.get('payment_method'),
                data.get('merchant'),
                data.get('description'),
                data.get('reference_number'),
                data.get('status')
            )
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Transaction Added"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        conn.close()


# -----------------------------
# UPDATE TRANSACTION
# -----------------------------
@app.route('/api/transaction/<int:id>', methods=['PUT'])
def update_transaction(id):

    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE transactions
        SET

        transaction_type=?,
        title=?,
        category=?,
        amount=?,
        transaction_date=?,
        payment_method=?,
        merchant=?,
        description=?,
        reference_number=?,
        status=?

        WHERE id=?
        """,
        (
            data['transaction_type'],
            data['title'],
            data['category'],
            data['amount'],
            data['transaction_date'],
            data.get('payment_method'),
            data.get('merchant'),
            data.get('description'),
            data.get('reference_number'),
            data.get('status'),
            id
        )
    )

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Updated Successfully"
    })


# -----------------------------
# DELETE TRANSACTION
# -----------------------------
@app.route('/api/transaction/<int:id>', methods=['DELETE'])
def delete_transaction(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM transactions WHERE id=?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Deleted Successfully"
    })


# -----------------------------
# GET TRANSACTIONS
# -----------------------------
@app.route('/api/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id):

    conn = get_db()

    rows = conn.execute(
        """
        SELECT *
        FROM transactions
        WHERE user_id=?
        ORDER BY transaction_date DESC
        """,
        (user_id,)
    ).fetchall()

    conn.close()

    return jsonify(
        [dict(row) for row in rows]
    )


# -----------------------------
# DASHBOARD SUMMARY
# -----------------------------
@app.route('/api/dashboard/<int:user_id>')
def dashboard(user_id):

    conn = get_db()

    income = conn.execute(
        """
        SELECT SUM(amount)
        FROM transactions
        WHERE user_id=?
        AND transaction_type='INCOME'
        """,
        (user_id,)
    ).fetchone()[0]

    expense = conn.execute(
        """
        SELECT SUM(amount)
        FROM transactions
        WHERE user_id=?
        AND transaction_type='EXPENSE'
        """,
        (user_id,)
    ).fetchone()[0]

    income = income or 0
    expense = expense or 0

    return jsonify({
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense
    })


# -----------------------------
# START APPLICATION
# -----------------------------
create_tables()

if __name__ == "__main__":
    app.run(debug=True)