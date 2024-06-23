import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./Pages/Home";
import Main from "./Pages/Main";
import NavBar from "./Components/NavBar/NavBar";
import SideNavBar from "./Components/SideNavBar/SideNavBar";
import Projects from "./Components/Projects/Projects";
import Tasks from "./Components/Tasks/Task";
import Users from "./Components/Users/Users";
import Completed from "./Components/Completed/Completed";
import ToDo from "./Components/ToDo/ToDo";
import InProgress from "./Components/InProgress/InProgress";

import './App.css';

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <SideNavBar />
    <div className="main-content">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<MainLayout><Main /></MainLayout>} />
          <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
          <Route path="/tasks" element={<MainLayout><Tasks /></MainLayout>} />
          <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
          <Route path="/complete" element={<MainLayout><Completed /></MainLayout>} />
          <Route path="/todo" element={<MainLayout><ToDo /></MainLayout>} />
          <Route path="/inprogress" element={<MainLayout><InProgress /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
