import { useState, useEffect } from "react";

function ContactUs() {
  const [phoneNumbers, setPhoneNumbers] = useState({ shiva: "", vinay: "" });

  useEffect(() => {
    // Helper to generate a random 10-digit Indian phone number
    const generateRandomPhone = () => {
      const startsWith = ["9", "8", "7", "6"];
      const firstDigit = startsWith[Math.floor(Math.random() * startsWith.length)];
      let restOfNumber = "";
      for (let i = 0; i < 9; i++) {
        if (i === 4) restOfNumber += " "; // format with a space for readability
        restOfNumber += Math.floor(Math.random() * 10);
      }
      return `+91 ${firstDigit}${restOfNumber}`;
    };

    setPhoneNumbers({
      shiva: generateRandomPhone(),
      vinay: generateRandomPhone(),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeIn border border-white">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="bg-green-100 text-green-800 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider border border-green-200">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight text-slate-850">
            Contact <span className="text-green-600">Us</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
            Need support with your vehicle rental? Reach out to our dedicated coordinators directly for assistance.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card for Shiva */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl shadow-inner">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Shiva</h3>
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Operations Manager
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Handles vehicle deliveries, keys, drop-offs, and general assistance during rental periods.
              </p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <a 
                href={`tel:${phoneNumbers.shiva.replace(/\s+/g, "")}`} 
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{phoneNumbers.shiva || "Loading..."}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>shiva@vehiclerent.com</span>
              </div>
            </div>
          </div>

          {/* Card for Vinay */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
                  V
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Vinay</h3>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Booking Coordinator
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Handles booking approvals, cancellations, document verification, and refund requests.
              </p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <a 
                href={`tel:${phoneNumbers.vinay.replace(/\s+/g, "")}`} 
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{phoneNumbers.vinay || "Loading..."}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>vinay@vehiclerent.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Location Section in Contact Us Page */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-800">Primary Pick-up Location</h4>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Vehicles are parked and available for pick-up at: <span className="font-semibold text-green-700">Yamnampet, Gatkesar</span>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
