CREATE DATABASE IF NOT EXISTS gym_portal;
USE gym_portal;

CREATE TABLE IF NOT EXISTS Trainer (
  trainer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS MembershipPlan (
  plan_id INT AUTO_INCREMENT PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  duration_months INT,
  fee DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS Member (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  gender ENUM('Male','Female','Other'),
  phone VARCHAR(15),
  email VARCHAR(100),
  join_date DATE,
  trainer_id INT,
  plan_id INT,
  FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id) REFERENCES MembershipPlan(plan_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode ENUM('Cash','Card','UPI','Bank Transfer') NOT NULL,
  member_id INT,
  FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO Trainer (name, specialization, phone) VALUES
('Arjun Mehta', 'Strength & Conditioning', '9876543210'),
('Priya Sharma', 'Yoga & Flexibility', '9876543211'),
('Rohan Das', 'Cardio & HIIT', '9876543212');

INSERT INTO MembershipPlan (plan_name, duration_months, fee) VALUES
('Basic Monthly', 1, 999.00),
('Standard Quarterly', 3, 2499.00),
('Premium Half-Year', 6, 4499.00),
('Elite Annual', 12, 7999.00);

INSERT INTO Member (name, age, gender, phone, email, join_date, trainer_id, plan_id) VALUES
('Vikram Singh', 28, 'Male', '9123456789', 'vikram@email.com', '2024-01-15', 1, 3),
('Ananya Patel', 24, 'Female', '9123456790', 'ananya@email.com', '2024-02-01', 2, 2),
('Karan Joshi', 32, 'Male', '9123456791', 'karan@email.com', '2024-01-20', 3, 4);

INSERT INTO Payment (payment_date, amount, payment_mode, member_id) VALUES
('2024-01-15', 4499.00, 'UPI', 1),
('2024-02-01', 2499.00, 'Card', 2),
('2024-01-20', 7999.00, 'Bank Transfer', 3);
