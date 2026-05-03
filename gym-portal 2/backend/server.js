const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// GET all members with trainer and plan info
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, t.name AS trainer_name, p.plan_name, p.fee
      FROM Member m
      LEFT JOIN Trainer t ON m.trainer_id = t.trainer_id
      LEFT JOIN MembershipPlan p ON m.plan_id = p.plan_id
      ORDER BY m.member_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add member
app.post('/api/members', async (req, res) => {
  const { name, age, gender, phone, email, join_date, trainer_id, plan_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Member (name, age, gender, phone, email, join_date, trainer_id, plan_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, age, gender, phone, email, join_date, trainer_id || null, plan_id || null]
    );
    res.json({ success: true, member_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all payments
app.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, m.name AS member_name
      FROM Payment p
      LEFT JOIN Member m ON p.member_id = m.member_id
      ORDER BY p.payment_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add payment
app.post('/api/payments', async (req, res) => {
  const { payment_date, amount, payment_mode, member_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Payment (payment_date, amount, payment_mode, member_id) VALUES (?, ?, ?, ?)',
      [payment_date, amount, payment_mode, member_id]
    );
    res.json({ success: true, payment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET trainers and plans for dropdowns
app.get('/api/trainers', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Trainer');
  res.json(rows);
});

app.get('/api/plans', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM MembershipPlan');
  res.json(rows);
});

// GET dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const [[{ total_members }]] = await db.query('SELECT COUNT(*) AS total_members FROM Member');
    const [[{ total_revenue }]] = await db.query('SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM Payment');
    const [[{ total_trainers }]] = await db.query('SELECT COUNT(*) AS total_trainers FROM Trainer');
    const [[{ payments_today }]] = await db.query("SELECT COUNT(*) AS payments_today FROM Payment WHERE DATE(payment_date) = CURDATE()");
    res.json({ total_members, total_revenue, total_trainers, payments_today });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Gym Portal running on http://localhost:3000'));
