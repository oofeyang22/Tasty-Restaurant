import ContactForm from "../components/Contact";
import { FaMapMarkerAlt } from 'react-icons/fa'
import { FaPhone, FaEnvelope } from 'react-icons/fa6'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 text-gray-800 py-16 md:py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl sm:text-6xl font-extrabold
         text-cyan-400 mb-12 md:mb-16 text-center leading-tight">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-600 mb-6">
              Restaurant Info
            </h2>

            <div className="space-y-4 text-lg">
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt style={{ color: 'red', fontSize: '24px' }} />
                <span>Location: Osogbo, Osun</span>
              </p>

              <p className="flex items-center gap-3">
                <FaPhone style={{ color: "blue", fontSize: '24px' }}/>
                <span>Phone: +234 810 7726 872</span>
              </p>

              <p className="flex items-center gap-3">
                <FaEnvelope style={{ color: "gray", fontSize: '24px' }}/>
                <span>Email: olaitanferanmi41@@gmail.com</span>
              </p>
            </div>

            <p className="text-gray-700 mt-8 text-lg leading-relaxed">
              We would love to hear from you. Whether you have a question, feedback, 
              or just want to say hello — feel free to send us a message!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-amber-100">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}