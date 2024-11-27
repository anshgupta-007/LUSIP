import React from 'react'

const ContactSection = () => {
  return (
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
  )
}

export default ContactSection