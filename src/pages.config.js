/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminBlog from './pages/AdminBlog';
import AdminEstimates from './pages/AdminEstimates';
import AdminLeads from './pages/AdminLeads';
import Contact from './pages/Contact';
import Estimator from './pages/Estimator';
import Hiring from './pages/Hiring';
import HiringApplication from './pages/HiringApplication';
import Press from './pages/Press';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import ServiceBrownstone from './pages/ServiceBrownstone';
import ServiceInteriorRenovations from './pages/ServiceInteriorRenovations';
import ServiceKitchenBath from './pages/ServiceKitchenBath';
import ServiceTownhouses from './pages/ServiceTownhouses';
import Services from './pages/Services';
import TermsOfService from './pages/TermsOfService';
import VendorIntake from './pages/VendorIntake';
import AdminProjects from './pages/AdminProjects';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAnalytics": AdminAnalytics,
    "AdminBlog": AdminBlog,
    "AdminEstimates": AdminEstimates,
    "AdminLeads": AdminLeads,
    "Contact": Contact,
    "Estimator": Estimator,
    "Hiring": Hiring,
    "HiringApplication": HiringApplication,
    "Press": Press,
    "PrivacyPolicy": PrivacyPolicy,
    "ProjectDetail": ProjectDetail,
    "Projects": Projects,
    "ServiceBrownstone": ServiceBrownstone,
    "ServiceInteriorRenovations": ServiceInteriorRenovations,
    "ServiceKitchenBath": ServiceKitchenBath,
    "ServiceTownhouses": ServiceTownhouses,
    "Services": Services,
    "TermsOfService": TermsOfService,
    "VendorIntake": VendorIntake,
    "AdminProjects": AdminProjects,
    "Home": Home,
    "AdminDashboard": AdminDashboard,
    "AdminLogin": AdminLogin,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};