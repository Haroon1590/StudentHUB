import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/attendance', config);
                setAttendance(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAttendance();
    }, []);

    // Calculate statistics
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const absentCount = attendance.filter(a => a.status === 'Absent').length;
    const leaveCount = attendance.filter(a => a.status === 'Leave').length;
    const totalClasses = attendance.length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">My Attendance</h1>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-dark card-hover p-6 animate-fadeInUp">
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Attendance %</h3>
                                <p className={`text-3xl font-bold ${attendancePercentage >= 75 ? 'text-[#10B981]' :
                                        attendancePercentage >= 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                                    }`}>{attendancePercentage}%</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Present</h3>
                                <p className="text-3xl font-bold text-[#10B981]">{presentCount}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Absent</h3>
                                <p className="text-3xl font-bold text-[#EF4444]">{absentCount}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Leave</h3>
                                <p className="text-3xl font-bold text-[#F59E0B]">{leaveCount}</p>
                            </div>
                        </div>

                        {/* Attendance History */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Attendance History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#1E293B]">
                                            <th className="p-3 text-[#94A3B8] font-semibold">Date</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Course</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((record) => (
                                            <tr key={record._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                <td className="p-3 text-[#E2E8F0]">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-[#94A3B8]">
                                                    {record.course_id?.course_name || 'N/A'}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${record.status === 'Present'
                                                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                                            : record.status === 'Absent'
                                                                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                                                                : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {attendance.length === 0 && (
                                    <p className="text-center text-[#64748B] py-8">No attendance records found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MyAttendance;
