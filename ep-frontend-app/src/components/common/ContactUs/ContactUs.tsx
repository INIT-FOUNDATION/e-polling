import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="p-10"style={{backgroundColor:'#F9F3FD'}}>
      <div className="border-2 border-gray-200 p-6 rounded-lg">
        <div className="flex justify-center items-center text-[39.2px]" style={{ color: '#454849' }}>
          Reach out to us in case you have any doubts
        </div>
        <form className="mt-6 space-y-4 px-10">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="message" className="text-gray-700">Message</label>
            <input
              id="message"
              name="message"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            ></input>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
