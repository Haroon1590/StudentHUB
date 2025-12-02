import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalFees: 0,
        paidFees: 0,
        unpaidFees: 0
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data: users } = await axios.get('http://localhost:5000/api/admin/users', config);
            const students = users.filter(u => u.role === 'student').length;
            const teachers = users.filter(u => u.role === 'teacher').length;

            const { data: courses } = await axios.get('http://localhost:5000/api/admin/courses', config);

            const { data: fees } = await axios.get('http://localhost:5000/api/admin/fees', config);
            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);

            setStats({
                totalStudents: students,
                totalTeachers: teachers,
                totalCourses: courses.length,
                totalFees,
                paidFees,
                unpaidFees: totalFees - paidFees
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };

    const StatCard = ({ title, value, icon, color, delay }) => (
        <div className={`card-dark card-hover p-6 animate-fadeInUp`} style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[#94A3B8] text-sm font-medium mb-2">{title}</p>
                    <p className={`text-4xl font-bold text-${color}`}>{value}</p>
                </div>
                <div className={`w-16 h-16 bg-${color}/10 rounded-2xl flex items-center justify-center border border-${color}/20`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 animate-fadeInUp">
                            <div>
                                <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Admin Dashboard</h1>
                                <p className="text-[#94A3B8]">Welcome back! Here's your overview</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-danger flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                </svg>
                                Logout
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Total Students"
                                value={stats.totalStudents}
                                color="[#3B82F6]"
                                delay={0}
                                icon={
                                    <svg className="w-8 h-8 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Total Teachers"
                                value={stats.totalTeachers}
                                color="[#10B981]"
                                delay={0.1}
                                icon={
                                    <svg className="w-8 h-8 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Total Courses"
                                value={stats.totalCourses}
                                color="[#4F46E5]"
                                delay={0.2}
                                icon={
                                    <svg className="w-8 h-8 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Fee Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Fees"
                                value={`₹${stats.totalFees.toLocaleString()}`}
                                color="[#3B82F6]"
                                delay={0.3}
                                icon={
                                    <svg className="w-8 h-8 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Paid Fees"
                                value={`₹${stats.paidFees.toLocaleString()}`}
                                color="[#10B981]"
                                delay={0.4}
                                icon={
                                    <svg className="w-8 h-8 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Unpaid Fees"
                                value={`₹${stats.unpaidFees.toLocaleString()}`}
                                color="[#EF4444]"
                                delay={0.5}
                                icon={
                                    <svg className="w-8 h-8 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AdminDashboard;
