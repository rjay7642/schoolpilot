import React, { useState } from 'react';
import {
  BadgeCheck,
  ChevronDown,
  Database,
  LayoutDashboard,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore, fileToDataURL } from '../store/useStore.js';
import { db } from '../store/db.js';
import Swal from 'sweetalert2';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

const featureCards = [
  {
    title: 'Result Studio',
    desc: 'Create clean academic certificates with flexible subject sets, live totals, and print-ready layouts.',
    icon: LayoutDashboard,
  },
  {
    title: 'ID Desk',
    desc: 'Prepare student ID cards with front-back preview, school branding, and quick export to print format.',
    icon: Printer,
  },
  {
    title: 'Private Storage',
    desc: 'All school data stays inside the browser workspace so teams keep control of records and history.',
    icon: Database,
  },
];

const workflowSteps = [
  {
    n: '01',
    title: 'Create School Workspace',
    desc: 'Register your school once with logo, contacts, and admin credentials.',
  },
  {
    n: '02',
    title: 'Enter Student Data',
    desc: 'Add subjects, marks, and profile details from one calm working area.',
  },
  {
    n: '03',
    title: 'Review Before Print',
    desc: 'Check certificate or ID preview before sending anything to print.',
  },
  {
    n: '04',
    title: 'Reuse From History',
    desc: 'Open, print, or re-template previous records whenever you need them.',
  },
];

const templateCards = [
  { name: 'Royal Horizon', color: 'linear-gradient(135deg, #0b4f6c, #1d7874)' },
  { name: 'Emerald Luxe', color: 'linear-gradient(135deg, #0f766e, #2c7a7b)' },
  { name: 'Midnight Gold', color: 'linear-gradient(135deg, #1f2937, #9a7b4f)' },
  { name: 'Rose Quartz', color: 'linear-gradient(135deg, #8b5e6b, #d4a5a5)' },
  { name: 'Platinum Slate', color: 'linear-gradient(135deg, #475569, #94a3b8)' },
];

const testimonials = [
  {
    quote: 'Result generation now feels like a proper app instead of a rushed form. Our office team is much faster.',
    name: 'R. Sharma',
    role: 'Exam Incharge',
  },
  {
    quote: 'History search and quick reprint have reduced repeat work every week.',
    name: 'S. Khan',
    role: 'Vice Principal',
  },
  {
    quote: 'The local-first setup gives us confidence because records stay in our own browser workspace.',
    name: 'A. Singh',
    role: 'School Admin',
  },
];

const faqItems = [
  {
    q: 'How many certificates or ID cards can we create?',
    a: 'There is no fixed in-app limit. You can continue generating records inside the local workspace as long as the browser storage allows it.',
  },
  {
    q: 'Can we print on PVC or A4 sheets?',
    a: 'Yes. Result certificates are formatted for A4 output, and the ID card flow is prepared for dedicated ID card printing.',
  },
  {
    q: 'Can the school logo appear on documents?',
    a: 'Yes. The logo uploaded during registration is reused across certificates, ID cards, and previews where supported.',
  },
  {
    q: 'Will our data go to an external server?',
    a: 'No. This app stores data locally in the browser, which keeps the workflow private and fast.',
  },
  {
    q: 'Can we reopen older records and change the template?',
    a: 'Yes. The history tab lets you pick a saved record, switch its template, preview it, and print again.',
  },
];

function AuthModal({ type, onClose, onSwitch, loginSeedEmail, setLoginSeedEmail }) {
  const { getUsers, login } = useStore();
  const [loading, setLoading] = useState(false);

  const isLogin = type === 'login';

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const file = form.elements.schoolLogoFile?.files?.[0];

    if (file) {
      try {
        data.schoolLogo = await fileToDataURL(file);
      } catch {
        data.schoolLogo = '';
      }
    }

    delete data.schoolLogoFile;

    const users = await getUsers();
    if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
      setLoading(false);
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Email already registered',
        text: 'Please log in with the existing admin account.',
      });
      return;
    }

    const newUser = { ...data, createdAt: new Date().toISOString() };
    await db.users.add(newUser);

    setLoading(false);
    form.reset();
    setLoginSeedEmail?.(data.email || '');
    onClose();

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Registration successful',
      text: 'School workspace created. Login screen is opening now.',
      timer: 1400,
      showConfirmButton: false,
    });

    onSwitch('login');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    const users = await getUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );

    setLoading(false);

    if (!user) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Login failed',
        text: 'Invalid email or password. Please try again.',
      });
      return;
    }

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Login successful',
      text: `${user.schoolName} workspace is loading.`,
      timer: 1200,
      showConfirmButton: false,
    });

    setLoginSeedEmail?.('');
    login(user);
    onClose();
  }

  async function handleForgotPassword(loginForm) {
    const email = loginForm?.elements?.email?.value?.trim();
    if (!email) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Enter email first',
        text: 'Please enter the registered admin email above.',
      });
      return;
    }

    const users = await getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (user) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'info',
        title: 'Password hint',
        html: `<p style="margin:0;color:#475569">Hint: <strong style="color:#0f766e">${
          user.passwordHint || 'No hint set'
        }</strong></p>`,
      });
      return;
    }

    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'error',
      title: 'Account not found',
      text: 'No admin account exists for that email.',
    });
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose} type="button">
          x
        </button>

        {isLogin ? (
          <>
            <div className="auth-badge">Admin Access</div>
            <h2>Open your school workspace</h2>
            <p className="auth-sub">
              Sign in to manage results, ID cards, and archived student records.
            </p>

            <form className="auth-form" id="loginForm" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
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
                {loading ? 'Signing in...' : 'Open Workspace'}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm auth-helper"
                onClick={() => handleForgotPassword(document.getElementById('loginForm'))}
              >
                Forgot password?
              </button>
            </form>

            <p className="auth-switch">
              Need a new school workspace?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitch('register');
                }}
              >
                Register here
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="auth-badge">New Workspace</div>
            <h2>Register your school</h2>
            <p className="auth-sub">
              Add your school details once and start working from a single organized dashboard.
            </p>

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
                  <input className="form-input" name="password" type="password" minLength={6} required placeholder="Minimum 6 characters" />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label">School Logo</label>
                  <input type="file" name="schoolLogoFile" accept="image/*" />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label">Password Hint</label>
                  <input className="form-input" name="passwordHint" required placeholder="Helpful reminder for recovery" />
                </div>
              </div>

              <button className="btn btn-primary full-btn" disabled={loading} type="submit">
                {loading ? 'Creating workspace...' : 'Create Workspace'}
              </button>
            </form>

            <p className="auth-switch">
              Already registered?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
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
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)} type="button">
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
    <div className="landing">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <nav className="nav">
        <div className="nav-logo">
          <img src="logo.png" alt="SchoolPilot" />
          <div className="nav-logo-text">
            <div className="name">SchoolPilot</div>
            <div className="sub">School Operations Suite</div>
          </div>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#templates">Templates</a>
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

      <section className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Sparkles size={14} />
              Calm, professional school operations
            </div>

            <h1>
              A cleaner way to manage
              <span className="gradient-text"> results, print history, and student IDs</span>
            </h1>

            <p className="hero-desc">
              SchoolPilot gives your team a polished browser workspace with white, readable interfaces,
              print-ready documents, and local-first data handling.
            </p>

            <div className="hero-btns">
              <button className="btn btn-primary btn-lg" onClick={() => setAuthType('register')} type="button">
                Start Free Workspace
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setAuthType('login')} type="button">
                Open Admin Login
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-card">
                <div className="hero-stat-val">One place</div>
                <div className="hero-stat-label">Results, IDs, and records</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">Local-first</div>
                <div className="hero-stat-label">Fast browser-based storage</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">Print-ready</div>
                <div className="hero-stat-label">A4 results and ID exports</div>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-head">
              <div>
                <div className="hero-panel-badge">Workspace Snapshot</div>
                <h3>Built to feel like a real school web app</h3>
              </div>
              <div className="hero-panel-icon">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="hero-panel-list">
              {featureCards.map((item) => {
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

            <div className="hero-panel-footer">
              <div>
                <strong>Ready in minutes</strong>
                <span>Register once, then work from one dashboard.</span>
              </div>
              <BadgeCheck size={20} />
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        {[
          'Professional white interface',
          'Result certificate workflow',
          'Student ID print flow',
          'Local browser data storage',
          'Fast record recovery',
        ].map((item) => (
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
            <h2>Everything stays organized and easy on the eyes</h2>
            <p>
              The interface is built to reduce clutter so office teams can work faster without losing
              track of details.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                title: 'Readable layout',
                desc: 'White surfaces, calm spacing, and black text keep long working sessions comfortable.',
              },
              {
                title: 'Consistent workflows',
                desc: 'Results, templates, history, and ID generation follow a single predictable app flow.',
              },
              {
                title: 'Flexible templates',
                desc: 'Switch between result styles without losing the saved student record.',
              },
              {
                title: 'Smart archive',
                desc: 'Search and filter student outputs by name, class, and result status.',
              },
              {
                title: 'Print-focused output',
                desc: 'Preview and export documents with layouts prepared for real print usage.',
              },
              {
                title: 'Private by design',
                desc: 'The app keeps records in the browser instead of relying on a remote server.',
              },
            ].map((item) => (
              <div className="feature-card" key={item.title}>
                <div className="feature-icon" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section" id="workflow">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-neutral">Workflow</span>
            <h2>A simple four-step operating flow</h2>
            <p>
              Register the school once, then move through generation, preview, and print without losing context.
            </p>
          </div>

          <div className="process-grid">
            {workflowSteps.map((step) => (
              <div className="process-card" key={step.n}>
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
            <span className="badge badge-accent">Templates</span>
            <h2>Five result styles for different school preferences</h2>
            <p>
              Each saved result can be reopened and paired with a different visual template from the history page.
            </p>
          </div>

          <div className="template-gallery">
            {templateCards.map((item) => (
              <div className="template-showcase-card" key={item.name}>
                <div className="template-showcase-swatch" style={{ background: item.color }} />
                <h4>{item.name}</h4>
                <p>Balanced color, formal structure, and clean print presentation.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-neutral">Testimonials</span>
            <h2>Made for real school office work</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <div className="testimonial-card" key={item.name}>
                <p>{item.quote}</p>
                <h4>{item.name}</h4>
                <small>{item.role}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-inner">
          <div className="section-head">
            <span className="badge badge-accent">FAQ</span>
            <h2>Common questions from schools</h2>
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
          <div className="cta-split">
            <div className="cta-card cta-card-primary">
              <span className="badge badge-accent">Start Now</span>
              <h3>Set up your school workspace in one sitting</h3>
              <p>Register the school, log in, and begin generating records from a single dashboard.</p>
              <button className="btn btn-primary btn-lg" onClick={() => setAuthType('register')} type="button">
                Create Workspace
              </button>
            </div>

            <div className="cta-card">
              <span className="badge badge-neutral">Existing Admin</span>
              <h3>Open your current workspace</h3>
              <p>Continue with result generation, reprints, or archive review.</p>
              <button className="btn btn-secondary btn-lg" onClick={() => setAuthType('login')} type="button">
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand-name">SchoolPilot</div>
            <div className="brand-desc">Professional school result and ID workspace</div>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-credit">
            <div>Private browser storage</div>
            <div>Print-ready certificate and ID flows</div>
            <div>Support: <a href="mailto:rjay7642@gmail.com">rjay7642@gmail.com</a></div>
          </div>
        </div>
      </footer>

      {authType && (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
          onSwitch={setAuthType}
          loginSeedEmail={loginSeedEmail}
          setLoginSeedEmail={setLoginSeedEmail}
        />
      )}
    </div>
  );
}
