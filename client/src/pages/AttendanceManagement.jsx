import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AttendanceManagement = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({});
    const [message, setMessage] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/teacher/courses', config);
                setCourses(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const fetchStudents = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/teacher/enrolled-students/${selectedCourse}`, config);
                    setStudents(data);
                } catch (err) {
                    console.error(err);
                    setStudents([]);
                }
            };
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedCourse]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData({ ...attendanceData, [studentId]: status });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!date) {
            setMessage('❌ Please select a date');
            return;
        }

        if (Object.keys(attendanceData).length === 0) {
            setMessage('❌ Please mark attendance for at least one student');
            return;
        }

        try {
            let successCount = 0;
            let errorCount = 0;

            for (const studentId of Object.keys(attendanceData)) {
                try {
                    await axios.post('http://localhost:5000/api/teacher/attendance', {
                        student_id: studentId,
                        course_id: selectedCourse,
                        date: date,
                        status: attendanceData[studentId]
                    }, config);
                    successCount++;
                } catch (err) {
                    console.error(err);
                    errorCount++;
                }
            }

            if (errorCount === 0) {
                setMessage(`✅ Attendance marked successfully for ${successCount} students`);
                setAttendanceData({});
            } else {
                setMessage(`⚠️ Attendance marked for ${successCount} students, ${errorCount} failed`);
            }
        } catch (err) {
            setMessage('❌ Error marking attendance');
        }
    };

    const markAll = (status) => {
        const newData = {};
        students.forEach(student => {
            newData[student._id] = status;
        });
        setAttendanceData(newData);
    };

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="teacher" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">Mark Attendance</h1>

                        {message && (
                            <div className={`p-4 rounded-lg mb-6 animate-slideInRight ${message.includes('✅')
                                    ? 'bg-[#10B981] text-white'
                                    : message.includes('⚠️')
                                        ? 'bg-[#F59E0B] text-white'
                                        : 'bg-[#EF4444] text-white'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Course Selection */}
                        <div className="card-dark p-6 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Select Course & Date</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Course</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="input-dark"
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.course_name} ({course.course_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="input-dark"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student List */}
                        {selectedCourse && students.length > 0 && (
                            <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-[#E2E8F0]">Students ({students.length})</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => markAll('Present')}
                                            className="btn-success text-sm"
                                        >
                                            Mark All Present
                                        </button>
                                        <button
                                            onClick={() => markAll('Absent')}
                                            className="btn-danger text-sm"
                                        >
                                            Mark All Absent
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#1E293B]">
                                                <th className="p-3 text-[#94A3B8] font-semibold">Roll No</th>
                                                <th className="p-3 text-[#94A3B8] font-semibold">Name</th>
                                                <th className="p-3 text-[#94A3B8] font-semibold">Email</th>
                                                <th className="p-3 text-[#94A3B8] font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                    <td className="p-3 text-[#E2E8F0]">{student.user_id?.roll_number || 'N/A'}</td>
                                                    <td className="p-3 text-[#E2E8F0] font-medium">{student.user_id?.name}</td>
                                                    <td className="p-3 text-[#94A3B8]">{student.user_id?.email}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Present')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Present'
                                                                        ? 'bg-[#10B981] text-white shadow-lg'
                                                                        : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#10B981]/20 hover:text-[#10B981]'
                                                                    }`}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Absent')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Absent'
                                                                        ? 'bg-[#EF4444] text-white shadow-lg'
                                                                        : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#EF4444]/20 hover:text-[#EF4444]'
                                                                    }`}
                                                            >
                                                                Absent
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Leave')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Leave'
                                                                        ? 'bg-[#F59E0B] text-white shadow-lg'
                                                                        : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#F59E0B]/20 hover:text-[#F59E0B]'
                                                                    }`}
                                                            >
                                                                Leave
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleSubmit}
                                        className="btn-primary"
                                    >
                                        Submit Attendance
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedCourse && students.length === 0 && (
                            <div className="card-dark p-6 text-center">
                                <p className="text-[#64748B]">No students enrolled in this course</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AttendanceManagement;
