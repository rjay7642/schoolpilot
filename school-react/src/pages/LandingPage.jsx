import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  CreditCard,
  Database,
  FileText,
  Gem,
  GraduationCap,
  HandCoins,
  History,
  Layers3,
  LayoutDashboard,
  Mail,
  MapPin,
  Printer,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
} from 'lucide-react';
import Swal from 'sweetalert2';
import PremiumLogo from '../components/PremiumLogo.jsx';
import { db } from '../store/db.js';
import { fileToDataURL, useStore } from '../store/useStore.js';
import jayPhoto from "../assets/jay.jpeg";

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
  customClass: {
    popup: 'premium-swal-popup',
  },
  backdrop: 'rgba(15, 23, 42, 0.5)',
};

const trustSignals = [
  'Premium institutional landing experience',
  'Wrong login shows clear feedback instantly',
  'Result and ID workflow in one place',
  'History-based reprint and template switch',
  'Developer details visible in the footer',
];

const heroStats = [
  { value: '5', label: 'premium result styles' },
  { value: '100%', label: 'local browser privacy' },
  { value: '1 click', label: 'history reprint flow' },
];

const commandMetrics = [
  { label: 'Workspace feel', value: 'Premium' },
  { label: 'Storage mode', value: 'Private' },
  { label: 'Print review', value: 'Live' },
  { label: 'Admin feedback', value: 'Instant' },
];

const commandDeck = [
  {
    title: 'Result Studio',
    desc: 'Create polished certificates with live marks, totals, and grades.',
    icon: FileText,
  },
  {
    title: 'ID Desk',
    desc: 'Prepare student ID cards with front-back print preview.',
    icon: CreditCard,
  },
  {
    title: 'Archive Recall',
    desc: 'Open old records, switch themes, and print again in seconds.',
    icon: History,
  },
];

const featureCards = [
  {
    icon: LayoutDashboard,
    eyebrow: 'First Impression',
    title: 'A landing page that feels product-grade',
    desc: 'Hero, navigation, sections, footer, and CTAs are arranged to look calm, premium, and intentional instead of rushed.',
  },
  {
    icon: FileText,
    eyebrow: 'Academic Output',
    title: 'Formal result workflow',
    desc: 'Certificates stay easy to read, print-ready, and aligned with an institutional presentation standard.',
  },
  {
    icon: Printer,
    eyebrow: 'Identity Desk',
    title: 'Student ID generation with print confidence',
    desc: 'Generate, preview, and export front-back ID cards from one clear workflow.',
  },
  {
    icon: History,
    eyebrow: 'Operational Recall',
    title: 'History that actually saves time',
    desc: 'Saved records can be searched, reopened, restyled, and printed again without doing duplicate work.',
  },
  {
    icon: Database,
    eyebrow: 'Private Storage',
    title: 'Local-first by design',
    desc: 'The app keeps school data inside the browser workspace, reducing friction and keeping the workflow fast.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Login Experience',
    title: 'Clear authentication feedback',
    desc: 'Wrong login ID and wrong password now show polished alert messages so admins instantly know what went wrong.',
  },
];

const experiencePoints = [
  {
    icon: Gem,
    title: 'Luxury visual language',
    desc: 'Glass panels, soft gold accents, layered spacing, and premium typography create a higher-end feel.',
  },
  {
    icon: Layers3,
    title: 'Long-tail presentation',
    desc: 'The page now carries enough depth below the fold to feel like a complete institutional website, not a short splash screen.',
  },
  {
    icon: ScanEye,
    title: 'Confidence before print',
    desc: 'Preview-oriented flows help staff review outputs before sharing or printing them.',
  },
];

const workflowSteps = [
  {
    n: '01',
    title: 'Register the institution once',
    desc: 'Add school identity, admin details, logo, and password hint in a single guided form.',
  },
  {
    n: '02',
    title: 'Login to your private workspace',
    desc: 'Admins enter email and password, and now receive clear guidance if either one is wrong.',
  },
  {
    n: '03',
    title: 'Generate results and ID cards',
    desc: 'Use the dashboard to prepare documents, review them, and keep the design polished.',
  },
  {
    n: '04',
    title: 'Reopen from history anytime',
    desc: 'Find saved records later, change templates, preview again, and print without starting from scratch.',
  },
];

const audienceCards = [
  {
    icon: GraduationCap,
    title: 'For principals and school owners',
    desc: 'The front-facing experience now looks serious enough to represent a premium institution.',
  },
  {
    icon: LayoutDashboard,
    title: 'For office admins',
    desc: 'Less clutter, clearer actions, and better feedback mean smoother daily operations.',
  },
  {
    icon: Printer,
    title: 'For exam and print desks',
    desc: 'Preview, export, and reprint flows are organized to reduce last-minute mistakes.',
  },
];

const templateCards = [
  { name: 'Royal Horizon', color: 'linear-gradient(135deg, #082f49, #0f766e)' },
  { name: 'Emerald Luxe', color: 'linear-gradient(135deg, #134e4a, #2c7a7b)' },
  { name: 'Midnight Gold', color: 'linear-gradient(135deg, #111827, #b88b4b)' },
  { name: 'Rose Ledger', color: 'linear-gradient(135deg, #6b3144, #cf9baa)' },
  { name: 'Platinum Slate', color: 'linear-gradient(135deg, #334155, #93a4b8)' },
];

const testimonials = [
  {
    quote: 'The new landing experience finally feels like a premium school product instead of a basic tool.',
    name: 'Administrative Team',
    role: 'Front Office',
  },
  {
    quote: 'Clear login messaging helps staff recover faster when they mistype credentials.',
    name: 'Exam Cell',
    role: 'Daily Operations',
  },
  {
    quote: 'Developer details at the bottom make support feel personal and trustworthy.',
    name: 'School Management',
    role: 'Product Review',
  },
];

const faqItems = [
  {
    q: 'What happens if the admin email is wrong during login?',
    a: 'A popup now shows that the login ID was not found, so the user can check the email or create a new workspace.',
  },
  {
    q: 'What happens if the password is wrong?',
    a: 'A separate popup appears for incorrect passwords and points the admin toward the saved password hint flow.',
  },
  {
    q: 'Will the school data go to any remote server?',
    a: 'No. The current app keeps records in the browser workspace so the process stays local and fast.',
  },
  {
    q: 'Can I keep my developer details visible on the page?',
    a: 'Yes. The long-tail developer spotlight and footer both keep your details visible in a premium way.',
  },
  {
    q: 'Can this layout still work on mobile screens?',
    a: 'Yes. The upgraded sections and auth modal are arranged with mobile-friendly stacking and responsive spacing.',
  },
];

const developerProfile = {
  name: 'Jay Singh',
  email: 'rjay7642@gmail.com',
  location: 'India',
};

function AuthModal({ type, onClose, onSwitch, loginSeedEmail, setLoginSeedEmail }) {
  const { getUsers, login } = useStore();
  const [loading, setLoading] = useState(false);
  const loginFormRef = useRef(null);

  const isLogin = type === 'login';
  const authHighlights = isLogin
    ? [
        {
          icon: ShieldCheck,
          title: 'Private local access',
          desc: 'Login validation happens locally in this browser workspace.',
        },
        {
          icon: Workflow,
          title: 'Fast admin recovery',
          desc: 'Wrong ID or password now shows clean feedback.',
        },
        {
          icon: History,
          title: 'Return to saved records',
          desc: 'Open your school workspace and continue from where your team left off.',
        },
      ]
    : [
        {
          icon: GraduationCap,
          title: 'Onboard your school once',
          desc: 'Save institution identity, logo, and admin details in one pass.',
        },
        {
          icon: Gem,
          title: 'Premium branded workspace',
          desc: 'Results, IDs, and archive screens stay visually clean and professional.',
        },
        {
          icon: Database,
          title: 'Local-first setup',
          desc: 'Your workspace is stored in the browser for speed and privacy.',
        },
      ];

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const file = form.elements.schoolLogoFile?.files?.[0];
    const data = {
      schoolName: form.elements.schoolName.value.trim(),
      adminName: form.elements.adminName.value.trim(),
      phone: form.elements.phone.value.trim(),
      location: form.elements.location.value.trim(),
      principalName: form.elements.principalName.value.trim(),
      schoolMobile: form.elements.schoolMobile.value.trim(),
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
      passwordHint: form.elements.passwordHint.value.trim(),
    };

    if (file) {
      try {
        data.schoolLogo = await fileToDataURL(file);
      } catch {
        data.schoolLogo = '';
      }
    }

    const users = await getUsers();
    if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
      setLoading(false);
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Email already registered',
        text: 'This admin email is already linked with a school workspace. Please log in instead.',
      });
      return;
    }

    await db.users.add({ ...data, createdAt: new Date().toISOString() });

    setLoading(false);
    form.reset();
    setLoginSeedEmail?.(data.email);
    onClose();

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Workspace created',
      text: 'Your school profile is saved. The login screen will open now.',
      timer: 1500,
      showConfirmButton: false,
    });

    onSwitch('login');
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const users = await getUsers();
    const emailMatch = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    setLoading(false);

    if (!emailMatch) {
      await Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Admin ID Not Found',
        text: 'This email is not registered with any school workspace. Please check the email or create a new workspace first.',
      });
      form.elements.email.focus();
      return;
    }

    if (emailMatch.password !== password) {
      await Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Access Denied',
        text: 'The password you entered is incorrect. If you have forgotten it, check the password hint.',
      });
      form.elements.password.focus();
      return;
    }

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Login successful',
      text: `${emailMatch.schoolName} workspace is loading.`,
      timer: 1200,
      showConfirmButton: false,
    });

    setLoginSeedEmail?.('');
    login(emailMatch);
    onClose();
  }

  async function handleForgotPassword() {
    const email = loginFormRef.current?.elements?.email?.value?.trim();

    if (!email) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Enter email first',
        text: 'Please enter the registered admin email before checking the password hint.',
      });
      return;
    }

    const users = await getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Account not found',
        text: 'No workspace was found for that admin email.',
      });
      return;
    }

    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'info',
      title: 'Saved password hint',
      text: user.passwordHint || 'No hint saved',
    });
  }

  return (
    <div className="auth-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="auth-modal premium-auth-modal" onClick={(event) => event.stopPropagation()}>
        <button className="auth-close" onClick={onClose} type="button" aria-label="Close modal">
          x
        </button>

        <div className="auth-layout">
          <div className="auth-visual">
            <PremiumLogo
              size="md"
              showText
              subtitle={isLogin ? 'Secure admin workspace access' : 'Premium school workspace onboarding'}
            />

            <div className="auth-badge">{isLogin ? 'Admin Access' : 'New Workspace'}</div>
            <h2>{isLogin ? 'Open your premium school workspace' : 'Create your premium school workspace'}</h2>
            <p className="auth-sub">
              {isLogin
                ? 'Sign in to continue with result generation, archive recall, and student ID printing.'
                : 'Register once with school identity, principal details, and admin credentials to start cleanly.'}
            </p>

            <div className="auth-signal-list">
              {authHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="auth-signal-card" key={item.title}>
                    <div className="auth-signal-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="auth-form-panel">
            {isLogin ? (
              <>
                <div className="auth-form-copy">
                  <span className="badge badge-accent">Secure Sign In</span>
                  <h3>Continue as school administrator</h3>
                  <p>Use your registered admin email and password to access the dashboard.</p>
                </div>

                <form className="auth-form" ref={loginFormRef} onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Admin Email</label>
                    <input
                      className="form-input"
                      name="email"
                      type="email"
                      required
                      defaultValue={loginSeedEmail || ''}
                      placeholder="admin@school.edu"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <button className="btn btn-primary full-btn" disabled={loading} type="submit">
                    {loading ? 'Signing in...' : 'Launch Workspace'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm auth-helper"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </form>

                <p className="auth-switch">
                  Need a new school workspace?{' '}
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      onSwitch('register');
                    }}
                  >
                    Register here
                  </a>
                </p>
              </>
            ) : (
              <>
                <div className="auth-form-copy">
                  <span className="badge badge-neutral">Institution Setup</span>
                  <h3>Set up the school identity</h3>
                  <p>Fill these details once and the workspace will be ready for daily academic operations.</p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">School Name</label>
                      <input className="form-input" name="schoolName" required placeholder="Sunrise Public School" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Admin Name</label>
                      <input className="form-input" name="adminName" required placeholder="Administrator name" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" name="phone" type="tel" required placeholder="+91 99999 00000" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" name="location" required placeholder="Delhi, India" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Principal Name</label>
                      <input className="form-input" name="principalName" required placeholder="Principal name" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">School Mobile</label>
                      <input className="form-input" name="schoolMobile" type="tel" required placeholder="011-12345678" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" name="email" type="email" required placeholder="admin@school.edu" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        className="form-input"
                        name="password"
                        type="password"
                        minLength={6}
                        required
                        placeholder="Minimum 6 characters"
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label className="form-label">School Logo</label>
                      <input type="file" name="schoolLogoFile" accept="image/*" />
                    </div>

                    <div className="form-group col-span-2">
                      <label className="form-label">Password Hint</label>
                      <input
                        className="form-input"
                        name="passwordHint"
                        required
                        placeholder="Helpful reminder for account recovery"
                      />
                    </div>
                  </div>

                  <p className="form-helper-text">
                    This workspace stores records locally in the browser, so setup stays fast and private.
                  </p>

                  <button className="btn btn-primary full-btn" disabled={loading} type="submit">
                    {loading ? 'Creating workspace...' : 'Create Premium Workspace'}
                  </button>
                </form>

                <p className="auth-switch">
                  Already registered?{' '}
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      onSwitch('login');
                    }}
                  >
                    Log in
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen((value) => !value)} type="button">
        <span>{q}</span>
        <ChevronDown className="faq-chevron" size={18} />
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [authType, setAuthType] = useState(null);
  const [loginSeedEmail, setLoginSeedEmail] = useState('');

  return (
    <div className="landing premium-landing">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <nav className="nav premium-nav">
        <PremiumLogo size="sm" showText subtitle="Premium School Workspace" />

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#developer">Developer</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setAuthType('login')} type="button">
            Login
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setAuthType('register')} type="button">
            Create Workspace
          </button>
        </div>
      </nav>

      <section className="hero premium-hero" id="home">
        <div className="hero-grid premium-hero-grid">
          <div className="hero-content premium-hero-copy">
            <div className="hero-eyebrow">
              <Sparkles size={14} />
              Premium school operating experience
            </div>

            <h1>
              Turn your school identity into a{' '}
              <span className="gradient-text"> polished premium workspace</span>
            </h1>

            <p className="hero-desc">
              SchoolPilot provides a high-end first impression for your institution, with a smooth admin flow, 
              private browser storage, and professional print-ready outputs.
            </p>

            <div className="hero-btns">
              <button className="btn btn-primary btn-lg" onClick={() => setAuthType('register')} type="button">
                Create Premium Workspace
                <ArrowRight size={17} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setAuthType('login')} type="button">
                Open Admin Login
              </button>
            </div>

            <div className="hero-stats premium-hero-stats">
              {heroStats.map((item) => (
                <div className="hero-stat-card premium-hero-stat-card" key={item.label}>
                  <div className="hero-stat-val">{item.value}</div>
                  <div className="hero-stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel premium-command-center">
            <div className="command-shell">
              <div className="command-shell-bar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="command-shell-label">Institution Command Center</div>
              </div>

              <div className="command-main-card">
                <div className="hero-panel-head">
                  <div>
                    <div className="hero-panel-badge">Premium Experience Layer</div>
                    <h3>Deliberate design from first click to final print</h3>
                  </div>
                  <div className="hero-panel-icon">
                    <Gem size={20} />
                  </div>
                </div>

                <div className="command-metric-grid">
                  {commandMetrics.map((item) => (
                    <div className="command-metric-card" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-panel-list premium-command-list">
                {commandDeck.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="hero-panel-card">
                      <div className="hero-panel-card-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hero-panel-footer premium-panel-footer">
                <div>
                  <strong>Direct support is visible</strong>
                  <span>Developer spotlight and support details stay present in the long-tail section.</span>
                </div>
                <BadgeCheck size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip premium-trust-strip">
        {trustSignals.map((item) => (
          <div className="trust-chip" key={item}>
            <BadgeCheck size={14} />
            {item}
          </div>
        ))}
      </div>

      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-accent">Core Features</span>
            <h2>Designed to look premium and operate without clutter</h2>
            <p>
              Every block below supports the same goal: stronger visual trust, cleaner school operations,
              and less confusion for admins.
            </p>
          </div>

          <div className="features-grid premium-feature-grid">
            {featureCards.map((item) => {
              const Icon = item.icon;

              return (
                <div className="feature-card premium-feature-card" key={item.title}>
                  <div className="premium-feature-head">
                    <div className="feature-icon premium-feature-icon">
                      <Icon size={20} />
                    </div>
                    <span className="premium-feature-eyebrow">{item.eyebrow}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-accent">Workflow</span>
            <h2>A cleaner admin journey from registration to reprint</h2>
            <p>The operational path stays simple even while the visual presentation feels more refined.</p>
          </div>

          <div className="process-grid premium-process-grid">
            {workflowSteps.map((step) => (
              <div className="process-card premium-process-card" key={step.n}>
                <span className="step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="section" id="templates">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-accent">Template Styles</span>
            <h2>Formal result themes with a more elevated presentation</h2>
            <p>Saved results can still be reopened later and paired with a different template when needed.</p>
          </div>

          <div className="template-gallery premium-template-gallery">
            {templateCards.map((item) => (
              <div className="template-showcase-card premium-template-card" key={item.name}>
                <div className="template-showcase-swatch" style={{ background: item.color }} />
                <h4>{item.name}</h4>
                <p>Balanced hierarchy, premium tone, and institution-friendly print presence.</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="section" id="developer">
        <div className="section-inner">
          <div className="developer-spotlight">
            <div className="developer-spotlight-copy">
              <span className="badge badge-accent">Developer Spotlight</span>
              <h2>Built and supported by {developerProfile.name}</h2>
              <p>
                The long-tail section now keeps your developer identity visible in a premium way so schools
                know exactly who to contact for support, branding changes, and custom feature work.
              </p>

              <div className="developer-promise-list">
                {[
                  'Custom landing page polish and institutional branding support',
                  'Login flow improvements and premium feedback interactions',
                  'Direct contact path for fixes, upgrades, and collaboration',
                ].map((item) => (
                  <div className="developer-promise-row" key={item}>
                    <BadgeCheck size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="hero-btns developer-actions">
                <a className="btn btn-primary btn-lg" href={`mailto:${developerProfile.email}`}>
                  Email Developer
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <div className="developer-spotlight-cards">
              <div className="developer-card developer-card-primary">
                <div className="developer-card-header">
                  <img 
                    src={jayPhoto} 
                    alt={developerProfile.name} 
                    width="90"
                    height="90"
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid var(--accent)',
                      display: 'block',
                      imageRendering: '-webkit-optimize-contrast',
                      transform: 'translateZ(0)',
                      boxShadow: '0 8px 24px rgba(15, 118, 110, 0.15)'
                    }} 
                  />
                  <div>
                    <div className="developer-name">{developerProfile.name}</div>
                    <div className="developer-role">Professional Developer</div>
                  </div>
                </div>

                <div className="developer-detail-list">
                  <div className="developer-detail-row">
                    <Mail size={17} />
                    <span>{developerProfile.email}</span>
                  </div>
                  <div className="developer-detail-row">
                    <Clock3 size={17} />
                    <span>Usually responds within 24 hours</span>
                  </div>
                  <div className="developer-detail-row">
                    <MapPin size={17} />
                    <span>{developerProfile.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-accent">FAQ</span>
            <h2>Important questions about the upgraded experience</h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="cta-split premium-cta-split">
            <div className="cta-card cta-card-primary premium-cta-primary">
              <span className="badge badge-accent">Start Now</span>
              <h3>Give your school a calmer and more premium front desk</h3>
              <p>
                Register the workspace once, log in cleanly, and manage results, IDs, and history from one polished system.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => setAuthType('register')} type="button">
                Create Workspace
              </button>
            </div>

            <div className="cta-card premium-cta-secondary">
              <span className="badge badge-neutral">Existing Admin</span>
              <h3>Return to your saved workspace</h3>
              <p>Continue working with archive history, print output, and secure admin access.</p>
              <button className="btn btn-secondary btn-lg" onClick={() => setAuthType('login')} type="button">
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer premium-footer">
        <div className="footer-inner premium-footer-inner">
          <div className="footer-brand premium-footer-brand">
            <PremiumLogo size="sm" showText subtitle="Premium local school workspace" />
            <div className="brand-desc">
              Results, ID cards, private browser storage, and direct developer support.
            </div>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#developer">Developer</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-credit">
            <div>Developer: {developerProfile.name}</div>
            <div>
              Support: <a href={`mailto:${developerProfile.email}`}>{developerProfile.email}</a>
            </div>
          </div>
        </div>
      </footer>

      {authType ? (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
          onSwitch={setAuthType}
          loginSeedEmail={loginSeedEmail}
          setLoginSeedEmail={setLoginSeedEmail}
        />
      ) : null}
    </div>
  );
}
