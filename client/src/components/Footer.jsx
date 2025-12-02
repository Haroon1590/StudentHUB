import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#11182B] text-[#E2E8F0] mt-auto border-t border-[#1E293B]">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="animate-fadeInUp">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#E2E8F0]">
                            <svg className="w-6 h-6 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            Student Portal
                        </h3>
                        <p className="text-[#94A3B8] leading-relaxed">
                            A comprehensive platform for managing student attendance, results, and fees efficiently.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-xl font-bold mb-4 text-[#E2E8F0]">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
                                    Contact Support
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors duration-200 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-xl font-bold mb-4 text-[#E2E8F0]">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span className="text-[#94A3B8]">support@studentportal.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span className="text-[#94A3B8]">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#94A3B8]">123 Education Street, City, State 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#1E293B] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#94A3B8] text-sm">
                        © {currentYear} Student Attendance Portal. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-[#64748B] hover:text-[#4F46E5] transition-all duration-300 hover:scale-110">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="#" className="text-[#64748B] hover:text-[#4F46E5] transition-all duration-300 hover:scale-110">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                        <a href="#" className="text-[#64748B] hover:text-[#4F46E5] transition-all duration-300 hover:scale-110">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
