# PartnerGrid - Vendor & Society Onboarding System

A MERN stack application (MySQL + Express + React + Node.js) for managing vendor and society onboarding.

## Project Structure

```
.
├── server/                 # Backend (Express + MySQL)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.jsx
│   └── package.json
└── schema.sql             # Database schema

```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=partnergrid
DB_PORT=3306
PORT=5001
NODE_ENV=development
```

4. Create the database and run the schema:
```bash
mysql -u root -p
CREATE DATABASE partnergrid;
USE partnergrid;
SOURCE schema.sql;
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Vendor Users
- `GET /api/vendor-users` - Get all vendor users (optional query: `?vendor_id=1`)
- `GET /api/vendor-users/:id` - Get vendor user by ID
- `POST /api/vendor-users` - Create new vendor user
- `PUT /api/vendor-users/:id` - Update vendor user
- `DELETE /api/vendor-users/:id` - Delete vendor user

### Societies
- `GET /api/societies` - Get all societies
- `GET /api/societies/:id` - Get society by ID
- `POST /api/societies` - Create new society
- `PUT /api/societies/:id` - Update society
- `DELETE /api/societies/:id` - Delete society

### Society Users
- `GET /api/society-users` - Get all society users (optional query: `?society_id=1`)
- `GET /api/society-users/:id` - Get society user by ID
- `POST /api/society-users` - Create new society user
- `PUT /api/society-users/:id` - Update society user
- `DELETE /api/society-users/:id` - Delete society user

## Features

- ✅ Full CRUD operations for Vendors
- ✅ Full CRUD operations for Vendor Users
- ✅ Full CRUD operations for Societies
- ✅ Full CRUD operations for Society Users
- ✅ Clean, responsive UI with plain CSS
- ✅ Form validation
- ✅ Error handling
- ✅ MySQL database integration
- ✅ RESTful API design

## Notes

- The application uses plain CSS for styling. You can easily switch to Tailwind CSS or Material UI if needed.
- Passwords are hashed using bcryptjs before storing in the database.
- The frontend uses Vite for fast development and building.

## Development

- Backend runs on port 5000
- Frontend runs on port 3000 (proxied to backend)
- Make sure MySQL is running before starting the backend server




# Qapla-IT
