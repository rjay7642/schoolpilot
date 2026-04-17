import React from 'react';
import { Mail, MessageSquare, MapPin, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import jayPhoto from '../../assets/jay.jpeg';

const ContactDeveloper = () => {
    const email = "rjay7642@gmail.com";
    
    return (
        <div className="contact-developer-container">
            <div className="premium-dev-header">
                <div className="dev-photo-wrapper">
                    <img src={jayPhoto} alt="Jay Singh" className="dev-photo-large" />
                    <div className="dev-status-badge">
                        <Sparkles size={14} />
                        <span>Lead Architect</span>
                    </div>
                </div>
                
                <h1 className="dev-name-premium">Jay Singh</h1>
                <p className="dev-tagline">Building the future of institutional management systems with elegance and precision.</p>
                
                <div className="dev-stats-row">
                    <div className="dev-stat-item">
                        <strong>5+</strong>
                        <span>Modules</span>
                    </div>
                    <div className="dev-divider" />
                    <div className="dev-stat-item">
                        <strong>Elite</strong>
                        <span>Standard</span>
                    </div>
                    <div className="dev-divider" />
                    <div className="dev-stat-item">
                        <strong>24/7</strong>
                        <span>Local Support</span>
                    </div>
                </div>
            </div>

            <div className="contact-premium-grid">
                <div className="contact-info-card-premium">
                    <div className="card-head">
                        <div className="head-icon">
                            <Mail size={20} />
                        </div>
                        <h3>Direct Channel</h3>
                    </div>
                    <p>Have a custom requirement or need technical assistance? Reach out directly via email.</p>
                    <a href={`mailto:${email}`} className="premium-email-btn">
                        {email}
                    </a>
                </div>

                <div className="contact-info-card-premium">
                    <div className="card-head">
                        <div className="head-icon">
                            <ShieldCheck size={20} />
                        </div>
                        <h3>Security & Privacy</h3>
                    </div>
                    <p>Your institutional data stays within your local workspace. I prioritize your privacy and data sovereignty.</p>
                    <div className="security-badges">
                        <span className="s-badge">Local-First</span>
                        <span className="s-badge">Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="contact-premium-footer">
                <div className="footer-location">
                    <MapPin size={16} />
                    <span>Based in India, serving global institutions</span>
                </div>
                <div className="footer-version">
                    <Globe size={16} />
                    <span>SchoolPilot Elite V3.0</span>
                </div>
            </div>
        </div>
    );
};

export default ContactDeveloper;

