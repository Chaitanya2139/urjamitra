import React, { useState } from 'react';
import { MockUser } from '../mockAuth';
import { mockAuth } from '../mockAuth';
import SolarEnergy from './modules/SolarEnergy';
import CarbonFootprint from './modules/CarbonFootprint';
import WaterTracker from './modules/WaterTracker';
import EcoChallenges from './modules/EcoChallenges';
import './Dashboard.css';

interface DashboardProps {
  user: MockUser;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeModule, setActiveModule] = useState('solar');

  const handleSignOut = async () => {
    try {
      await mockAuth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'solar':
        return <SolarEnergy />;
      case 'carbon':
        return <CarbonFootprint />;
      case 'water':
        return <WaterTracker />;
      case 'challenges':
        return <EcoChallenges />;
      default:
        return <SolarEnergy />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>UrjaMitra Dashboard</h1>
            <div className="user-info">
              <span>Welcome, {user.email}</span>
              <button onClick={handleSignOut} className="signout-btn">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-layout">
            <nav className="sidebar">
              <ul className="nav-menu">
                <li 
                  className={activeModule === 'solar' ? 'active' : ''}
                  onClick={() => setActiveModule('solar')}
                >
                  ☀️ Solar Energy
                </li>
                <li 
                  className={activeModule === 'carbon' ? 'active' : ''}
                  onClick={() => setActiveModule('carbon')}
                >
                  🌱 Carbon Footprint
                </li>
                <li 
                  className={activeModule === 'water' ? 'active' : ''}
                  onClick={() => setActiveModule('water')}
                >
                  💧 Water Tracker
                </li>
                <li 
                  className={activeModule === 'challenges' ? 'active' : ''}
                  onClick={() => setActiveModule('challenges')}
                >
                  🏆 Eco Challenges
                </li>
              </ul>
            </nav>

            <main className="main-content">
              {renderModule()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
