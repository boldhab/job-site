# Ethio-Career (Job Portal Application)

Ethio-Career is a modern, full-stack job portal application built with **Spring Boot** (Backend) and **React** (Frontend). This comprehensive platform enables Job Seekers to manage their CVs and apply for jobs, Employers to post jobs and manage applications, and Admins to oversee the entire platform. The application features AI-powered assistance using Google Gemini for enhanced user experience.

---



## 🌟 Key Features

### For Job Seekers
- ✅ Create and manage professional profiles
- 🔍 Search and filter job listings by title, location, and category
- 📄 Upload and manage multiple CVs
- 📊 Track application status in real-time
- 🤖 **AI Match Score** - See how well you match each job posting
- 💡 **AI Profile Analyzer** - Get personalized improvement suggestions

### For Employers
- 📝 Post and manage job listings
- 👥 Review and rank applicants
- 💬 Communicate with candidates
- ⏰ Set application deadlines
- 🤖 **AI Job Description Generator** - Create professional job posts instantly

### For Admins
- ✔️ Approve employer registrations
- 🛡️ Manage and moderate job postings
- 📈 View platform analytics and statistics
- 👤 Manage user accounts

---




## 🔧 Installation Guide

### 1. Java JDK 17 Installation

### 2. Node.js Installation

### 3. MySQL Server Installation


## 🗄️ Database Setup

### Step 1: Start MySQL Server

### Step 2: Create Database

```sql
-- Create the database
CREATE DATABASE job_portal_db;

```

### Step 3: Database Configuration

The application is configured to use:
- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `job_portal_db`
- **Username**: `root`
- **Password**: *(empty by default)*

---

## ⚙️ Project Configuration

### Backend Configuration

1. Navigate to: `jobsite back end/src/main/resources/application.properties`

2. **Database Configuration** (already set):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/job_portal_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   ```

3. **AI Features Configuration** (Optional):
   ```properties
   # Replace with your own Gemini API key
   gemini.api.key=YOUR_GEMINI_API_KEY_HERE
   ```
   
   To get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy and paste into `application.properties`

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:8080/api`. No additional configuration is needed.

If you need to change the backend URL, edit: `jobsite front end/src/config/api.config.js`

---

## 🚀 How to Run the Project

### Step 1: Start the Backend
   
   **Windows:**
   ```bash
   mvnw.cmd spring-boot:run
   ```

4. **Wait for the application to start**. You should see:
   ```
   Started JobsiteApplication in  seconds
   ```

5. **Backend is now running on**: `http://localhost:8080/api`

> **Note**: The first run will take longer as Maven downloads dependencies and Hibernate creates database tables.

---

### Step 2: Start the Frontend

1. **Open a NEW terminal/command prompt** (keep backend running)

2. **Navigate to frontend directory**:
   ```bash
   cd "jobsite front end"
   ```

3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Frontend is now running on**: `http://localhost:5173`

---

## 🌐 Accessing the Application

### Main Application URLs


| **Frontend** | http://localhost:5173 | Main user interface |
| **Backend API** | http://localhost:8080/api | REST API endpoints |


### User Dashboards

After logging in, users are redirected based on their role:

| **Job Seeker** | http://localhost:5173/jobseeker/dashboard | Job search, applications, CV management |
| **Employer** | http://localhost:5173/employer/dashboard | Post jobs, manage applications |
| **Admin** | http://localhost:5173/admin/dashboard | Platform management, approvals |

---

## 👤 Default User Accounts

### Creating User Accounts

The application **does not have pre-seeded users**. You must create accounts through the registration process.

### Registration Steps

1. **Open the application**: http://localhost:5173

2. **Click "Sign Up"** on the landing page

3. **Choose your role**:
   - **Job Seeker**: For candidates looking for jobs
   - **Employer**: For companies posting jobs

4. **Fill in the registration form**:
   - Email address
   - Password (minimum 6 characters)
   - Additional profile information

5. **Click "Register"**

6. **Login** with your credentials



### Creating an Admin Account

Admin accounts cannot be created through the UI. Follow these steps:

1. **First, register a regular user account** (Job Seeker or Employer)

2. **Open MySQL command line**:
   ```bash
   mysql -u root -p job_portal_db
   ```

3. **Find your user**:
   ```sql
   SELECT id, email, role FROM users;
   ```

4. **Promote user to admin**:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

5. **Verify the change**:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
   ```

6. **Exit MySQL**:
   ```sql
   EXIT;
   ```

7. **Login** with the same credentials and access `/admin/dashboard`

---

## 🤖 AI Features

The application includes several AI-powered features using Google Gemini:

### Available AI Features

1. **AI Chatbot**
   - Click the floating chat bubble icon on any page
   - Ask questions about jobs, career advice, or platform usage
   - Available to all authenticated users

2. **AI Job Description Generator** (Employers)
   - Navigate to "Post Job" page
   - Click "AI Suggest" button
   - Enter job title and basic requirements
   - AI generates a professional job description

3. **AI Profile Analyzer** (Job Seekers)
   - Go to your profile page
   - Click "Analyze My Profile"
   - Receive personalized improvement suggestions
   - Get tips on skills, experience, and presentation

4. **AI Match Score** (Job Seekers)
   - Automatically displayed on job cards
   - Shows percentage match between your profile and job requirements
   - Helps prioritize job applications



## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

#### Jobs (`/jobs`)
- `GET /jobs` - List all jobs (with filters)
- `GET /jobs/{id}` - Get job details
- `POST /jobs` - Create job (Employer only)
- `PUT /jobs/{id}` - Update job (Employer only)
- `DELETE /jobs/{id}` - Delete job (Employer/Admin)

#### Applications (`/applications`)
- `GET /applications` - List user's applications
- `POST /applications` - Apply for a job
- `PUT /applications/{id}` - Update application status
- `DELETE /applications/{id}` - Withdraw application

#### Profile (`/profile`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/avatar` - Upload profile picture

#### AI Features (`/ai`)
- `POST /ai/chat` - Chat with AI assistant
- `POST /ai/generate-job-description` - Generate job description
- `POST /ai/analyze-profile` - Analyze user profile
- `POST /ai/match-score` - Calculate job match score

#### Admin (`/admin`)
- `GET /admin/employers/pending` - Get pending employer approvals
- `PUT /admin/employers/{id}/approve` - Approve employer
- `PUT /admin/employers/{id}/reject` - Reject employer
- `GET /admin/stats` - Get platform statistics

### Swagger UI
If enabled, access interactive API documentation at:
```
http://localhost:8080/api/swagger-ui/index.html
```

---

## 🛠️ Technologies Used

### Backend Stack
- **Spring Boot** 3.5.8 - Application framework
- **Spring Security** - JWT authentication & authorization
- **Spring Data JPA** - Database access layer
- **Hibernate** - ORM framework
- **MySQL** 8.0 - Relational database
- **Lombok** - Reduce boilerplate code
- **JJWT** 0.11.5 - JWT token handling
- **RestTemplate** - HTTP client for Gemini API
- **Commons IO** 2.16.1 - File upload support

### Frontend Stack
- **React** 19.2.0 - UI library
- **React Router** v6.16.0 - Client-side routing
- **Axios** 1.13.2 - HTTP client
- **Tailwind CSS** 4.1.18 - Utility-first CSS framework
- **Heroicons** 2.2.0 - Icon library
- **React Hot Toast** 2.6.0 - Toast notifications
- **Vite** 7.2.4 - Build tool and dev server

### AI Integration
- **Google Gemini API** (v1)
- **Model**: gemini-2.5-flash
- **Features**: Text generation, content analysis, conversational AI

### Development Tools
- **Maven** - Backend dependency management
- **npm** - Frontend package management
- **ESLint** - JavaScript linting
- **Spring Boot DevTools** - Hot reload for backend

---



### Getting Help

If you encounter issues not covered here:

1. **Check Backend Logs**: Look for error messages in the terminal running the backend
2. **Check Browser Console**: Press F12 and look for errors in the Console tab
3. **Check Database**: Verify tables were created: `SHOW TABLES;` in MySQL
4. **Review Configuration**: Double-check `application.properties` and database settings

---

## 📝 Additional 


This project is ready to run out of the box. Simply:

1. ✅ Install Java 17, Node.js 18, and MySQL 8.0
2. ✅ Create the `job_portal_db` database
3. ✅ Run backend: `mvnw.cmd spring-boot:run`
4. ✅ Run frontend: `npm install && npm run dev`
5. ✅ Access: http://localhost:5173

**No additional configuration required** for basic functionality!


## 📝 Developers


1.  Habtamu Befekadu………


**Built with ❤️ for Ethiopian Professionals**

*developed : December 2025*
