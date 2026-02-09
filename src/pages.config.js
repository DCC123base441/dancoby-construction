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
import ActiveProjects from './pages/ActiveProjects';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminBlog from './pages/AdminBlog';
import AdminChatBot from './pages/AdminChatBot';
import AdminCurrentProjects from './pages/AdminCurrentProjects';
import AdminDashboard from './pages/AdminDashboard';
import AdminEmployees from './pages/AdminEmployees';
import AdminEstimates from './pages/AdminEstimates';
import AdminHolidays from './pages/AdminHolidays';
import AdminJobTread from './pages/AdminJobTread';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';
import AdminProjects from './pages/AdminProjects';
import AdminShop from './pages/AdminShop';
import AdminTestimonials from './pages/AdminTestimonials';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import CustomerPortal from './pages/CustomerPortal';
import EmployeePortal from './pages/EmployeePortal';
import Estimator from './pages/Estimator';
import FAQ from './pages/FAQ';
import Hiring from './pages/Hiring';
import HiringApplication from './pages/HiringApplication';
import Home from './pages/Home';
import PortalLogin from './pages/PortalLogin';
import Press from './pages/Press';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import ServiceBrownstone from './pages/ServiceBrownstone';
import ServiceInteriorRenovations from './pages/ServiceInteriorRenovations';
import ServiceKitchenBath from './pages/ServiceKitchenBath';
import ServiceTownhouses from './pages/ServiceTownhouses';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Step from './pages/Step';
import StepBuilder from './pages/StepBuilder';
import StepDashboard from './pages/StepDashboard';
import StepSuccess from './pages/StepSuccess';
import StepSummary from './pages/StepSummary';
import TermsOfService from './pages/TermsOfService';
import VendorIntake from './pages/VendorIntake';
import AdminNews from './pages/AdminNews';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "ActiveProjects": ActiveProjects,
    "AdminAnalytics": AdminAnalytics,
    "AdminBlog": AdminBlog,
    "AdminChatBot": AdminChatBot,
    "AdminCurrentProjects": AdminCurrentProjects,
    "AdminDashboard": AdminDashboard,
    "AdminEmployees": AdminEmployees,
    "AdminEstimates": AdminEstimates,
    "AdminHolidays": AdminHolidays,
    "AdminJobTread": AdminJobTread,
    "AdminLeads": AdminLeads,
    "AdminLogin": AdminLogin,
    "AdminProjects": AdminProjects,
    "AdminShop": AdminShop,
    "AdminTestimonials": AdminTestimonials,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Contact": Contact,
    "CustomerPortal": CustomerPortal,
    "EmployeePortal": EmployeePortal,
    "Estimator": Estimator,
    "FAQ": FAQ,
    "Hiring": Hiring,
    "HiringApplication": HiringApplication,
    "Home": Home,
    "PortalLogin": PortalLogin,
    "Press": Press,
    "PrivacyPolicy": PrivacyPolicy,
    "ProjectDetail": ProjectDetail,
    "Projects": Projects,
    "ServiceBrownstone": ServiceBrownstone,
    "ServiceInteriorRenovations": ServiceInteriorRenovations,
    "ServiceKitchenBath": ServiceKitchenBath,
    "ServiceTownhouses": ServiceTownhouses,
    "Services": Services,
    "Shop": Shop,
    "Step": Step,
    "StepBuilder": StepBuilder,
    "StepDashboard": StepDashboard,
    "StepSuccess": StepSuccess,
    "StepSummary": StepSummary,
    "TermsOfService": TermsOfService,
    "VendorIntake": VendorIntake,
    "AdminNews": AdminNews,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};