# Jury Frontend

Live Link: https://jury-front.vercel.app/

Jury Frontend is a React-based web interface for the AI-powered UI Review & Accountability Platform.  
It allows users to upload UI screenshots, visualize detected issues, and collaborate with their teammates in real time.

---

## Features
- Upload and preview UI screenshots for automated analysis  
- View AI-detected UI issues with categorized severity  
- Real-time chat section for team discussions using Socket.IO  
- User authentication and role-based dashboards  
- Responsive layout built with React and modern CSS frameworks  

---

## Tech Stack
- React.js  
- Tailwind CSS / Bootstrap  
- Socket.IO Client  
- Axios  
- React Router  

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jury-frontend.git
   cd jury-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. Run the app:
   ```bash
   npm start
   ```

5. The frontend will be available at `http://localhost:3000`.

---

## Folder Structure
```
src/
 ┣ components/
 ┣ pages/
 ┣ services/
 ┣ context/
 ┗ App.js
```

---

## Contribution
Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to modify.

---

## License
This project is licensed under the MIT License.
