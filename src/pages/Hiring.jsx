import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, ChevronRight, FileText, Users, Shield, Car, Wrench, 
  Briefcase, TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const CheckItem = ({ children, icon: Icon = CheckCircle }) => (
  <div className="flex gap-4 mb-4">
    <Icon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="text-gray-700">{children}</div>
  </div>
);

const ArrowItem = ({ children }) => (
  <div className="flex gap-4 mb-4">
    <ChevronRight className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="text-gray-600">{children}</div>
  </div>
);

const SectionNumber = ({ number }) => (
  <span className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
    {number}
  </span>
);

export default function Hiring() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <span className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm mb-6">
              We're Hiring
            </span>
            <h1 className="text-4xl md:text-5xl font-light mb-4">Project Coordinator</h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-2">
              Project Manager-in-Training | Residential Remodeling
            </p>
            <div className="w-24 h-1 bg-white/30 mt-8" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <motion.section {...fadeIn} className="mb-16">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl">
            The Project Coordinator serves as Dancoby Construction's on-site professional representative, managing day-to-day remodeling operations while developing into a full Project Manager. This role combines hands-on field work with increasing responsibility for client relations, subcontractor coordination, and project documentation. Ideal for detail-oriented professionals who excel at managing occupied-home remodeling projects and are committed to delivering exceptional client experiences.
          </p>
        </motion.section>

        {/* Pre-Construction */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
            <SectionNumber number="1" />
            Pre-Construction Responsibilities
          </h2>
          
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Before Remodeling Begins</h3>
            <CheckItem><strong>Client Home Assessment:</strong> Conduct detailed walkthrough with homeowner, document existing conditions with photos/video, identify potential challenges (access, pets, children, valuables to protect)</CheckItem>
            <CheckItem><strong>Scope Verification:</strong> Review project plans, specifications, material selections, and finish schedules with PM and client</CheckItem>
            <CheckItem><strong>Protection Planning:</strong> Identify areas requiring protection (floors, countertops, fixtures, landscaping, driveways), plan dust barrier locations and HVAC protection</CheckItem>
            <CheckItem><strong>Access & Logistics:</strong> Confirm parking arrangements, material staging areas, dumpster/pod placement, bathroom/kitchen access during work, establish entry/exit protocols</CheckItem>
            <CheckItem><strong>Permit & Insurance:</strong> Verify all permits posted, insurance certificates current, HOA approvals obtained (if applicable)</CheckItem>
            <CheckItem><strong>Material Coordination:</strong> Confirm delivery schedules for cabinets, countertops, fixtures, flooring, tile; coordinate with client's availability for selections finalization</CheckItem>
            <CheckItem><strong>Subcontractor Scheduling:</strong> Create detailed schedule coordinating electricians, plumbers, HVAC, drywall, tile, flooring, painters; confirm scope understanding and client communication protocols</CheckItem>
            <CheckItem><strong>Client Communication Setup:</strong> Establish preferred communication methods (text, email, calls), daily update schedule, decision-making process, emergency contact procedures</CheckItem>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Throughout Remodeling Project</h3>
            <ArrowItem>Provide daily progress updates to homeowners (photos, completion status, next-day plan)</ArrowItem>
            <ArrowItem>Manage material selections and changes with client input</ArrowItem>
            <ArrowItem>Coordinate around homeowner schedules and special events</ArrowItem>
            <ArrowItem>Monitor budget and timeline, alerting PM to potential overruns early</ArrowItem>
            <ArrowItem>Conduct weekly progress meetings with clients on larger projects</ArrowItem>
          </div>
        </motion.section>

        {/* Jobsite Standards */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
            <SectionNumber number="2" />
            Jobsite Standards for Occupied Homes
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Client-Centered Site Management</h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <p><strong>Respect the Home:</strong> Treat every home as if it were your own - remove shoes when requested, use floor protection, be mindful of noise during early mornings/late afternoons</p>
                <p><strong>Dust Containment:</strong> Install and maintain plastic barriers using ZipWall or equivalent, seal HVAC vents in work areas, use HEPA filtration when sanding/cutting, daily dust cleanup before leaving</p>
                <p><strong>Daily Cleanup:</strong> Sweep and vacuum work areas, remove debris and trash daily, wipe down surfaces, leave site safe and presentable for homeowner each evening</p>
                <p><strong>Safety for Occupants:</strong> Mark and secure all hazards, keep pathways clear, no exposed nails/screws in traffic areas, ensure proper ventilation when using chemicals, notify clients of any safety concerns</p>
                <p><strong>Professional Conduct:</strong> Maintain professional appearance, use appropriate language, respect privacy (no wandering through non-work areas), handle pets appropriately, ask before using client facilities</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Remodeling-Specific Site Standards</h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <p><strong>Material Protection:</strong> Protect cabinets, countertops, appliances, and finishes during installation; properly store materials to prevent damage from household traffic</p>
                <p><strong>Working Bathroom/Kitchen:</strong> When possible, maintain functional facilities for clients; coordinate outages in advance; provide temporary solutions when needed</p>
                <p><strong>Finish Quality Focus:</strong> Pay special attention to finished surface protection during construction phase, inspect paint, tile, flooring for damage before and after each trade</p>
                <p><strong>Tight Space Management:</strong> Coordinate material deliveries to avoid overwhelming small spaces, maintain clear emergency exits, manage dust and debris in tight quarters</p>
                <p><strong>Client Belongings:</strong> Never move or touch client property without permission, document any accidentally damaged items immediately, treat furniture and belongings with extreme care</p>
              </div>
            </div>
          </div>

          <div className="bg-red-600 text-white rounded-2xl p-8 md:p-12">
            <h3 className="text-lg font-medium mb-3">Company Standard</h3>
            <p className="text-2xl md:text-3xl font-light mb-4">"Leave It Better Than You Found It"</p>
            <p className="text-gray-300">Every day, the job site should be cleaner, safer, and more organized than when you arrived. Clients should feel proud to show their project to neighbors and friends at any point during construction.</p>
          </div>
        </motion.section>

        {/* Documentation Standards */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
            <SectionNumber number="3" />
            Documentation Standards
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Daily Documentation</h3>
              <p className="text-sm text-gray-500 mb-4">Required by 6:00 PM</p>
              <p className="text-sm text-gray-600 mb-3"><strong>Daily Report in JobTread:</strong> Complete report including weather, personnel, work completed, materials, client interactions, issues, and tomorrow's plan</p>
              <p className="text-sm text-gray-600 mb-3"><strong>Photo Documentation:</strong> Minimum 10 photos per day showing site conditions, work in progress, installations, and before/after comparisons</p>
              <p className="text-sm text-gray-600"><strong>Time Tracking:</strong> Log arrival/departure times, crew hours, subcontractor hours</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client Communication</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Log every client conversation, decision, and approval in JobTread</li>
                <li>• Document all scope changes immediately - no verbal-only approvals</li>
                <li>• Send daily text/email updates with photos to clients</li>
                <li>• Record material selection confirmations</li>
                <li>• Maintain decision log for audit trail</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance & Inspections</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Schedule inspections 48 hours in advance minimum</li>
                <li>• Be present for all inspections, document results immediately</li>
                <li>• Photograph inspection tags, corrections, and final approvals</li>
                <li>• Maintain permits visible on site at all times</li>
                <li>• Track and document code compliance for client records</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Vehicle, Tools & Equipment */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
            <SectionNumber number="4" />
            Vehicle, Tools & Equipment Standards
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Vehicle</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Daily inspection before leaving for job site</li>
                <li>• Wash exterior weekly minimum</li>
                <li>• Maintain organized tool storage</li>
                <li>• Use driveway protection when needed</li>
                <li>• Follow service schedule</li>
                <li>• Professional driving - vehicle is a mobile billboard</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tools & Equipment</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Keep all tools clean, sharp, and working</li>
                <li>• Charge batteries nightly</li>
                <li>• Maintain specialized finish work tools</li>
                <li>• Use only clean, non-marking tools inside homes</li>
                <li>• Never leave tools unattended in client homes</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Material Management</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Inspect all deliveries immediately for damage</li>
                <li>• Store materials appropriately</li>
                <li>• Track material usage and waste</li>
                <li>• Coordinate returns and document credits</li>
                <li>• Protect expensive materials until installation</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Required Qualifications */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Required Qualifications</h2>
          
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <CheckItem>Minimum 2-3 years residential remodeling experience (kitchens, bathrooms, additions preferred)</CheckItem>
            <CheckItem>Valid driver's license with clean driving record</CheckItem>
            <CheckItem>Professional appearance and excellent communication skills</CheckItem>
            <CheckItem>Experience working in occupied homes with high-end finishes</CheckItem>
            <CheckItem>Ability to read and interpret architectural plans and finish schedules</CheckItem>
            <CheckItem>Skilled in finish carpentry, tile, and detail work</CheckItem>
            <CheckItem>Comfortable using smartphone/tablet for documentation and communication</CheckItem>
            <CheckItem>OSHA 10 certification (or obtain within 30 days)</CheckItem>
            <CheckItem>Physically able to lift 50+ lbs and work in various positions</CheckItem>
            <CheckItem>Professional references from previous remodeling projects</CheckItem>
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-6">Preferred Qualifications</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-medium text-gray-900 mb-3">Experience</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Lead carpenter or foreman role</li>
                <li>• Custom home or high-end remodeling</li>
                <li>• Multiple trade competencies</li>
                <li>• Client-facing project roles</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-medium text-gray-900 mb-3">Certifications</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• OSHA 30 certification</li>
                <li>• Lead-safe certification (EPA RRP)</li>
                <li>• First Aid/CPR current</li>
                <li>• Trade-specific licenses</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-medium text-gray-900 mb-3">Technical Skills</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• JobTread or similar software</li>
                <li>• Advanced finish carpentry</li>
                <li>• Tile and stone installation</li>
                <li>• Cabinet installation</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-medium text-gray-900 mb-3">Personal Attributes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exceptional client service focus</li>
                <li>• Detail-oriented perfectionist</li>
                <li>• Problem-solver mentality</li>
                <li>• Bilingual (English/Spanish) a plus</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Key Competencies */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Key Competencies for Remodeling Success</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client Relations Excellence</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Manage client expectations proactively and diplomatically</li>
                <li>• Navigate emotional aspects of remodeling</li>
                <li>• Translate technical concepts into client-friendly language</li>
                <li>• Handle complaints with empathy and solutions-focus</li>
                <li>• Build trust through transparency</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Remodeling Expertise</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Identify and solve existing home challenges</li>
                <li>• Coordinate complex finish work and sequencing</li>
                <li>• Understand material lead times</li>
                <li>• Quality control focus on finish details</li>
                <li>• Code knowledge for remodeling applications</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Coordination</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Manage multiple subcontractors in small spaces</li>
                <li>• Adapt to discoveries and changes mid-project</li>
                <li>• Balance schedule with deliveries and availability</li>
                <li>• Maintain detailed documentation</li>
                <li>• Coordinate finish selections and approvals</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Performance Metrics & Evaluation</h2>
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <p className="text-gray-600 mb-6">Success in this role will be measured by:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <CheckItem><strong>Client Satisfaction:</strong> Average rating of 4.5/5.0 or higher on project reviews</CheckItem>
              <CheckItem><strong>Documentation Compliance:</strong> 100% daily report submission by 6:00 PM, minimum 10 photos per day</CheckItem>
              <CheckItem><strong>Schedule Performance:</strong> Meet or exceed project milestones 90% of the time</CheckItem>
              <CheckItem><strong>Quality Standards:</strong> Punch list items less than 3% of total project scope</CheckItem>
              <CheckItem><strong>Safety Record:</strong> Zero incidents, consistent site safety practices</CheckItem>
              <CheckItem><strong>Budget Management:</strong> Identify cost overruns early, stay within 5% of budget on managed elements</CheckItem>
              <CheckItem><strong>Professional Conduct:</strong> Zero client complaints regarding conduct or communication</CheckItem>
              <CheckItem><strong>Change Order Management:</strong> Capture and document all scope changes, obtain approvals before proceeding</CheckItem>
              <CheckItem><strong>Subcontractor Coordination:</strong> Minimal scheduling conflicts, effective trade coordination</CheckItem>
              <CheckItem><strong>Vehicle/Equipment Care:</strong> Maintain company assets to standards, zero damage incidents</CheckItem>
            </div>
          </div>
        </motion.section>

        {/* Career Progression */}
        <motion.section {...fadeIn} className="mb-16">
          <div className="bg-red-600 text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-light mb-6">Career Progression Path</h2>
            <div className="flex items-center gap-3 flex-wrap text-lg md:text-xl mb-6">
              <span>Project Coordinator</span>
              <ChevronRight className="w-5 h-5 text-white/50" />
              <span>Assistant PM</span>
              <ChevronRight className="w-5 h-5 text-white/50" />
              <span>Project Manager</span>
              <ChevronRight className="w-5 h-5 text-white/50" />
              <span>Senior PM</span>
            </div>
            <p className="text-gray-300">Average progression timeline: 12-24 months based on performance and project complexity management</p>
          </div>
        </motion.section>

        {/* Advancement Criteria */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Advancement Criteria</h2>
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <p className="font-medium text-gray-900 mb-6">To advance to Assistant Project Manager, candidates must demonstrate:</p>
            <CheckItem icon={TrendingUp}>Consistent achievement of all performance metrics for minimum 12 months</CheckItem>
            <CheckItem icon={TrendingUp}>Successful solo management of 3+ remodeling projects from start to completion</CheckItem>
            <CheckItem icon={TrendingUp}>Proven client relationship management with excellent feedback</CheckItem>
            <CheckItem icon={TrendingUp}>Mastery of JobTread documentation and workflow systems</CheckItem>
            <CheckItem icon={TrendingUp}>Ability to manage project budgets and identify cost-saving opportunities</CheckItem>
            <CheckItem icon={TrendingUp}>Leadership in mentoring new field team members</CheckItem>
            <CheckItem icon={TrendingUp}>Completion of required certifications (OSHA 30, Lead-Safe, etc.)</CheckItem>
            <CheckItem icon={TrendingUp}>Demonstrated problem-solving in challenging remodeling situations</CheckItem>
            <CheckItem icon={TrendingUp}>Strong recommendation from supervising Project Manager</CheckItem>
            <CheckItem icon={TrendingUp}>Ability to independently manage client communications and expectations</CheckItem>
          </div>
        </motion.section>

        {/* Professional Development */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Professional Development Opportunities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Mentorship Program', desc: 'Direct mentorship from experienced PMs on active projects' },
              { title: 'Increasing Responsibility', desc: 'Gradual progression from field oversight to budget management to full project ownership' },
              { title: 'Estimating Training', desc: 'Participate in estimating and bidding processes for upcoming projects' },
              { title: 'Client Presentation Skills', desc: 'Opportunities to present project updates and proposals with PM support' },
              { title: 'Software Proficiency', desc: 'Comprehensive training on JobTread, scheduling tools, and budget management systems' },
              { title: 'Industry Certifications', desc: 'Company-supported certification in remodeling, project management, trade-specific skills' },
              { title: 'Continuing Education', desc: 'Reimbursement for relevant courses, seminars, and industry events' },
              { title: 'Leadership Development', desc: 'Training in team management, conflict resolution, and client relations' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why Dancoby */}
        <motion.section {...fadeIn} className="mb-16">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Why Dancoby?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dancoby Construction Company specializes in high-end residential remodeling where quality, client experience, and professional execution define our reputation. We invest in our people, provide clear career paths, and support professional growth at every level.
            </p>
            <p className="font-medium text-gray-900 mb-4">This position is designed for individuals who:</p>
            <ul className="text-gray-600 space-y-2">
              <li>• Take pride in exceptional craftsmanship and client service</li>
              <li>• Want to build a long-term career in remodeling project management</li>
              <li>• Value continuous learning and professional development</li>
              <li>• Thrive in dynamic, client-focused environments</li>
              <li>• Are committed to Dancoby's standards of excellence</li>
            </ul>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeIn} className="text-center py-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to Join Our Team?</h2>
          <p className="text-gray-600 mb-8">Apply today and start your career with Dancoby Construction</p>
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-lg">
            <Link to={createPageUrl('Contact')}>Apply Now</Link>
          </Button>
        </motion.section>
      </div>
    </div>
  );
}