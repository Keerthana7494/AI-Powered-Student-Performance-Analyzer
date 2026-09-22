# Smart Performance Analyzer

Smart Performance Analyzer is a full-stack web application designed to help educators track student performance and identify students who may need additional support.

The application allows users to manage student details, enter academic performance data, calculate an overall performance score, classify students based on their performance, and generate AI-based recommendations.

The project was built to practice and demonstrate real-world application development using **React, Spring Boot, Oracle, PL/SQL, REST APIs, authentication, and AI integration**.

---

## Project Overview

In a normal classroom environment, student performance data is often maintained manually using spreadsheets or separate records.

This can make it difficult to quickly identify:

* Students with low performance
* Students who are at academic risk
* Overall class performance
* Individual performance trends
* Areas where a student needs improvement

Smart Performance Analyzer brings these activities into one application.

A user can add students, enter their attendance and marks, and analyze the performance. The application calculates the performance using predefined business rules and can then generate an AI-based recommendation.

---

## Main Features

### User Authentication

* User signup
* User login
* Secure password storage using BCrypt
* Logout
* Forgot password
* Password reset
* Protected application pages

### Student Management

* Add new students
* View students
* Search students
* Update student information
* Delete students
* Check duplicate email addresses

### Performance Management

The application stores:

* Attendance
* Assignment score
* Test score
* Project score

The overall performance is calculated automatically.

### Performance Classification

Based on the calculated score, students are classified into:

| Score      | Performance Level |
| ---------- | ----------------- |
| 90 - 100   | Excellent         |
| 75 - 89.99 | Good              |
| 60 - 74.99 | Average           |
| Below 60   | Poor              |

### Risk Identification

The application also identifies the student's risk level.

| Score      | Risk Status |
| ---------- | ----------- |
| 75 - 100   | Low         |
| 60 - 74.99 | Medium      |
| Below 60   | High        |

### AI Recommendation

After the performance is calculated, the application can send the structured performance result to an AI service.

The AI service generates a recommendation that can help the educator understand what kind of improvement the student may need.

A rule-based fallback recommendation is also available when the AI service is disabled or unavailable.

### Dashboard

The dashboard provides an overall view of student performance.

It displays information such as:

* Total students
* Average score
* Excellent students
* Good students
* Average students
* Poor students
* High-risk students

Charts are used to make the information easier to understand.

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* Axios
* Recharts
* HTML5
* CSS3

## Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Security
* BCrypt
* JdbcTemplate
* Jakarta Validation
* Maven

## Database

* Oracle Database
* SQL
* PL/SQL
* Stored Procedure
* Database View
* Sequences
* Indexes

## AI

* Hugging Face API
* Rule-based fallback recommendation

---

# System Architecture

```text
                    React Frontend
                         |
                         | HTTP / REST API
                         |
                       Axios
                         |
                         v
                Spring Boot Backend
                         |
              +----------+----------+
              |                     |
              v                     v
        Spring Security          Controllers
              |                     |
              |                     v
              |                  Services
              |                     |
              |          +----------+----------+
              |          |                     |
              |          v                     v
              |       JPA/JDBC             AI Service
              |          |                     |
              |          v                     v
              |       Oracle DB          Hugging Face
              |          |
              |          v
              |       PL/SQL
              |
              v
        Authentication
```

---

# Application Workflow

The main application flow is:

```text
User
  |
  v
Login
  |
  v
Dashboard
  |
  +----> Manage Students
  |
  +----> Add Performance
              |
              v
       Validate Input
              |
              v
      Calculate Performance
              |
              v
        Oracle PL/SQL
              |
              v
       Overall Score
              |
        +-----+------+
        |            |
        v            v
 Performance      Risk Status
   Level
        |
        v
 Save Performance
        |
        v
 AI Recommendation
        |
        v
 Save Recommendation
        |
        v
 Display Result
```

---

# Performance Calculation

The overall score is calculated using a weighted formula.

```text
Overall Score =
(Attendance × 10%)
+ (Assignment × 20%)
+ (Test × 30%)
+ (Project × 40%)
```

For example, assume a student has:

```text
Attendance = 80
Assignment = 70
Test       = 75
Project    = 90
```

Calculation:

```text
80 × 10% = 8
70 × 20% = 14
75 × 30% = 22.5
90 × 40% = 36
```

Therefore:

```text
Overall Score = 8 + 14 + 22.5 + 36

Overall Score = 80.5
```

The student will therefore be classified as:

```text
Performance Level = GOOD
Risk Status       = LOW
```

The calculation is handled using a PL/SQL stored procedure rather than allowing the AI service to calculate the score.

This keeps the important business calculation deterministic and consistent.

---

# AI Recommendation Flow

AI is used after the performance calculation.

The application first calculates the student's actual performance using the defined business rules.

The structured result is then passed to the AI service.


Student Performance
        |
        v
Oracle PL/SQL
        |
        v
Score + Level + Risk
        |
        v
AI Service
        |
        v
Hugging Face API
        |
        v
Recommendation
        |
        v
Store in Database
        |
        v
Display to User


For example, if a student has a low overall score and poor attendance, the AI can generate a recommendation focusing on attendance and the areas with lower scores.

The AI is therefore used for **recommendation generation**, not for the core performance calculation.

---

# AI Fallback

The application does not completely depend on the external AI API.

If:

* AI is disabled
* API token is missing
* Hugging Face is unavailable
* API request fails
* AI response is invalid

the application can generate a rule-based recommendation.

This allows the performance analysis feature to continue working even when the external AI service is not available.

---

# Database Design

The main database tables are:

### USERS

Stores application user account information.


USERS
-----
user_id
name
email
password
created_at
updated_at


### PASSWORD_RESET_TOKEN

Stores password reset information.


PASSWORD_RESET_TOKEN
--------------------
id
user_id
token
expiry_time


### STUDENT

Stores student information.


STUDENT
-------
student_id
student_name
email
course
active
created_at
updated_at


### STUDENT_PERFORMANCE

Stores the performance details of each student.


STUDENT_PERFORMANCE
-------------------
performance_id
student_id
attendance
assignment_score
test_score
project_score
overall_score
performance_level
risk_status
ai_recommendation
created_at
updated_at


### Relationship

One student can have multiple performance records.


STUDENT
   |
   | 1
   |
   | N
   v
STUDENT_PERFORMANCE


This represents a **one-to-many relationship**.

---

# PL/SQL

PL/SQL is used for the performance calculation.

The stored procedure receives the student's performance values and calculates:

* Overall score
* Performance level
* Risk status

The backend calls the procedure using `JdbcTemplate`.

This gives the project an example of integrating **Spring Boot with Oracle PL/SQL business logic**.

---

# Backend Architecture

The backend follows a layered structure.


Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Oracle Database


### Controller

Handles HTTP requests and responses.

Examples:


StudentController
PerformanceController
AuthController


### Service

Contains the application/business logic.

Examples:


StudentService
PerformanceService
AuthService
AIService


### Repository

Handles database operations using Spring Data JPA.

Examples:

StudentRepository
PerformanceRepository


### DTO

DTOs are used to control the data transferred between the frontend and backend.

Examples:


StudentRequest
StudentResponse
PerformanceRequest
PerformanceResponse
DashboardResponse
ApiError


---

# Security

Spring Security is used to protect the application APIs.

The application includes:

* Password hashing using BCrypt
* Stateless authentication
* Bearer token authentication
* Protected REST endpoints
* Public authentication endpoints
* Request validation
* CORS configuration

Passwords are never stored as plain text.

The authentication token used by this project is a custom HMAC-SHA256 signed bearer token.

---

# Validation and Exception Handling

The backend validates incoming requests before processing them.

For example:

* Required fields
* Valid email format
* Score range
* Duplicate student email
* Student existence

The application also uses centralized exception handling.

Main custom exceptions include:

BadRequestException
DuplicateResourceException
ResourceNotFoundException


A global exception handler converts these exceptions into structured API responses.

---

# REST API

The backend exposes REST APIs for authentication, students, performance and dashboard operations.

### Authentication

| Method | Endpoint                    | Purpose                |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/signup`          | Create user account    |
| POST   | `/api/auth/login`           | Login                  |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password         |

### Students

| Method | Endpoint             | Purpose        |
| ------ | -------------------- | -------------- |
| GET    | `/api/students`      | Get students   |
| GET    | `/api/students/{id}` | Get student    |
| POST   | `/api/students`      | Add student    |
| PUT    | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

### Performance

| Method | Endpoint                     | Purpose                  |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/api/performance`           | Get performance records  |
| GET    | `/api/performance/{id}`      | Get performance details  |
| POST   | `/api/performance`           | Add performance          |
| DELETE | `/api/performance/{id}`      | Delete performance       |
| GET    | `/api/performance/dashboard` | Get dashboard statistics |

> The exact endpoint paths should be checked against the current controller implementation before publishing this README.

---

# Project Structure


smart-performance-analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/smartperformance/
│   │       │       ├── auth/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── exception/
│   │       │       ├── repository/
│   │       │       └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── .env.example
│   └── pom.xml
│
├── database/
│   ├── 01_tables.sql
│   ├── 02_sequences_indexes.sql
│   ├── 03_procedure.sql
│   ├── 04_view.sql
│   ├── 05_sample_data.sql
│   └── 06_validation_queries.sql
│
├── screenshots/
│
├── .gitignore
├── README.md
└── LICENSE


---

# How to Run the Project

## Prerequisites

Install the following before running the project:

* Java 17
* Maven
* Node.js
* npm
* Oracle Database
* Git

---

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Move into the project:

```bash
cd smart-performance-analyzer
```

---

## 2. Configure Oracle Database

Create the required database objects using the SQL scripts inside the `database` folder.

Run the scripts in the required order:

01_tables.sql
02_sequences_indexes.sql
03_procedure.sql
04_view.sql
05_sample_data.sql


---

## 3. Configure Backend

Create a local environment configuration using the example configuration.

Example:

DB_URL=your_oracle_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

HF_API_TOKEN=your_huggingface_token

AUTH_SECRET=your_secret_key


Do not commit actual passwords, API tokens or secret keys to GitHub.

---

## 4. Start the Backend

Open the backend folder:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

The backend will start on the configured port.

---

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown by Vite in the terminal.

---

# Configuration

The frontend uses an environment variable for the backend URL.

Example:

VITE_API_BASE_URL=http://localhost:8081/api


The backend contains configuration for:

* Oracle database
* Authentication
* AI service
* Application port

Environment files containing real credentials should not be pushed to GitHub.

---

# Screenshots

Screenshots of the application will be added here.

## Landing Page

![Landing Page](Output_Screenshots/1-LandingPage.png)

## SignUp

![SignUp](Output_Screenshots/2-SignUp.png)

## Login

![Login](Output_Screenshots/3-Login.png)

## ForgotPassword

![ForgotPassword](Output_Screenshots/4-ForgotPassword.png)

## CreateNewPassword

![CreateNewPassword](Output_Screenshots/5-CreateNewPassword.png)

## ResetPassword

![ResetPassword](Output_Screenshots/6-ResetPassword.png)

## Authenticated

![Authenticated](Output_Screenshots/7-Authentication.png)

## Dashboard

![Dashboard](Output_Screenshots/8-Dashboard.png)

## Student Management

![Student Management](Output_Screenshots/9-AddStudents.png)

## Student List

![Student List](Output_Screenshots/StudentList.png)

## Add Performance

![Add Performance](Output_Screenshots/10-AddPerformance.png)


## AI Recommendation

![AI Recommendation](Output_Screenshots/11-AI_Recommendation.png)

## Logout

![Logout](Output_Screenshots/12-Logout.png)



---

# What I Learned From This Project

This project helped me work with different parts of a real-world full-stack application instead of focusing on only one technology.

Some of the main areas I worked with are:

* Building REST APIs using Spring Boot
* Designing controller, service and repository layers
* Using Spring Data JPA with Oracle
* Calling PL/SQL from Java
* Implementing authentication and password security
* Working with DTOs and request validation
* Handling exceptions globally
* Connecting React with REST APIs using Axios
* Creating dashboard charts
* Integrating an external AI API
* Designing an AI fallback mechanism
* Managing environment variables and application configuration

---

# Current Limitations

This project is currently designed as a portfolio and learning project.

Some areas can be improved further for a production deployment:

* Password reset can be connected to an actual email service.
* Authentication can be migrated to a standard JWT/OAuth2 implementation.
* More detailed student performance history can be added.
* Role-based access can be introduced for Admin, Trainer and Faculty users.
* More advanced analytics can be added to the dashboard.
* Automated testing can be expanded.
* The application can be containerized using Docker.
* Deployment can be added using a cloud platform.

---

# Future Enhancements

Some features planned for future versions include:

* Student performance trend analysis
* More detailed analytics
* Faculty/Admin roles
* Email notifications
* Automated monthly performance reports
* PDF report generation
* Export to Excel
* Attendance trend analysis
* Improved AI recommendations
* Docker deployment
* Cloud deployment

---

# Project Highlights

The main technical areas demonstrated by this project are:


React
   +
Spring Boot
   +
REST API
   +
Spring Security
   +
Spring Data JPA
   +
Oracle
   +
PL/SQL
   +
AI API Integration


One of the important parts of the project is the separation between **business calculation and AI processing**.

The application first uses predefined business rules and PL/SQL to calculate the actual performance. AI is then used to generate a more meaningful recommendation based on the calculated result.

---

# Author

Keerthana D

Software Trainer | AI & Software Mentor

Interested in Java Backend Development, Full-Stack Development and AI-based applications.

---

# License

This project is created for learning, portfolio and demonstration purposes.
