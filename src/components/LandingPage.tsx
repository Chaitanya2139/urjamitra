import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MockUser } from '../mockAuth';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  TrendingUp,
  Users,
  Globe2,
  Sparkles,
  Target,
  BarChart3,
  Heart,
  TreePine,
  Battery,
  Wind,
  Sun
} from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onAuthClick: () => void;
  user: MockUser | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthClick, user }) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Animation variants with correct TypeScript types
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const bounceIn = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Feature data
  const features = [
    {
      icon: Sun,
      title: "Smart Solar Optimization",
      description: "AI-powered algorithms maximize your solar panel efficiency, increasing energy generation by up to 40%",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Droplets,
      title: "Water Conservation",
      description: "Track and optimize water usage with smart monitoring that can reduce consumption by 25%",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: TreePine,
      title: "Carbon Footprint Tracker",
      description: "Monitor and reduce your environmental impact with real-time carbon footprint analysis",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Battery,
      title: "Energy Storage Manager",
      description: "Optimize battery storage and usage patterns for maximum efficiency and cost savings",
      color: "from-purple-400 to-indigo-500"
    },
    {
      icon: Wind,
      title: "Smart Grid Integration",
      description: "Seamlessly connect with smart grids for optimal energy distribution and cost reduction",
      color: "from-teal-400 to-blue-500"
    },
    {
      icon: Zap,
      title: "AI Insights & Tips",
      description: "Receive personalized recommendations to improve sustainability and save money",
      color: "from-amber-400 to-yellow-500"
    }
  ];

  const stats = [
    { number: "100K+", label: "Happy Families", icon: Users },
    { number: "70%", label: "CO2 Reduction", icon: TreePine },
    { number: "$2,500", label: "Annual Savings", icon: TrendingUp },
    { number: "4.9★", label: "User Rating", icon: Star }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "UrjaMitra transformed our home's energy efficiency. We're saving $300 monthly and feeling great about our environmental impact!",
      rating: 5,
      savings: "$3,600/year"
    },
    {
      name: "Michael Chen",
      role: "Solar Enthusiast",
      content: "The AI recommendations are spot-on. My solar panels are now 45% more efficient thanks to UrjaMitra's optimization.",
      rating: 5,
      savings: "$2,800/year"
    },
    {
      name: "Emily Rodriguez",
      role: "Eco-Warrior",
      content: "Amazing platform! The water tracking feature helped us reduce consumption by 30%. Our kids love the gamification aspect.",
      rating: 5,
      savings: "$1,200/year"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <motion.header 
        className="header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          backdropFilter: 'blur(20px)',
          background: 'rgba(15, 23, 42, 0.9)'
        }}
      >
        <div className="container">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="logo-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Leaf size={32} />
            </motion.div>
            <div>
              <h1>UrjaMitra</h1>
              <span>Your AI-Powered Sustainability Partner</span>
            </div>
          </motion.div>
          
          <nav className="nav">
            {['Home', 'Features', 'About', 'Contact'].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -2, color: "#6ee7b7" }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button 
              className="auth-btn"
              onClick={onAuthClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight size={16} />
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <motion.div className="hero-bg" style={{ y: y1, opacity }} />
        <div className="container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* <motion.div 
              className="hero-badge"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} />
              <span>Trusted by 100,000+ Eco-Warriors Worldwide</span>
            </motion.div> */}
            
            <motion.h1 
              className="hero-title"
              variants={fadeInUp}
            >
              Transform Your Home into a{' '}
              <motion.span 
                className="gradient-text"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                Sustainable Powerhouse
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              variants={fadeInUp}
            >
              Harness cutting-edge AI to optimize solar energy, slash carbon emissions by 70%, 
              and create a healthier planet for future generations. Save $2,500+ annually while 
              making a real environmental impact.
            </motion.p>
            
            <motion.div 
              className="hero-features"
              variants={staggerContainer}
            >
              {[
                { icon: Zap, text: "40% More Solar Efficiency" },
                { icon: BarChart3, text: "Real-time Impact Analytics" },
                { icon: Target, text: "AI-Powered Optimization" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="hero-feature"
                  variants={slideInLeft}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon size={20} />
                  </motion.div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="cta-buttons"
              variants={fadeInUp}
            >
              <motion.button 
                className="primary-btn"
                onClick={onAuthClick}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Play size={20} />
                Start Your Green Journey
              </motion.button>
              
              <motion.button 
                className="secondary-btn"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={16} />
                Watch Success Stories (3 min)
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="trust-indicators"
              variants={staggerContainer}
            >
              {[
                { icon: Star, text: "4.9/5 User Rating" },
                { icon: Users, text: "100,000+ Happy Families" },
                { icon: Heart, text: "99% Customer Satisfaction" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="trust-item"
                  variants={scaleIn}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <item.icon className="trust-icon" size={16} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.5
            }}
            style={{ y: y2 }}
          >
            <motion.div 
              className="floating-orb"
              animate={{ 
                y: [-20, 20, -20],
                rotateY: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 100px rgba(110, 231, 183, 0.5)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <Globe2 size={120} />
              </motion.div>
            </motion.div>
            
            {/* Enhanced floating particles with different sizes */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`particle particle-${i % 3}`}
                style={{
                  width: `${4 + (i % 3) * 2}px`,
                  height: `${4 + (i % 3) * 2}px`,
                }}
                initial={{ 
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * 600 - 300,
                  y: Math.random() * 600 - 300,
                  opacity: [0, 0.8, 0.6, 0],
                  scale: [0, 1, 0.8, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Orbital rings around the main orb */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="orbital-ring"
                style={{
                  position: 'absolute',
                  width: `${220 + i * 40}px`,
                  height: `${220 + i * 40}px`,
                  border: `1px solid rgba(110, 231, 183, ${0.1 - i * 0.02})`,
                  borderRadius: '50%',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
                animate={{ 
                  rotate: 360 
                }}
                transition={{ 
                  duration: 20 + i * 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" id="impact">
        <div className="container">
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)"
                }}
              >
                <motion.div
                  className="stat-icon"
                  variants={bounceIn}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon size={32} />
                </motion.div>
                <motion.div 
                  className="stat-number"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.number}
                </motion.div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              className="section-badge"
              variants={scaleIn}
            >
              <Sparkles size={16} />
              <span>Powerful Features</span>
            </motion.div>
            <h2>Everything You Need for Sustainable Living</h2>
            <p>Comprehensive AI-powered tools to optimize energy, water, and environmental impact</p>
          </motion.div>

          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={fadeInUp}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  rotateY: 2,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onHoverStart={() => {
                  // Add a subtle glow effect
                }}
              >
                <motion.div 
                  className={`feature-icon bg-gradient-to-br ${feature.color}`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 360,
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)"
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <feature.icon size={28} />
                </motion.div>
                <motion.h3
                  whileHover={{ color: "#6ee7b7" }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                <p>{feature.description}</p>
                <motion.div
                  className="feature-link"
                  whileHover={{ x: 8, color: "#10b981" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span>Learn More</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              className="section-badge"
              variants={scaleIn}
            >
              <Heart size={16} />
              <span>Customer Love</span>
            </motion.div>
            <h2>Loved by Eco-Warriors Worldwide</h2>
            <p>See how families are transforming their homes and saving thousands</p>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                variants={slideInLeft}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02 
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="testimonial-header">
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: 180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <Star size={16} className="star-filled" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="savings-badge">{testimonial.savings}</div>
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="about">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div
              className="section-badge"
              variants={scaleIn}
            >
              <Target size={16} />
              <span>How It Works</span>
            </motion.div>
            <h2>Simple Steps to Sustainable Living</h2>
            <p>Transform your home into an eco-friendly powerhouse with our easy 3-step process</p>
          </motion.div>

          <motion.div 
            className="steps-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                step: "01",
                title: "Connect & Analyze",
                description: "Link your smart devices and let our AI analyze your energy consumption patterns, water usage, and carbon footprint in real-time.",
                icon: BarChart3,
                color: "from-blue-400 to-blue-600"
              },
              {
                step: "02", 
                title: "Get Insights",
                description: "Receive personalized recommendations and actionable insights to optimize your energy usage and reduce environmental impact.",
                icon: Sparkles,
                color: "from-green-400 to-green-600"
              },
              {
                step: "03",
                title: "Save & Impact",
                description: "Implement suggested changes and watch your savings grow while making a positive impact on the environment.",
                icon: Heart,
                color: "from-purple-400 to-purple-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="step-card"
                variants={fadeInUp}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02 
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="step-number">{step.step}</div>
                <motion.div 
                  className={`step-icon bg-gradient-to-br ${step.color}`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon size={32} />
                </motion.div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <motion.div 
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="about-text" variants={slideInLeft}>
              <motion.div
                className="section-badge"
                variants={scaleIn}
              >
                <Globe2 size={16} />
                <span>Our Mission</span>
              </motion.div>
              <h2>Building a Sustainable Future, One Home at a Time</h2>
              <p>
                At UrjaMitra, we believe that every individual has the power to make a meaningful 
                impact on our planet. Our cutting-edge AI technology democratizes access to 
                sustainability insights, making it easy for families worldwide to reduce their 
                environmental footprint while saving money.
              </p>
              <div className="about-features">
                {[
                  { icon: Users, text: "100,000+ Families Empowered" },
                  { icon: TreePine, text: "2M+ Tons CO2 Saved" },
                  { icon: Zap, text: "50+ Countries Served" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="about-feature"
                    variants={fadeInUp}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <feature.icon size={20} />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="about-visual"
              variants={slideInRight}
            >
              <motion.div 
                className="about-card"
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="about-stats">
                  {[
                    { value: "70%", label: "CO2 Reduction", icon: TreePine },
                    { value: "$2,500", label: "Avg. Savings", icon: TrendingUp },
                    { value: "99%", label: "Satisfaction", icon: Star }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="about-stat"
                      whileHover={{ scale: 1.05 }}
                    >
                      <stat.icon size={24} />
                      <div className="stat-number">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <motion.div 
            className="contact-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="contact-info" variants={slideInLeft}>
              <motion.div
                className="section-badge"
                variants={scaleIn}
              >
                <Heart size={16} />
                <span>Get In Touch</span>
              </motion.div>
              <h2>Ready to Start Your Sustainable Journey?</h2>
              <p>
                Have questions about how UrjaMitra can help your family reduce environmental impact 
                and save money? Our team of sustainability experts is here to help.
              </p>
              
              <div className="contact-methods">
                {[
                  { 
                    icon: Users, 
                    title: "Expert Support", 
                    description: "Get personalized guidance from our sustainability experts"
                  },
                  { 
                    icon: Sparkles, 
                    title: "Custom Solutions", 
                    description: "Tailored recommendations for your home and lifestyle"
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Proven Results", 
                    description: "Join thousands of families already saving money and planet"
                  }
                ].map((method, index) => (
                  <motion.div 
                    key={index}
                    className="contact-method"
                    variants={fadeInUp}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <method.icon size={24} />
                    <div>
                      <h4>{method.title}</h4>
                      <p>{method.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="contact-form"
              variants={slideInRight}
            >
              <motion.div 
                className="form-card"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                }}
              >
                <h3>Get Started Today</h3>
                <p>Join the sustainable living revolution</p>
                
                <motion.button
                  className="primary-btn full-width"
                  onClick={onAuthClick}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={20} />
                  Begin Your Journey
                </motion.button>
                
                <div className="contact-benefits">
                  {[
                    "Instant AI analysis",
                    "Personalized recommendations", 
                    "24/7 support access",
                    "Community of eco-warriors"
                  ].map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className="contact-benefit"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle size={16} />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div
              className="cta-badge"
              variants={scaleIn}
            >
              <Sparkles size={16} />
              <span>Ready to Transform?</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp}>
              Join 100,000+ Families Building a 
              <span className="gradient-text"> Sustainable Future</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp}>
              Start your journey today with our free trial. No credit card required, 
              cancel anytime. Experience the power of AI-driven sustainability.
            </motion.p>

            <motion.div 
              className="cta-buttons"
              variants={fadeInUp}
            >
              <motion.button 
                className="primary-btn large"
                onClick={onAuthClick}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Play size={24} />
                Get Started Now
              </motion.button>
              
              <motion.div
                className="trial-info"
                variants={slideInRight}
              >
                <CheckCircle size={16} />
                <span>Quick setup • No credit card required</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="final-stats"
              variants={staggerContainer}
            >
              {[
                { value: "2 minutes", label: "Setup time" },
                { value: "$0", label: "Upfront cost" },
                { value: "24/7", label: "AI monitoring" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="final-stat"
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="stat-value">{item.value}</span>
                  <span className="stat-label">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <motion.div 
            className="footer-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="footer-brand">
              <div className="logo">
                <Leaf size={32} />
                <div>
                  <h3>UrjaMitra</h3>
                  <span>Building a sustainable tomorrow</span>
                </div>
              </div>
              <p>Empowering families worldwide to create sustainable homes through AI-powered optimization.</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#docs">Documentation</a>
                <a href="#community">Community</a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p>&copy; 2024 UrjaMitra. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">🌱 Carbon Neutral</span>
              <span className="badge">⚡ Powered by Green Energy</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;