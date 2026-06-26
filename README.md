# azentrix-fullstack-task1
Expense Tracker
# Budget Tracker

## Overview

Budget Tracker is a web-based personal finance management application that helps users manage their daily income and expenses. The application provides a simple and user-friendly interface to record transactions, categorize them, monitor financial activities, and view an overall financial summary through a dashboard.

The project is developed using **HTML, CSS, JavaScript** for the frontend, **Flask (Python)** for the backend, and **SQLite** as the database.

---

## Features

* User Registration and Login
* Secure Authentication
* Dashboard with:

  * Total Income
  * Total Expense
  * Current Balance
  * Bar/Pie chart
* Add New Transactions
* Edit Existing Transactions
* Delete Transactions
* Filter Transactions by:

  * Transaction Type
  * Date
  * Amount
* Transaction Pagination
* Responsive User Interface

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Python
* Flask
* Flask-CORS

### Database

* SQLite

---

# Project Structure

```
BudgetTracker/
│
├── backend/
│   ├── app.py
│   ├── budget_tracker.db
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── transactions.html
│
└── README.md
```

---

# Setup Instructions

## 1. Install Python Dependencies

Navigate to the backend folder and install the required packages.

```bash
pip install flask flask-cors
```

---

## 2. Run the Backend

Start the Flask server.

```bash
python app.py
```

The backend will run at:

```
http://127.0.0.1:5000
```

---

## 3. Run the Frontend

Open the frontend using **Live Server** in Visual Studio Code or any local web server.

Example:

```
http://127.0.0.1:5500/frontend/login.html
```

---

## 4. Database

SQLite database (`budget_tracker.db`) is created automatically when the application starts for the first time.

No additional database configuration is required.

---

# Approach

The application follows a simple client-server architecture.

1. Users register with their personal information.
2. Registered users log in using their email and password.
3. After successful login, users are redirected to the dashboard.
4. The dashboard displays total income, total expenses, and available balance with charts.
5. Users can add, edit, and delete financial transactions.
6. Transactions are stored in the SQLite database through Flask REST APIs.
7. Transaction records can be filtered based on transaction type, date, and amount.
8. Pagination is implemented to improve usability when displaying a large number of transactions.
9. The frontend communicates with the backend using JavaScript Fetch API, while Flask processes requests and performs database operations.

---

# API Endpoints

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/api/register`               | Register a new user   |
| POST   | `/api/login`                  | User login            |
| POST   | `/api/transaction`            | Add transaction       |
| GET    | `/api/transactions/<user_id>` | Get user transactions |
| PUT    | `/api/transaction/<id>`       | Update transaction    |
| DELETE | `/api/transaction/<id>`       | Delete transaction    |
| GET    | `/api/dashboard/<user_id>`    | Dashboard summary     |

---

# Screenshots

Include screenshots demonstrating:

* Login Page
* 
* Registration Page
* Dashboard
* Add Transaction
* Transactions List
* Edit Transaction
* Delete Confirmation
* Filter Functionality
* Pagination

---

# Author

**Kavitha Devi**

Budget Tracker Project developed using HTML, CSS, JavaScript, Flask, and SQLite.
