import React from "react";
import "./Login.scss";

const Login: React.FC = () => {
    return (
        <div className="bg-screen h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-4">
                  
                    <h2 className="text-2xl font-bold">Admin Log in</h2>
                </div>
                <form>
                    <div className="mb-4">
                        
                        <input
                            type="text"
                            id="mobileNumber"
                            className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter mobile number"
                        />
                    </div>
                    <div className="mb-4">
                       
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter password"
                        />
                    </div>

                    <div
                className=" me-16 text-sm text-black my-6 "
              
              >
                Forgot Password?
              </div>
                    <div className="flex justify-between mb-4">
                        <button type="submit" className="login-btn text-white w-full font-bold py-2 px-4 rounded-3xl">
                            Login
                        </button>
                     
                    </div>
                    <div className="text-center">
                        <button type="button" className=" text-gray-700 font-bold py-2 px-4 rounded-3xl border w-full">
                            Connect with Google
                        </button>
                        <p className="my-3">OR</p>
                        <button type="button" className="text-blue font-bold py-2 px-4 rounded-3xl border w-full">
                            Login using OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
