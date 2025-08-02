# Common Area Maintenance System

A simple complaint management system with separate user and admin roles, built with Next.js and MongoDB.

## Features

- **User Role**: Submit complaints and view their status
- **Admin Role**: View all complaints and update their status
- **Status Tracking**: Pending → In Progress → Completed
- **MongoDB Storage**: All data stored securely in MongoDB
- **Simple UI**: Clean and easy-to-use interface

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### For Users:
1. Sign up as a "User" or login with existing credentials
2. Submit complaints with title, category, priority, and description
3. View your complaints and their current status

### For Admins:
1. Sign up as an "Admin" or login with admin credentials
2. View all complaints from all users
3. Update complaint status (Pending → In Progress → Completed)
4. See who submitted each complaint

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/complaints` - Get complaints (role-based)
- `POST /api/complaints` - Submit new complaint
- `PUT /api/complaints/[id]` - Update complaint status (admin only)

## Database Schema

### User Model:
- username, email, password, role (user/admin)

### Complaint Model:
- title, description, category, priority, status
- createdBy (user reference), createdAt, updatedAt

## Pages

- `/` - Home page
- `/login` - Login page
- `/signup` - Registration page
- `/complaints` - User complaints page
- `/admin` - Admin dashboard


DEPLOYMENT LINK - https://common-area-maintainence.vercel.app/
