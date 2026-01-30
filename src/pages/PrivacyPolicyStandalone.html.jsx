<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Dancoby Construction Company</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(to bottom, #f8fafc, #ffffff);
        }

        .hero {
            background-color: #3d3d3d;
            position: relative;
            overflow: hidden;
        }

        .hero-pattern {
            position: absolute;
            inset: 0;
            opacity: 0.05;
            background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        .hero-content {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 24px 112px;
            text-align: center;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 24px;
            padding: 8px 16px;
            margin-bottom: 24px;
            font-size: 14px;
            color: rgba(255,255,255,0.8);
            font-weight: 500;
        }

        .hero h1 {
            font-size: 48px;
            font-weight: bold;
            color: white;
            margin-bottom: 16px;
        }

        .hero-subtitle {
            color: rgba(255,255,255,0.7);
            font-size: 20px;
            max-width: 800px;
            margin: 0 auto 32px;
        }

        .hero-date {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: rgba(255,255,255,0.5);
            font-size: 14px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 64px 24px;
        }

        .content-wrapper {
            display: flex;
            gap: 48px;
        }

        .sidebar {
            width: 288px;
            flex-shrink: 0;
            position: sticky;
            top: 32px;
            align-self: flex-start;
        }

        .nav-card {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(229,231,235,0.6);
            border-radius: 12px;
            padding: 8px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        .nav-header {
            padding: 16px;
            border-bottom: 1px solid #f3f4f6;
        }

        .nav-header h3 {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .nav-items {
            padding: 8px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            color: #4b5563;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
        }

        .nav-item:hover {
            background: #f9fafb;
        }

        .nav-item.active {
            background: #3d3d3d;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .nav-item svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }

        .nav-item.active svg {
            color: rgba(255,255,255,0.8);
        }

        .main-content {
            flex: 1;
            min-width: 0;
        }

        section {
            margin-bottom: 64px;
            scroll-margin-top: 96px;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }

        .section-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-icon svg {
            width: 20px;
            height: 20px;
            color: #4b5563;
        }

        .section-header h3 {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
        }

        .card {
            background: white;
            border: 1px solid rgba(226,232,240,0.6);
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
        }

        .card p {
            color: #4b5563;
            margin-bottom: 16px;
        }

        .card h4 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 32px 0 16px;
        }

        .card h4:first-child {
            margin-top: 0;
        }

        .card ul {
            list-style: none;
            margin-bottom: 24px;
        }

        .card li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            color: #4b5563;
            margin-bottom: 12px;
        }

        .card li::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #4b5563;
            margin-top: 10px;
            flex-shrink: 0;
        }

        .info-box {
            margin-top: 24px;
            padding: 16px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .info-box p {
            color: #374151;
            font-size: 14px;
            margin: 0;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .grid-item {
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #f1f5f9;
        }

        .grid-item h5 {
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .grid-item p {
            font-size: 14px;
            color: #64748b;
            margin: 0;
        }

        .contact-card {
            background: linear-gradient(135deg, #3d3d3d 0%, #2d2d2d 100%);
            border: none;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        .contact-card p {
            color: rgba(255,255,255,0.7);
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
        }

        .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }

        .contact-icon {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .contact-icon svg {
            width: 24px;
            height: 24px;
            color: rgba(255,255,255,0.8);
        }

        .contact-item h5 {
            font-weight: 600;
            color: white;
            margin-bottom: 4px;
        }

        .contact-item p {
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            margin: 0;
        }

        @media (max-width: 1024px) {
            .content-wrapper {
                flex-direction: column;
            }

            .sidebar {
                width: 100%;
                position: static;
            }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 32px;
            }

            .hero-subtitle {
                font-size: 18px;
            }

            .hero-content {
                padding: 48px 24px 64px;
            }
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-pattern"></div>
        <div class="hero-content">
            <div class="hero-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>DANCOBY CONSTRUCTION COMPANY</span>
            </div>
            <h1>Privacy Policy</h1>
            <p class="hero-subtitle">Sophisticated-Customer Centric-Transformations</p>
            <div class="hero-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Last Updated: January 2025</span>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container">
        <div class="content-wrapper">
            <!-- Sidebar Navigation -->
            <aside class="sidebar">
                <div class="nav-card">
                    <div class="nav-header">
                        <h3>Quick Navigation</h3>
                    </div>
                    <div class="nav-items">
                        <button class="nav-item active" onclick="scrollToSection('overview')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Overview</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('collection')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span>Information We Collect</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('usage')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>How We Use Your Information</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('sharing')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>Information Sharing</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('cookies')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                            <span>Cookies & Tracking</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('security')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Data Security</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('rights')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            <span>Your Rights</span>
                        </button>
                        <button class="nav-item" onclick="scrollToSection('contact')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            <span>Contact Us</span>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Content Sections -->
            <main class="main-content">
                <!-- Overview -->
                <section id="overview">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3>Overview</h3>
                    </div>
                    <div class="card">
                        <p>At Dancoby Construction Company, we understand that your privacy is important to you. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our construction services. With over twenty years of experience providing sophisticated, customer-centric transformations, we are equally committed to protecting your personal information.</p>
                        <p>We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices, please contact us.</p>
                        <div class="info-box">
                            <p><strong>Please read this policy carefully.</strong> By using our services, you agree to the collection and use of information in accordance with this policy.</p>
                        </div>
                    </div>
                </section>

                <!-- Information We Collect -->
                <section id="collection">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </div>
                        <h3>Information We Collect</h3>
                    </div>
                    <div class="card">
                        <h4>Personal Information</h4>
                        <p>We may collect personal information that you voluntarily provide to us when you:</p>
                        <ul>
                            <li>Request a quote or consultation for construction services</li>
                            <li>Fill out a contact form on our website</li>
                            <li>Subscribe to our newsletter or updates</li>
                            <li>Apply for employment with our company</li>
                            <li>Engage with us on social media platforms</li>
                        </ul>
                        
                        <h4>Information Automatically Collected</h4>
                        <p>When you visit our website, we automatically collect certain information including:</p>
                        <div class="grid-2">
                            <div class="grid-item">
                                <h5>Device Information</h5>
                                <p>Browser type, operating system, device type</p>
                            </div>
                            <div class="grid-item">
                                <h5>Usage Data</h5>
                                <p>Pages visited, time spent, click patterns</p>
                            </div>
                            <div class="grid-item">
                                <h5>Location Data</h5>
                                <p>General geographic location based on IP</p>
                            </div>
                            <div class="grid-item">
                                <h5>Referral Source</h5>
                                <p>How you found our website</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- How We Use Your Information -->
                <section id="usage">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </div>
                        <h3>How We Use Your Information</h3>
                    </div>
                    <div class="card">
                        <p>We use the information we collect for various purposes, including:</p>
                        <ul>
                            <li><strong>Service Delivery:</strong> To provide quotes, schedule consultations, and deliver our construction services</li>
                            <li><strong>Communication:</strong> To respond to your inquiries, send project updates, and provide customer support</li>
                            <li><strong>Marketing:</strong> To send promotional materials and information about new services (with your consent)</li>
                            <li><strong>Improvement:</strong> To analyze website usage and improve our services and user experience</li>
                            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                            <li><strong>Safety & Security:</strong> To protect our business, employees, and customers from fraud or security threats</li>
                        </ul>
                    </div>
                </section>

                <!-- Information Sharing -->
                <section id="sharing">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Information Sharing</h3>
                    </div>
                    <div class="card">
                        <p>We value your privacy and do not sell your personal information. We may share your information only in the following circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Trusted third parties who assist us in operating our website, conducting our business, or servicing you (e.g., payment processors, email services)</li>
                            <li><strong>Business Partners:</strong> Subcontractors, suppliers, or partners involved in your construction project, with your consent</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process, or to protect our rights, privacy, safety, or property</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred</li>
                        </ul>
                    </div>
                </section>

                <!-- Cookies & Tracking -->
                <section id="cookies">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                        </div>
                        <h3>Cookies & Tracking Technologies</h3>
                    </div>
                    <div class="card">
                        <p>We use cookies and similar tracking technologies to collect and track information about your browsing activities on our website.</p>
                        
                        <h4>Types of Cookies We Use</h4>
                        <ul>
                            <li><strong>Essential:</strong> Required for basic website functionality and cannot be disabled</li>
                            <li><strong>Analytics:</strong> Help us understand how visitors interact with our website</li>
                            <li><strong>Marketing:</strong> Used to deliver relevant advertisements and track campaign performance</li>
                            <li><strong>Functional:</strong> Remember your preferences and personalize your experience</li>
                        </ul>

                        <div class="info-box">
                            <p><strong>Managing Cookies:</strong> You can control and/or delete cookies as you wish through your browser settings. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
                        </div>
                    </div>
                </section>

                <!-- Data Security -->
                <section id="security">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3>Data Security</h3>
                    </div>
                    <div class="card">
                        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                        
                        <div class="grid-2">
                            <div class="grid-item">
                                <h5>Encryption</h5>
                                <p>SSL/TLS encryption for data in transit</p>
                            </div>
                            <div class="grid-item">
                                <h5>Access Control</h5>
                                <p>Restricted access to personal data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Monitoring</h5>
                                <p>Regular security assessments</p>
                            </div>
                        </div>

                        <p style="font-size: 14px; font-style: italic; color: #64748b;">While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
                    </div>
                </section>

                <!-- Your Rights -->
                <section id="rights">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <h3>Your Rights</h3>
                    </div>
                    <div class="card">
                        <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                        
                        <div class="grid-2">
                            <div class="grid-item">
                                <h5>Access</h5>
                                <p>Request a copy of your personal data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Correction</h5>
                                <p>Request correction of inaccurate data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Deletion</h5>
                                <p>Request deletion of your personal data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Objection</h5>
                                <p>Object to processing of your data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Portability</h5>
                                <p>Request transfer of your data</p>
                            </div>
                            <div class="grid-item">
                                <h5>Withdraw Consent</h5>
                                <p>Withdraw previously given consent</p>
                            </div>
                        </div>

                        <div class="info-box">
                            <p>To exercise any of these rights, please contact us using the information provided below. We will respond to your request within the timeframe required by applicable law.</p>
                        </div>
                    </div>
                </section>

                <!-- Contact Us -->
                <section id="contact">
                    <div class="section-header">
                        <div class="section-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                        </div>
                        <h3>Contact Us</h3>
                    </div>
                    <div class="card contact-card">
                        <p>If you have any questions about this Privacy Policy or our data practices, please don't hesitate to reach out:</p>
                        
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h5>Dancoby Construction Company</h5>
                                    <p>Brooklyn, NY</p>
                                </div>
                            </div>
                            
                            <div class="contact-item">
                                <div class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h5>Email Us</h5>
                                    <p>info@dancoby.com</p>
                                </div>
                            </div>
                            
                            <div class="contact-item">
                                <div class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h5>Get in Touch</h5>
                                    <p>Visit our website for contact details</p>
                                </div>
                            </div>
                            
                            <div class="contact-item">
                                <div class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h5>Our Services</h5>
                                    <p>Interior Renovations<br>Kitchen & Bath Remodeling<br>Brownstone Restorations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>

    <script>
        // Smooth scroll to section
        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }

        // Update active navigation on scroll
        const sections = ['overview', 'collection', 'usage', 'sharing', 'cookies', 'security', 'rights', 'contact'];
        
        function updateActiveNav() {
            const scrollPosition = window.scrollY + 200;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    // Remove active class from all
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Add active class to current
                    const navItems = document.querySelectorAll('.nav-item');
                    if (navItems[i]) {
                        navItems[i].classList.add('active');
                    }
                    break;
                }
            }
        }

        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('load', updateActiveNav);
    </script>
</body>
</html>