# CI/CD Playground

![CI/CD Playground Banner](https://img.shields.io/badge/CI%2FCD-Playground-blueviolet?style=for-the-badge)

A beautiful, interactive visualization of a CI/CD pipeline. This project helps developers understand pipeline flows, debugging strategies, and log management through a simulated environment.

## 🚀 Features

- **Visual Pipeline Flow**: Clear, animated representation of BUILD, TEST, and DEPLOY stages.
- **Real-time Log Tailing**: Watch logs stream in real-time as the pipeline executes.
- **Smart Log Selection**:
  - Automatically follows the running stage.
  - Keeps your manual selection even after the pipeline finishes.
  - Persists on the failed stage for debugging.
- **Interactive Controls**:
  - **Run Pipeline**: Trigger a new build.
  - **Simulate Failure**: Toggle to intentionally fail the TEST stage.
  - **Retry**: Restart the pipeline from a failed state.
- **Responsive Design**: Fully responsive UI with a premium dark theme.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: For smooth animations and transitions.
- **Lucide React**: Beautiful & consistent icons.

### Backend
- **Node.js & Express**: Simple server to simulate pipeline capability and long-polling.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YashhCanCode/CI-CD-Playground.git
cd CI-CD-Playground
```

### 2. Setup Backend
The backend simulates the CI/CD server logic.
```bash
cd Backend
npm install
node index.js
```
*The backend runs on `http://localhost:4000`*

### 3. Setup Frontend
Open a new terminal window for the frontend.
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`*

## 🎮 Usage

1.  Open the frontend URL (`http://localhost:5173`).
2.  Click **Run Pipeline** to start the simulation.
3.  Observe the stages transition from **BUILD** -> **TEST** -> **DEPLOY**.
4.  Toggle **Simulate Failure** and run again to see how the system handles errors.
5.  Click **Retry** to recover from a failure.

## 📂 Project Structure

```
CI-CD-Playground/
├── Backend/              # Express server for pipeline logic
│   ├── index.js          # Main server file
│   └── ...
├── frontend/             # React application
│   ├── src/
│   │   ├── App.jsx       # Main UI logic
│   │   └── ...
│   └── ...
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


