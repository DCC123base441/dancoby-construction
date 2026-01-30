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
import Contact from './pages/Contact';
import Home from './pages/Home';
import Press from './pages/Press';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import ServiceBrownstone from './pages/ServiceBrownstone';
import ServiceInteriorRenovations from './pages/ServiceInteriorRenovations';
import ServiceKitchenBath from './pages/ServiceKitchenBath';
import ServiceTownhouses from './pages/ServiceTownhouses';
import TermsOfService from './pages/TermsOfService';
import Services from './pages/Services';
import Estimator from './pages/Estimator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Contact": Contact,
    "Home": Home,
    "Press": Press,
    "PrivacyPolicy": PrivacyPolicy,
    "ProjectDetail": ProjectDetail,
    "Projects": Projects,
    "ServiceBrownstone": ServiceBrownstone,
    "ServiceInteriorRenovations": ServiceInteriorRenovations,
    "ServiceKitchenBath": ServiceKitchenBath,
    "ServiceTownhouses": ServiceTownhouses,
    "TermsOfService": TermsOfService,
    "Services": Services,
    "Estimator": Estimator,
}

export const pagesConfig = {
    mainPage: "PrivacyPolicy",
    Pages: PAGES,
    Layout: __Layout,
};