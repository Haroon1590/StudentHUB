import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import axios from 'axios';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/teacher/courses', config);
            setCourses(data);

            let totalStudents = 0;
            for (const course of data) {
                try {
                    const { data: students } = await axios.get(
                        `http://localhost:5000/api/teacher/enrolled-students/${course._id}`,
                        config
                    );
                    totalStudents += students.length;
                } catch (err) {
                    console.error(`Error fetching students for course ${course._id}:`, err);
                }
            }

            setStats({
                totalCourses: data.length,
                totalStudents
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="teacher" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 animate-fadeInUp">
                            <div>
                                <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Teacher Dashboard</h1>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="card-dark card-hover p-6 animate-fadeInUp">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#94A3B8] text-sm font-medium mb-2">Total Courses</p>
                                        <p className="text-4xl font-bold text-[#4F46E5]">{stats.totalCourses}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-2xl flex items-center justify-center border border-[#4F46E5]/20">
                                        <svg className="w-8 h-8 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#94A3B8] text-sm font-medium mb-2">Total Students</p>
                                        <p className="text-4xl font-bold text-[#10B981]">{stats.totalStudents}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20">
                                        <svg className="w-8 h-8 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Courses */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Assigned Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map((course, index) => (
                                    <div
                                        key={course._id}
                                        className="bg-[#1E293B] p-4 rounded-lg border border-[#334155] hover:border-[#4F46E5] transition-all duration-300 hover:shadow-lg hover:shadow-[#4F46E5]/10"
                                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-[#E2E8F0]">{course.course_name}</h3>
                                            <span className="bg-[#4F46E5]/20 text-[#4F46E5] text-xs px-2 py-1 rounded border border-[#4F46E5]/30">
                                                {course.course_id}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-[#94A3B8]">
                                                <span className="text-[#64748B]">Credits:</span> {course.credit_hours}
                                            </p>
                                            <p className="text-[#94A3B8]">
                                                <span className="text-[#64748B]">Semester:</span> {course.semester}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {courses.length === 0 && (
                                <p className="text-center text-[#64748B] py-8">No courses assigned yet</p>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default TeacherDashboard;
