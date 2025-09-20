import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './EcoChallenges.css';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'energy' | 'water' | 'carbon' | 'waste';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  progress: number;
  maxProgress: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

const EcoChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Turn off lights when not in use',
      description: 'Turn off lights in unoccupied rooms for a full day',
      points: 10,
      category: 'energy',
      difficulty: 'easy',
      completed: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'Reduce shower time',
      description: 'Take 5-minute showers for a week',
      points: 25,
      category: 'water',
      difficulty: 'medium',
      completed: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: '3',
      title: 'Use reusable bags',
      description: 'Use reusable shopping bags for all purchases',
      points: 15,
      category: 'waste',
      difficulty: 'easy',
      completed: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: '4',
      title: 'Plant a tree',
      description: 'Plant a tree in your garden or community',
      points: 50,
      category: 'carbon',
      difficulty: 'hard',
      completed: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: '5',
      title: 'Energy audit',
      description: 'Complete a home energy audit and implement 3 improvements',
      points: 75,
      category: 'energy',
      difficulty: 'hard',
      completed: false,
      progress: 0,
      maxProgress: 3
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Energy Saver',
      description: 'Complete 5 energy challenges',
      icon: '⚡',
      earned: false
    },
    {
      id: '2',
      name: 'Water Warrior',
      description: 'Complete 3 water challenges',
      icon: '💧',
      earned: false
    },
    {
      id: '3',
      name: 'Carbon Crusher',
      description: 'Complete 2 carbon challenges',
      icon: '🌱',
      earned: false
    },
    {
      id: '4',
      name: 'Waste Warrior',
      description: 'Complete 3 waste challenges',
      icon: '♻️',
      earned: false
    },
    {
      id: '5',
      name: 'Eco Champion',
      description: 'Complete 10 challenges total',
      icon: '🏆',
      earned: false
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

  const checkBadges = useCallback(() => {
    const completedChallenges = challenges.filter(c => c.completed);
    const energyChallenges = completedChallenges.filter(c => c.category === 'energy').length;
    const waterChallenges = completedChallenges.filter(c => c.category === 'water').length;
    const carbonChallenges = completedChallenges.filter(c => c.category === 'carbon').length;
    const wasteChallenges = completedChallenges.filter(c => c.category === 'waste').length;

    setBadges(prevBadges => prevBadges.map(badge => {
      let earned = false;
      switch (badge.id) {
        case '1':
          earned = energyChallenges >= 5;
          break;
        case '2':
          earned = waterChallenges >= 3;
          break;
        case '3':
          earned = carbonChallenges >= 2;
          break;
        case '4':
          earned = wasteChallenges >= 3;
          break;
        case '5':
          earned = completedChallenges.length >= 10;
          break;
      }
      return { ...badge, earned, earnedDate: earned && !badge.earned ? new Date() : badge.earnedDate };
    }));
  }, [challenges]);

  useEffect(() => {
    const total = challenges.reduce((sum, challenge) => 
      challenge.completed ? sum + challenge.points : sum, 0
    );
    setTotalPoints(total);

    const completed = challenges.filter(challenge => challenge.completed).length;
    setCompletedChallenges(completed);

    // Check for badge eligibility
    checkBadges();
  }, [challenges, checkBadges]);

  const updateChallengeProgress = (id: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.id === id) {
          const newProgress = Math.min(challenge.progress + 1, challenge.maxProgress);
          const completed = newProgress >= challenge.maxProgress;
          return { ...challenge, progress: newProgress, completed };
        }
        return challenge;
      })
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return '⚡';
      case 'water': return '💧';
      case 'carbon': return '🌱';
      case 'waste': return '♻️';
      default: return '🌍';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy': return '#FFC107';
      case 'water': return '#2196F3';
      case 'carbon': return '#4CAF50';
      case 'waste': return '#9C27B0';
      default: return '#666';
    }
  };

  const getPersonalizedSuggestions = async () => {
    setIsLoading(true);
    try {
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        setAiSuggestions('AI features require a Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
        return;
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As a sustainability coach, analyze this user's progress:
        
        Total Points: ${totalPoints}
        Completed Challenges: ${completedChallenges}
        Challenges by Category:
        ${challenges.reduce((acc, c) => {
          if (c.completed) {
            acc[c.category] = (acc[c.category] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)}
        
        Please provide:
        1. Personalized challenge recommendations based on their progress
        2. Tips to stay motivated
        3. Suggestions for new challenges they might enjoy
        4. Ways to involve family/friends in sustainability efforts
        
        Format your response in an encouraging, actionable way.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiSuggestions(response.text());
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setAiSuggestions('Unable to generate suggestions at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="eco-challenges">
      <div className="module-header">
        <h2>🏆 Eco Challenges & Gamification</h2>
        <p>Complete challenges, earn points, and unlock badges for sustainable living</p>
      </div>

      <div className="challenges-grid">
        <div className="stats-section">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Points</h3>
              <div className="stat-value">
                {totalPoints}
                <span>pts</span>
              </div>
            </div>
            
            <div className="stat-card">
              <h3>Challenges</h3>
              <div className="stat-value">
                {completedChallenges}/{challenges.length}
                <span>completed</span>
              </div>
            </div>
            
            <div className="stat-card">
              <h3>Badges</h3>
              <div className="stat-value">
                {badges.filter(b => b.earned).length}/{badges.length}
                <span>earned</span>
              </div>
            </div>
          </div>

          <div className="badges-section">
            <h3>Your Badges</h3>
            <div className="badges-grid">
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`badge ${badge.earned ? 'earned' : 'locked'}`}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-info">
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                    {badge.earned && badge.earnedDate && (
                      <div className="badge-date">
                        Earned {badge.earnedDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="challenges-section">
          <div className="challenges-header">
            <h3>Available Challenges</h3>
            <button 
              onClick={getPersonalizedSuggestions}
              disabled={isLoading}
              className="suggestions-btn"
            >
              {isLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
            </button>
          </div>

          <div className="challenges-list">
            {challenges.map(challenge => (
              <div key={challenge.id} className={`challenge-card ${challenge.completed ? 'completed' : ''}`}>
                <div className="challenge-header">
                  <div className="challenge-category">
                    <span 
                      className="category-icon"
                      style={{ color: getCategoryColor(challenge.category) }}
                    >
                      {getCategoryIcon(challenge.category)}
                    </span>
                    <span className="category-name">{challenge.category}</span>
                  </div>
                  <div className="challenge-difficulty">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <div className="challenge-content">
                  <h4>{challenge.title}</h4>
                  <p>{challenge.description}</p>
                  
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(challenge.progress / challenge.maxProgress) * 100}%`,
                          backgroundColor: getCategoryColor(challenge.category)
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {challenge.progress}/{challenge.maxProgress}
                    </span>
                  </div>

                  <div className="challenge-actions">
                    <div className="challenge-points">
                      {challenge.points} points
                    </div>
                    {!challenge.completed && (
                      <button 
                        onClick={() => updateChallengeProgress(challenge.id)}
                        className="progress-btn"
                        disabled={challenge.progress >= challenge.maxProgress}
                      >
                        {challenge.progress >= challenge.maxProgress ? 'Complete!' : 'Update Progress'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-suggestions">
          <h3>AI-Powered Suggestions</h3>
          <div className="suggestions-content">
            {aiSuggestions ? (
              <div className="suggestions-text">
                {aiSuggestions.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <div className="suggestions-placeholder">
                Click "Get AI Suggestions" to receive personalized challenge recommendations and tips.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoChallenges;
