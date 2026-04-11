import React from 'react';
import { Mail, Heart, Coffee, MessageSquare, User, Settings, Info } from 'lucide-react';

const ContactDeveloper = () => {
    const email = "rjay7642@gmail.com";
    const upiId = "8521453764@ibl";
    const amount = "29";
    
    // UPI deep link for payment
    const upiLink = `upi://pay?pa=${upiId}&pn=SchoolPilot%20Developer&am=${amount}&cu=INR&tn=Support%20Developer`;

    const handleSupportClick = () => {
        const phonePeLink = `phonepe://pay?pa=${upiId}&pn=SchoolPilot%20Developer&am=${amount}&cu=INR&tn=Support%20Developer`;
        window.location.href = phonePeLink;
        setTimeout(() => {
            window.location.href = upiLink;
        }, 1200);
    };

    return (
        <div className="contact-developer-container">
            <div className="contact-header">
                <div className="contact-badge">The Architect</div>
                <h1 className="dev-name">Jay Singh</h1>
                <h2>Let's build something <span className="text-gradient">extraordinary</span> together.</h2>
                <p>Have questions, suggestions, or need custom features? I'm here to help you scale your school operations.</p>
            </div>

            <div className="contact-grid">
                {/* Contact Card */}
                <div className="contact-card main-card">
                    <div className="card-icon-wrapper">
                        <Mail className="card-icon" />
                    </div>
                    <h2>Get in Touch</h2>
                    <p>I usually respond within 24 hours. Feel free to drop an email for any queries.</p>
                    <a href={`mailto:${email}`} className="email-link">
                        {email}
                    </a>
                    
                    <div className="social-links">
                        <button className="social-btn" title="Contact"><User size={20} /></button>
                        <button className="social-btn" title="Settings"><Settings size={20} /></button>
                        <button className="social-btn" title="Info"><Info size={20} /></button>
                    </div>
                </div>

                {/* Support Card */}
                <div className="contact-card support-card">
                    <div className="card-icon-wrapper support-icon">
                        <Coffee className="card-icon" />
                    </div>
                    <h2>Support Development</h2>
                    <p>If SchoolPilot is helping your institution, consider supporting the developer with a small contribution.</p>
                    
                    <div className="price-tag">
                        <span className="currency">₹</span>
                        <span className="amount">{amount}</span>
                    </div>

                    <button className="btn-support" onClick={handleSupportClick}>
                        <Heart size={18} fill="currentColor" />
                        <span>Support via PhonePe</span>
                    </button>
                    
                    <div className="upi-info">
                        <span>UPI ID: {upiId}</span>
                    </div>
                </div>
            </div>

            <div className="contact-footer">
                <div className="footer-tag">
                    <MessageSquare size={16} />
                    <span>Always open for collaboration</span>
                </div>
            </div>
        </div>
    );
};

export default ContactDeveloper;
