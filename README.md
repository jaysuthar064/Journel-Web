📓 Journal Web App
A personal journaling web application where users can write, manage, and search through their journal entries securely.

🌐 Live Site: journel-web.onrender.com

🚀 Features

User Authentication — Secure sign up, login, and logout
Create / Edit / Delete Entries — Full control over your journal content
Search & Filter — Quickly find past entries by keyword

🎓 Learning Outcomes

Through this project I learned:
Express backend architecture
Passport.js authentication
Session management
PostgreSQL database design
Middleware usage
Environment variable configuration
Cloud deployment with Render

🛠️ Tech Stack
LayerTechnologyFrontendHTML, CSS, JavaScriptBackendNode.js, ExpressHostingRender

📁 Project Structure
journal-app/
├── public/          # Static files (HTML, CSS, JS)
├── routes/          # Express route handlers
├── views/           # Page templates
├── middleware/      # Auth & other middleware
├── app.js           # Entry point
└── package.json

⚙️ Getting Started
Prerequisites

Node.js (v16 or higher)
npm

Installation
bash# 1. Clone the repository
git clone https://github.com/jaysuthar064/Journel-Web.git
cd journal-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start the server
npm start
The app will run at http://localhost:3000

🔐 Environment Variables
Create a .env file in the root directory:
envPORT=3000
SESSION_SECRET=your_secret_key

📌 Usage

Visit journel-web.onrender.com or run locally
Register a new account or log in
Click New Entry to write a journal entry
Use the search bar to filter entries by keyword
Click any entry to edit or delete it


🚢 Deployment
This app is deployed on Render. Any push to the main branch auto-deploys to the live site.

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

👨‍💻 Author

Jayanti Lal

Full Stack Developer focused on backend systems and modern web technologies.
