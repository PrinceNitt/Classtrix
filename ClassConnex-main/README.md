# 🎓 ClassConneX

**ClassConneX** is a comprehensive socio-academic portal designed for university students to access college-related information, study materials, and manage academic activities—all in one place. The platform streamlines communication between students and administrators while providing easy access to notes, assignments, notices, club events, and timetables.

---

## ✨ Features

### 👨‍🎓 For Students
- 📝 **Assignment Management** - View and download assignments for your semester
- 📚 **Notes & Study Materials** - Access department-wise notes (CSE, ECE, EEE)
- 📢 **Notice Board** - Stay updated with important announcements
- 🎯 **Club Events** - Discover and participate in club activities
- 📅 **Timetable** - Check your class schedule anytime
- 📄 **Previous Year Papers** - Download past exam papers by department and semester

### 👨‍💼 For Admins (CR - Class Representatives)
- ➕ **Student Management** - Add and manage student records
- 📤 **Upload Assignments** - Post assignments for specific semesters
- 📣 **Post Notices** - Broadcast important updates to all students
- 🎪 **Manage Club Events** - Create and organize club activities
- 🕒 **Timetable Management** - Update and maintain class schedules
- 📊 **Dashboard Analytics** - View total users and assignments

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling |
| **Handlebars (hbs)** | Templating engine for dynamic HTML |
| **bcryptjs** | Password hashing and authentication |
| **express-session** | Session management |
| **Multer** | File upload handling |
| **express-rate-limit** | API rate limiting |

---

## 📁 Project Structure

```
ClassConnex-main/
├── src/
│   ├── app.js              # Main application entry point
│   ├── db/
│   │   └── db.js           # MongoDB connection configuration
│   └── models/
│       ├── registers.js    # User registration model
│       ├── task.js         # Assignment model
│       ├── notices.js      # Notice model
│       ├── clubevent.js    # Club event model
│       ├── timetable.js    # Timetable model
│       ├── papers.js       # Previous year papers model
│       ├── note1.js        # Notes model
│       └── semesters.js    # Semester model
├── templates/
│   └── views/
│       ├── index.hbs       # Login page
│       ├── register.hbs    # Student registration
│       ├── home.hbs        # Student home page
│       ├── stuhome.hbs     # Semester-specific student page
│       ├── stuassing.hbs   # Assignments page
│       ├── stunotice.hbs   # Notices page
│       ├── stuclub.hbs     # Club events page
│       ├── stutimetabl.hbs # Timetable page
│       ├── notes.hbs       # Department selection for notes
│       ├── paper.hbs       # Department selection for papers
│       ├── adminlogin.hbs  # Admin login page
│       ├── adminportal.hbs # Admin dashboard
│       ├── addstu.hbs      # Add student form
│       ├── assingment.hbs  # Upload assignment form
│       ├── notice.hbs      # Post notice form
│       ├── club.hbs        # Create club event form
│       └── timetable.hbs   # Upload timetable form
├── public/
│   ├── css/
│   │   ├── style.css       # Global styles
│   │   └── bg1.png         # Background image
│   └── images/             # Static images
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download Here](https://nodejs.org/)
- **MongoDB** - [Download Here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud)
- **Git** - [Download Here](https://git-scm.com/)

---

### 📥 Installation

Follow these steps to set up the project locally:

#### 1. Clone the Repository
```bash
git clone https://github.com/PrinceNitt/Classtrix.git
cd Class_Connex-main/ClassConnex-main
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure MongoDB Connection

Open `src/db/db.js` and update the MongoDB connection string:

```javascript
mongoose.connect("your-mongodb-connection-string", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

**Using MongoDB Atlas (Cloud):**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/classconnex`)
- Replace the connection string in `db.js`

**Using Local MongoDB:**
```javascript
mongoose.connect("mongodb://localhost:27017/classconnex");
```

#### 4. Start the Application

**Development Mode** (with auto-restart on file changes):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

#### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📖 How to Use

### 🔐 For Students

#### First Time Setup:
1. **Register** - Go to `http://localhost:3000` and click on **Register**
2. Fill in your details:
   - Username
   - Email
   - Password
   - Department (CSE/ECE/EEE)
   - Semester (1-8)
   - Check **"I am CR"** if you're a Class Representative
3. Click **Register** to create your account

#### Login & Navigation:
1. **Login** with your email and password
2. From the **Home** page, access:
   - **Papers** - Browse and download previous year papers by department
   - **Notes** - Access study materials by department
   - **Assignments** - View assignments for your semester
   - **Notices** - Read important announcements
   - **Clubs** - Explore club events
   - **Timetable** - Check your class schedule
   - **[Your Semester]** - Quick access to assignments, notices, and timetable

---

### 👨‍💼 For Admins (Class Representatives)

#### Accessing Admin Portal:
1. Register with **"I am CR"** checked during registration
2. After login, click on **Admin Portal** in the navigation menu

#### Admin Functions:

**📊 Dashboard:**
- View total number of registered users
- View total number of assignments posted

**➕ Add Student:**
1. Click **Add-stu** in the navigation
2. Fill in student details
3. Submit to register the student

**📤 Upload Assignment:**
1. Click **Assingment** in the navigation
2. Enter assignment details:
   - Title
   - Select Semester (1-8)
   - Description
   - Upload File
3. Submit to post the assignment

**📣 Post Notice:**
1. Click **Notice** in the navigation
2. Enter notice details:
   - Title
   - Select Semester (1-8)
   - Description
3. Submit to broadcast the notice

**🎪 Create Club Event:**
1. Click **Club** in the navigation
2. Enter event details:
   - Event name
   - Date
   - Time
   - Venue
   - Description
3. Submit to publish the event

**📅 Upload Timetable:**
1. Click **Timetable** in the navigation
2. Select semester
3. Upload timetable image/PDF
4. Submit to update the timetable

---

## 🎨 Key Features Explained

### 🔒 Authentication & Security
- Password hashing using **bcryptjs**
- Session-based authentication
- Protected routes (students can only access their data)
- Admin-only routes for CR functionality

### 📱 Responsive Design
- Enhanced dropdown navigation with smooth animations
- Mobile-friendly interface
- Touch-optimized buttons and links
- Background overlay for better content visibility

### 🎯 Department-Based Organization
- Three departments: **CSE**, **ECE**, **EEE**
- Semester-wise content (1-8)
- Department-specific notes and papers

### 🌈 Modern UI/UX
- Gradient backgrounds with premium animations
- Staggered dropdown animations
- Hover effects with sliding arrows
- Semi-transparent overlays for readability
- Professional shadows and borders

---

## 🐛 Troubleshooting

### Common Issues:

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running. Start it with:
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change the port in `src/app.js` or kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**3. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables (Optional)

For better security, create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/classconnex
SESSION_SECRET=your-secret-key-here
```

Then update `src/app.js` and `src/db/db.js` to use these variables:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Developer

Created with ❤️ by **Prince Kumar**

- GitHub: [@PrinceNitt](https://github.com/PrinceNitt)

---

## 🌟 Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

## 📧 Contact & Support

For queries or support, please open an issue on GitHub or reach out via the contact information in the application.

---

**Happy Learning! 🎓✨**
