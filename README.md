🏋️ IronForge — Gym & Fitness Club Portal

A full-stack Gym Management Portal built with Node.js + Express + MySQL backend and a pure HTML/CSS/JS dark glassmorphism frontend.

📁 Project Structure

gym-portal/
├── backend/
│   ├── server.js       # Express REST API
│   └── db.js           # MySQL2 connection pool
├── frontend/
│   ├── index.html      # All 5 pages (SPA)
│   ├── css/style.css   # Dark glassmorphism theme
│   └── js/app.js       # Fetch-based API calls
├── schema.sql          # Database schema + sample data
├── package.json
└── README.md
⚙️ Setup

1. Database

-- In MySQL Workbench or terminal:
source /path/to/gym-portal/schema.sql
2. Configure DB credentials

Edit backend/db.js:

host: 'localhost',
user: 'root',        // your MySQL username
password: '',        // your MySQL password
database: 'gym_portal'
3. Install & Run

cd gym-portal
npm install
npm start
4. Open in browser

http://localhost:3000
🔌 API Endpoints

Method	Endpoint	Description
GET	/api/members	Get all members
POST	/api/members	Add new member
GET	/api/payments	Get all payments
POST	/api/payments	Record a payment
GET	/api/trainers	Get all trainers
GET	/api/plans	Get membership plans
GET	/api/stats	Dashboard stats
🗃️ Database Tables

Member — member_id, name, age, gender, phone, email, join_date, trainer_id, plan_id
Trainer — trainer_id, name, specialization, phone
MembershipPlan — plan_id, plan_name, duration_months, fee
Payment — payment_id, payment_date, amount, payment_mode, member_id
