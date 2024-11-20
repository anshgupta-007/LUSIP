import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* <nav className="bg-blue-600 p-4 fixed w-full z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-xl font-bold text-white">The LNMIIT JAIPUR</div>
          <div className="space-x-6">
            <button onClick={() => scrollToSection('about')} className="text-white hover:text-blue-100">About</button>
            <button onClick={() => scrollToSection('instructions')} className="text-white hover:text-blue-100">Instructions</button>
            <button onClick={() => scrollToSection('dates')} className="text-white hover:text-blue-100">Important Dates</button>
            <button onClick={() => scrollToSection('contact')} className="text-white hover:text-blue-100">Contact</button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center px-4 bg-blue-600">
        <div>
          <h1 className="text-5xl font-bold mb-4 text-white">LUSIP - 2024</h1>
          <p className="text-xl mb-8 text-white">LUSIP - The LNMIIT Undergraduate Summer Internship Program</p>
          <a 
            onClick={navigateToProjects} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg 
                      transition-all duration-300 hover:bg-blue-50 hover:transform hover:scale-105
                      shadow-lg hover:shadow-xl"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">About the Program</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            LUSIP announces its 12th edition for the year 2024. LUSIP offers you an invaluable platform to engage in cutting edge research and 
            challenging projects with the esteemed faculty and mentors of The LNM Institute of Information Technology. 
            It is a unique opportunity to gain practical experience and insight into professional life. 
            The program is available to all undergraduate students across the world. The projects are mostly offered in offline mode 
            and only a few are offered in online mode.
          </p>
        </div>
      </section>

      {/* Instructions Section */}
      <section id="instructions" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Instructions for students</h2>
          <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
            <li>The project duration is 2 months.</li>
            <li>The project will be open for everyone in the world, if he/she fulfills the prerequisites.</li>
            <li>A student can register for only one project and he/she can give two choices according to his/her priority.</li>
            <li>Most of the projects would require the students to be present on campus for the entire project duration.</li>
            <li>Hostel charges for the external students will be Rs around 21,000 for 2 months</li>
            <li>Mess charges for the external students will be Rs around 8,000 for 2 months duration.</li>
          </ul>
        </div>
      </section>

      {/* Important Dates Section */}
      <section id="dates" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Important Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-blue-100 p-6 rounded-lg hover:border-blue-200 transition-colors">
              <h3 className="font-semibold mb-2 text-blue-600">Student Application Opens</h3>
              <p className="text-gray-700">20th April 2024</p>
            </div>
            <div className="border-2 border-blue-100 p-6 rounded-lg hover:border-blue-200 transition-colors">
              <h3 className="font-semibold mb-2 text-blue-600">Student Application Ends On</h3>
              <p className="text-gray-700">10th May 2024</p>
            </div>
            <div className="border-2 border-blue-100 p-6 rounded-lg hover:border-blue-200 transition-colors">
              <h3 className="font-semibold mb-2 text-blue-600">Results</h3>
              <p className="text-gray-700">20th May 2024</p>
            </div>
            <div className="border-2 border-blue-100 p-6 rounded-lg hover:border-blue-200 transition-colors">
              <h3 className="font-semibold mb-2 text-blue-600">Project Starts</h3>
              <p className="text-gray-700">27th May 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Contact Us</h2>
          <p className="text-lg text-gray-700">
            Send in your queries at{' '}
            <a href="mailto:sandeep.saini@lnmiit.ac.in" className="text-blue-600 hover:text-blue-700 underline">
              sandeep.saini@lnmiit.ac.in
            </a>
            {' '}or{' '}
            <a href="mailto:harshvardhan.kumar@lnmiit.ac.in" className="text-blue-600 hover:text-blue-700 underline">
              harshvardhan.kumar@lnmiit.ac.in
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default LUSIPLandingPage;