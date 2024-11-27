import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactSection from '../ContactSection';
import { 
  Calendar, 
  Info, 
  Clock, 
  Globe, 
  FileText, 
  ChevronRight 
} from 'lucide-react';

const LUSIPLandingPage = () => {
    const navigate = useNavigate();
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center px-4 bg-gradient-to-br from-sky-400 to-sky-500">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-md">
            LUSIP - 2024
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            The LNMIIT Undergraduate Summer Internship Program
          </p>
          <button 
            onClick={navigateToProjects} 
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-full font-semibold text-base sm:text-lg 
                      transition-all duration-300 hover:bg-blue-50 hover:shadow-xl 
                      transform hover:scale-105 inline-flex items-center group"
          >
            Apply Now
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-8 space-x-4">
            <Info className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">About the Program</h2>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            LUSIP announces its 12th edition for the year 2024. This program offers an invaluable platform to engage in cutting-edge research 
            and challenging projects with esteemed faculty and mentors of The LNM Institute of Information Technology. 
            It's a unique opportunity to gain practical experience and insight into professional life, 
            available to undergraduate students across the world.
          </p>
        </div>
      </section>

      {/* Instructions Section */}
      <section id="instructions" className="py-16 sm:py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-8 space-x-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">Program Instructions</h2>
          </div>
          <ul className="space-y-3 text-base sm:text-lg text-gray-700">
            {[
              { icon: Clock, text: "Project duration is 2 months" },
              { icon: Globe, text: "Open to students worldwide who meet prerequisites" },
              { icon: FileText, text: "One project registration with two priority choices" },
              { icon: Calendar, text: "Most projects require on-campus presence" },
            ].map(({ icon: Icon, text }, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Additional Costs for External Students</h3>
            <div className="space-y-1">
              <p className="text-gray-700 flex items-center">
                <li className="font-medium mr-2">Hostel Charges:</li>
                Approximately ₹21,000 for 2 months
              </p>
              <p className="text-gray-700 flex items-center">
                <li className="font-medium mr-2">Mess Charges:</li>
                Approximately ₹8,000 for 2 months
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates Section */}
      <section id="dates" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-8 space-x-4">
            <Calendar className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">Important Dates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Student Application Opens", date: "20th April 2024" },
              { title: "Student Application Ends", date: "10th May 2024" },
              { title: "Results Announced", date: "20th May 2024" },
              { title: "Project Starts", date: "27th May 2024" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-blue-50 border border-blue-100 p-5 rounded-lg 
                           hover:bg-blue-100 transition-colors group"
              >
                <h3 className="font-semibold mb-2 text-blue-600 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <p className="text-gray-700 font-medium">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection/>
    </div>
  );
};

export default LUSIPLandingPage;