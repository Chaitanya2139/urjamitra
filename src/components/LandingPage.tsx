import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MockUser } from '../mockAuth';
import Globe from './Globe';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  Award, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Shield,
  TrendingUp,
  Users,
  Globe2
} from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onAuthClick: () => void;
  user: MockUser | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthClick, user }) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
        
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Hero animation
        gsap.fromTo(heroRef.current, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );

        // Stats animation with stagger and counter animation
        gsap.fromTo('.stat-card',
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            onComplete: () => {
              // Animate counter numbers
              document.querySelectorAll('.stat-number').forEach((el) => {
                const target = parseInt(el.getAttribute('data-count') || '0');
                const isFloat = el.textContent?.includes('.') || false;
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                    current = target;
                    clearInterval(timer);
                  }
                  el.textContent = isFloat ? 
                    current.toFixed(1) + (el.textContent?.includes('%') ? '%' : '') :
                    Math.floor(current).toLocaleString() + (el.textContent?.includes('+') ? '+' : '');
                }, 30);
              });
            }
          }
        );

        // Features animation
        gsap.fromTo('.feature-card',
          { opacity: 0, y: 50, rotationX: 15 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Benefits animation
        gsap.fromTo('.benefit-item',
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Testimonials animation
        gsap.fromTo('.testimonial-card',
          { opacity: 0, scale: 0.8, rotation: 5 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: 0.2,
            ease: "elastic.out(1, 0.3)",
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // CTA animation
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Parallax effect for hero background
        gsap.to('.hero-background', {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

      } catch (error) {
        console.warn('GSAP animations could not be loaded:', error);
        // Fallback: simple CSS animations
        if (heroRef.current) {
          heroRef.current.style.opacity = '1';
          heroRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    initAnimations();
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <div className="logo-icon">
              <Leaf size={32} />
            </div>
            <div>
              <h1>UrjaMitra</h1>
              <span>Your AI-Powered Sustainability Companion</span>
            </div>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <button className="auth-btn" onClick={onAuthClick}>
              Get Started Free
              <ArrowRight size={16} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield size={16} />
              <span>Trusted by 50,000+ Eco-Warriors</span>
            </div>
            <h1>Transform Your Home into a 
              <span className="gradient-text"> Sustainable Powerhouse</span>
            </h1>
            <p className="hero-subtitle">
              Harness the power of AI to optimize solar energy, reduce carbon footprint by up to 60%, 
              and make every drop of water count. Join the green revolution and save $2,000+ annually.
            </p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <CheckCircle size={20} />
                <span>30% More Solar Efficiency</span>
              </div>
              <div className="hero-feature">
                <CheckCircle size={20} />
                <span>Real-time Impact Tracking</span>
              </div>
              <div className="hero-feature">
                <CheckCircle size={20} />
                <span>AI-Powered Recommendations</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button className="primary-btn" onClick={onAuthClick}>
                <Play size={20} />
                Start Your Journey
              </button>
              <button className="secondary-btn">
                <Play size={16} />
                Watch Demo (2 min)
              </button>
            </div>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <Star className="star-icon" size={16} />
                <span>4.9/5 User Rating</span>
              </div>
              <div className="trust-item">
                <Users size={16} />
                <span>50,000+ Happy Users</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="globe-wrapper">
              <Globe />
              <div className="energy-rings"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" ref={statsRef}>
        <div className="container">
          <div className="stats-header">
            <h2>Real Impact, Real Results</h2>
            <p>Join thousands of families making a measurable difference</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Zap />
              </div>
              <div className="stat-number" data-count="2500000">2.5M+</div>
              <div className="stat-label">Homes Powered by Solar</div>
              <div className="stat-change">↗ 15% this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-number" data-count="60">60%</div>
              <div className="stat-label">Average Energy Savings</div>
              <div className="stat-change">↗ 8% this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Leaf />
              </div>
              <div className="stat-number" data-count="25000">25K+</div>
              <div className="stat-label">Tons CO₂ Reduced</div>
              <div className="stat-change">↗ 12% this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Droplets />
              </div>
              <div className="stat-number" data-count="800000">800K+</div>
              <div className="stat-label">Liters Water Saved</div>
              <div className="stat-change">↗ 20% this month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef} id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful AI Features for a Greener Tomorrow</h2>
            <p>Everything you need to transform your home into an eco-friendly powerhouse</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-icon">
                <Zap />
              </div>
              <h3>Smart Solar Optimization</h3>
              <p>AI-powered scheduling maximizes your solar panel efficiency by 35%. 
                 Automatically adjust energy usage based on weather patterns and consumption habits.</p>
              <ul className="feature-list">
                <li>Predictive weather analysis</li>
                <li>Automated device scheduling</li>
                <li>Real-time efficiency monitoring</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Leaf />
              </div>
              <h3>Carbon Footprint Tracking</h3>
              <p>Smart analysis of your purchases, travel, and lifestyle choices with personalized 
                 recommendations to reduce your environmental impact.</p>
              <ul className="feature-list">
                <li>Purchase impact analysis</li>
                <li>Transport tracking</li>
                <li>Lifestyle optimization</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Droplets />
              </div>
              <h3>Water Intelligence System</h3>
              <p>Monitor water quality in real-time and optimize usage patterns to save up to 40% 
                 on your water bills while ensuring safety.</p>
              <ul className="feature-list">
                <li>Quality monitoring</li>
                <li>Leak detection</li>
                <li>Usage optimization</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Award />
              </div>
              <h3>Gamified Eco-Challenges</h3>
              <p>Earn points, badges, and rewards for sustainable actions. Compete with friends 
                 and neighbors to create a positive environmental impact.</p>
              <ul className="feature-list">
                <li>Daily eco-challenges</li>
                <li>Community leaderboards</li>
                <li>Reward marketplace</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" ref={benefitsRef} id="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Why Choose UrjaMitra?</h2>
              <p className="benefits-subtitle">
                Join the sustainable living revolution with AI-powered insights that make a real difference
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <TrendingUp />
                  </div>
                  <div className="benefit-content">
                    <h4>Save $2,000+ Annually</h4>
                    <p>Optimize energy and water usage to dramatically reduce utility bills</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Globe2 />
                  </div>
                  <div className="benefit-content">
                    <h4>Reduce Carbon Footprint by 60%</h4>
                    <p>Make a measurable impact on climate change with data-driven decisions</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Shield />
                  </div>
                  <div className="benefit-content">
                    <h4>Health & Safety Monitoring</h4>
                    <p>Ensure your family's wellbeing with real-time water and air quality tracking</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Users />
                  </div>
                  <div className="benefit-content">
                    <h4>Community Impact</h4>
                    <p>Connect with like-minded families and amplify your environmental impact</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="benefits-visual">
              <div className="benefit-card floating">
                <div className="benefit-stat">
                  <span className="stat-big">$2,340</span>
                  <span className="stat-label">Annual Savings</span>
                </div>
              </div>
              <div className="benefit-card floating delay-1">
                <div className="benefit-stat">
                  <span className="stat-big">4.2 tons</span>
                  <span className="stat-label">CO₂ Reduced</span>
                </div>
              </div>
              <div className="benefit-card floating delay-2">
                <div className="benefit-stat">
                  <span className="stat-big">15,680L</span>
                  <span className="stat-label">Water Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" ref={testimonialsRef} id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Families Worldwide</h2>
            <p>See how UrjaMitra is transforming homes and lives</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>
              <p>"UrjaMitra helped us save $3,200 last year! The AI recommendations are spot-on, 
                 and our solar panels are now 40% more efficient."</p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <strong>Sarah Mitchell</strong>
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>
              <p>"The water monitoring feature caught a leak that could have cost us thousands. 
                 UrjaMitra paid for itself in the first month!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">DJ</div>
                <div className="author-info">
                  <strong>David Johnson</strong>
                  <span>Austin, TX</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>
              <p>"My kids love the eco-challenges! We've reduced our carbon footprint by 55% 
                 while having fun as a family. It's a win-win!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">EP</div>
                <div className="author-info">
                  <strong>Emily Parker</strong>
                  <span>Seattle, WA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Home?</h2>
            <p>Join 50,000+ families already saving money and the planet</p>
            
            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Free 30-day trial</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={20} />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <div className="cta-buttons-large">
              <button className="primary-btn-large" onClick={onAuthClick}>
                Start Your Free Trial
                <ArrowRight size={20} />
              </button>
              <p className="cta-subtext">Start seeing results in 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3>UrjaMitra</h3>
                  <span>Sustainable Living Made Simple</span>
                </div>
              </div>
              <p>Building a sustainable future, one home at a time.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#integrations">Integrations</a>
                <a href="#api">API</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#press">Press</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#blog">Blog</a>
                <a href="#guides">Guides</a>
                <a href="#help">Help Center</a>
                <a href="#community">Community</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 UrjaMitra. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
