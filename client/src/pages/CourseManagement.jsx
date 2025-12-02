import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        course_id: '',
        course_name: '',
        credit_hours: '',
        semester: '',
        instructor_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/courses', config);
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setTeachers(data.filter(user => user.role === 'teacher'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/courses', formData, config);
            fetchCourses();
            setFormData({
                course_id: '',
                course_name: '',
                credit_hours: '',
                semester: '',
                instructor_id: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, config);
                fetchCourses();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">Course Management</h1>

                        {error && (
                            <div className="bg-[#EF4444] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {error}
                            </div>
                        )}

                        {/* Add Course Form */}
                        <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Add New Course</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Course ID</label>
                                    <input
                                        type="text"
                                        name="course_id"
                                        value={formData.course_id}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Course Name</label>
                                    <input
                                        type="text"
                                        name="course_name"
                                        value={formData.course_name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Credit Hours</label>
                                    <input
                                        type="number"
                                        name="credit_hours"
                                        value={formData.credit_hours}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Semester</label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="input-dark"
                                        placeholder="e.g., Fall 2024"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Instructor (Optional)</label>
                                    <select
                                        name="instructor_id"
                                        value={formData.instructor_id}
                                        onChange={handleChange}
                                        className="input-dark"
                                    >
                                        <option value="">-- Select Instructor --</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Creating...' : 'Create Course'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Courses List */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">All Courses</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#1E293B]">
                                            <th className="p-3 text-[#94A3B8] font-semibold">Course ID</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Course Name</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Credits</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Semester</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Instructor</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                <td className="p-3 text-[#3B82F6] font-medium">{course.course_id}</td>
                                                <td className="p-3 text-[#E2E8F0]">{course.course_name}</td>
                                                <td className="p-3 text-[#94A3B8]">{course.credit_hours}</td>
                                                <td className="p-3 text-[#94A3B8]">{course.semester}</td>
                                                <td className="p-3 text-[#E2E8F0]">{course.instructor_id?.name || 'Not Assigned'}</td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="text-[#EF4444] hover:text-[#DC2626] font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default CourseManagement;
