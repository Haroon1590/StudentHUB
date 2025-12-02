import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ResultManagement = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [examType, setExamType] = useState('quiz');
    const [resultData, setResultData] = useState({
        quiz1: 0,
        quiz2: 0,
        assignment1: 0,
        assignment2: 0,
        midterm: 0,
        final_exam: 0
    });
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

    const handleChange = (e) => {
        setResultData({ ...resultData, [e.target.name]: parseInt(e.target.value) || 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await axios.post('http://localhost:5000/api/teacher/results', {
                student_id: selectedStudent,
                course_id: selectedCourse,
                ...resultData
            }, config);

            setMessage('✅ Result uploaded successfully');
            setResultData({
                quiz1: 0,
                quiz2: 0,
                assignment1: 0,
                assignment2: 0,
                midterm: 0,
                final_exam: 0
            });
            setSelectedStudent('');
        } catch (err) {
            console.error(err);
            setMessage('❌ Error uploading result: ' + (err.response?.data?.message || err.message));
        }
    };

    const getExamFields = () => {
        switch (examType) {
            case 'quiz':
                return (
                    <>
                        <div>
                            <label className="block mb-2 font-medium text-[#E2E8F0]">Quiz 1 (out of 10)</label>
                            <input
                                type="number"
                                name="quiz1"
                                value={resultData.quiz1}
                                onChange={handleChange}
                                className="input-dark"
                                min="0"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[#E2E8F0]">Quiz 2 (out of 10)</label>
                            <input
                                type="number"
                                name="quiz2"
                                value={resultData.quiz2}
                                onChange={handleChange}
                                className="input-dark"
                                min="0"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[#E2E8F0]">Assignment 1 (out of 10)</label>
                            <input
                                type="number"
                                name="assignment1"
                                value={resultData.assignment1}
                                onChange={handleChange}
                                className="input-dark"
                                min="0"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[#E2E8F0]">Assignment 2 (out of 10)</label>
                            <input
                                type="number"
                                name="assignment2"
                                value={resultData.assignment2}
                                onChange={handleChange}
                                className="input-dark"
                                min="0"
                                max="10"
                            />
                        </div>
                    </>
                );
            case 'mid':
                return (
                    <div>
                        <label className="block mb-2 font-medium text-[#E2E8F0]">Midterm (out of 30)</label>
                        <input
                            type="number"
                            name="midterm"
                            value={resultData.midterm}
                            onChange={handleChange}
                            className="input-dark"
                            min="0"
                            max="30"
                        />
                    </div>
                );
            case 'final':
                return (
                    <div>
                        <label className="block mb-2 font-medium text-[#E2E8F0]">Final Exam (out of 40)</label>
                        <input
                            type="number"
                            name="final_exam"
                            value={resultData.final_exam}
                            onChange={handleChange}
                            className="input-dark"
                            min="0"
                            max="40"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="teacher" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">Upload Results</h1>

                        {message && (
                            <div className={`p-4 rounded-lg mb-6 animate-slideInRight ${message.includes('✅')
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-[#EF4444] text-white'
                                }`}>
                                {message}
                            </div>
                        )}

                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Enter Student Results</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Course Selection */}
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Course</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.course_name} ({course.course_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Student Selection */}
                                {selectedCourse && (
                                    <div>
                                        <label className="block mb-2 font-medium text-[#E2E8F0]">Student</label>
                                        <select
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            className="input-dark"
                                            required
                                        >
                                            <option value="">-- Select Student --</option>
                                            {students.map(student => (
                                                <option key={student._id} value={student._id}>
                                                    {student.user_id?.name} ({student.user_id?.roll_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Exam Type Selection */}
                                {selectedStudent && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Exam Type</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setExamType('quiz')}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${examType === 'quiz'
                                                            ? 'bg-[#4F46E5] text-white shadow-lg'
                                                            : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#4F46E5]/20 hover:text-[#4F46E5]'
                                                        }`}
                                                >
                                                    Quizzes & Assignments
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setExamType('mid')}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${examType === 'mid'
                                                            ? 'bg-[#4F46E5] text-white shadow-lg'
                                                            : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#4F46E5]/20 hover:text-[#4F46E5]'
                                                        }`}
                                                >
                                                    Midterm
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setExamType('final')}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${examType === 'final'
                                                            ? 'bg-[#4F46E5] text-white shadow-lg'
                                                            : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#4F46E5]/20 hover:text-[#4F46E5]'
                                                        }`}
                                                >
                                                    Final Exam
                                                </button>
                                            </div>
                                        </div>

                                        {/* Exam Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getExamFields()}
                                        </div>

                                        <button type="submit" className="btn-primary">
                                            Upload Result
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ResultManagement;
