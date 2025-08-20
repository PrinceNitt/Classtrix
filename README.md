# Classtrix

ClassConnex is a web-based platform designed to streamline and enhance classroom and club management for educational institutions. It provides features for managing students, assignments, notes, notices, club events, timetables, and more.

## Features

- Student registration and management
- Assignment upload and tracking
- Notes and study material sharing
- Notice board for important updates
- Club event management
- Timetable management
- Admin and student portals

## Project Structure

```
ClassConnex-main/
├── package.json
├── public/
│   ├── css/
│   └── images/
├── src/
│   ├── app.js
│   ├── db/
│   └── models/
├── templates/
│   └── views/
```

- **public/**: Static assets (CSS, images)
- **src/app.js**: Main application entry point
- **src/db/**: Database connection and configuration
- **src/models/**: Mongoose models for various entities
- **templates/views/**: Handlebars templates for UI

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PrinceNitt/Classtrix.git
   cd Classtrix/ClassConnex-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your MongoDB connection in `src/db/db.js`.
4. Start the application:
   ```bash
   node src/app.js
   ```
5. Open your browser and go to `http://localhost:3000` (or the port specified in your app).

## Usage
- Access the admin portal for managing students, assignments, clubs, and notices.
- Students can log in to view assignments, notes, timetables, and club events.

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- Handlebars (hbs)
- HTML/CSS/JavaScript

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
