import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, Home, Instagram, Facebook, Linkedin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-slate-600 relative overflow-hidden py-16"
      style={{ backgroundColor: "#F4F7FC" }}
    >
      {/* Blueprint grid overlay backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#2563eb 1px, transparent 1px),
            linear-gradient(90deg, #2563eb 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container max-w-7xl mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left section: Info & Contact Cards */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                nestnode
              </span>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-sm">
              India's new era of student living. Verified hostels, PGs and apartments — with home-style meals in hostels and PGs, and self-cook apartments for those who want their space.
            </p>

            {/* White Contact Box */}
            <div className="bg-white p-5 rounded-[1.8rem] shadow-[0_15px_30px_rgba(15,23,42,0.03)] border border-slate-100/80 space-y-4 max-w-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">CALL US - 9AM-9PM</p>
                  <p className="text-sm font-black text-slate-800">+91 78599 88312</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">EMAIL US</p>
                  <p className="text-sm font-black text-slate-800">support@nestnode.com</p>
                </div>
              </div>
            </div>

            {/* Social pills */}
            <div className="flex gap-2.5 pt-2">
              {[
                { icon: Instagram, name: "IG" },
                { icon: Facebook, name: "FB" },
                { icon: Linkedin, name: "IN" },
                { icon: () => <span className="font-black text-xs">X</span>, name: "X" }
              ].map((social, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-slate-500 shadow-sm"
                >
                  <social.icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Links Grid */}
          <div className="lg:col-span-6 flex flex-wrap sm:flex-nowrap gap-16 lg:gap-24 text-left">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">COMPANY</h4>
                <div className="w-5 h-0.5 bg-blue-600 rounded-full" />
              </div>
              <ul className="space-y-3 text-sm font-bold text-slate-500">
                <li><Link to="/about" className="hover:text-blue-600 transition-colors">Our Story</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
                <li>
                  <a
                    href="https://nestnode-docs.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    Documentation <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 - LEGAL */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">LEGAL</h4>
                <div className="w-5 h-0.5 bg-blue-600 rounded-full" />
              </div>
              <ul className="space-y-3 text-sm font-bold text-slate-500">
                <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-blue-600 transition-colors">Refund Policy</Link></li>
                <li><Link to="/booking-policy" className="hover:text-blue-600 transition-colors">Booking Policy</Link></li>
                <li><Link to="/equality" className="hover:text-blue-600 transition-colors">Non-discrimination</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
