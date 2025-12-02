import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import axios from 'axios';

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        attendancePercentage: 0,
        presentCount: 0,
        absentCount: 0,
        totalClasses: 0,
        feeStatus: 'Clear',
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
            const { data: attendance } = await axios.get('http://localhost:5000/api/student/attendance', config);
            const { data: fees } = await axios.get('http://localhost:5000/api/student/fees', config);

            const presentCount = attendance.filter(a => a.status === 'Present').length;
            const absentCount = attendance.filter(a => a.status === 'Absent').length;
            const totalClasses = attendance.length;
            const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
            const unpaidFees = totalFees - paidFees;

            setStats({
                attendancePercentage,
                presentCount,
                absentCount,
                totalClasses,
                feeStatus: unpaidFees === 0 ? 'Clear' : 'Pending',
                totalFees,
                paidFees,
                unpaidFees
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
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 animate-fadeInUp">
                            <div>
                                <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Student Dashboard</h1>
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

                        {/* Attendance Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Attendance"
                                value={`${stats.attendancePercentage}%`}
                                color={
                                    stats.attendancePercentage >= 75 ? '[#10B981]' :
                                        stats.attendancePercentage >= 50 ? '[#F59E0B]' : '[#EF4444]'
                                }
                                delay={0}
                                icon={
                                    <svg className={`w-8 h-8 ${stats.attendancePercentage >= 75 ? 'text-[#10B981]' :
                                            stats.attendancePercentage >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                                        }`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Present"
                                value={stats.presentCount}
                                color="[#10B981]"
                                delay={0.1}
                                icon={
                                    <svg className="w-8 h-8 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Absent"
                                value={stats.absentCount}
                                color="[#EF4444]"
                                delay={0.2}
                                icon={
                                    <svg className="w-8 h-8 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Total Classes"
                                value={stats.totalClasses}
                                color="[#3B82F6]"
                                delay={0.3}
                                icon={
                                    <svg className="w-8 h-8 text-[#3B82F6]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Fee Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard
                                title="Fee Status"
                                value={stats.feeStatus}
                                color={stats.feeStatus === 'Clear' ? '[#10B981]' : '[#EF4444]'}
                                delay={0.4}
                                icon={
                                    <svg className={`w-8 h-8 ${stats.feeStatus === 'Clear' ? 'text-[#10B981]' : 'text-[#EF4444]'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Total Fees"
                                value={`₹${stats.totalFees.toLocaleString()}`}
                                color="[#3B82F6]"
                                delay={0.5}
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
                                delay={0.6}
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
                                delay={0.7}
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

export default StudentDashboard;
