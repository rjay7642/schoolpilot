import React from 'react';
import { Heart, Coffee, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

const SupportDeveloper = () => {
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
        <div className="support-page-container">
            <div className="support-hero">
                <div className="support-icon-float">
                    <Coffee size={40} className="coffee-icon" />
                    <Heart size={24} className="heart-icon-float" />
                </div>
                <h1 className="support-title">Fuel the Innovation</h1>
                <p className="support-subtitle">Your support helps keep SchoolPilot independent and continuously improving.</p>
            </div>

            <div className="support-main-card">
                <div className="support-tier-badge">
                    <Sparkles size={14} />
                    <span>One-Time Contribution</span>
                </div>
                
                <div className="support-pricing">
                    <span className="currency">₹</span>
                    <span className="amount">{amount}</span>
                </div>
                
                <p className="support-desc">
                    By contributing a small amount, you're helping us maintain secure, 
                    local-first infrastructure for schools across the nation.
                </p>

                <button className="premium-support-btn" onClick={handleSupportClick}>
                    <span>Proceed with PhonePe / UPI</span>
                    <div className="btn-glow" />
                </button>

                <div className="upi-id-copy">
                    <p>UPI ID: <strong>{upiId}</strong></p>
                </div>
            </div>

            <div className="support-benefits">
                <div className="benefit-card">
                    <ShieldCheck size={20} />
                    <h4>Future Updates</h4>
                    <p>Ensuring life-time compatibility</p>
                </div>
                <div className="benefit-card">
                    <Sparkles size={20} />
                    <h4>New Features</h4>
                    <p>Driving modular development</p>
                </div>
            </div>

            <div className="support-notice">
                <AlertCircle size={16} />
                <span>Contributions are used for infrastructure development.</span>
            </div>
        </div>
    );
};

export default SupportDeveloper;
