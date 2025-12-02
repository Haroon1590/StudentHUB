import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        student_id: '',
        department: '',
        semester: '',
        section: '',
        roll_number: '',
        teacher_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/users', formData, config);
            fetchUsers();
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'student',
                student_id: '',
                department: '',
                semester: '',
                section: '',
                roll_number: '',
                teacher_id: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
                fetchUsers();
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
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">User Management</h1>

                        {error && (
                            <div className="bg-[#EF4444] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {error}
                            </div>
                        )}

                        {/* Add User Form */}
                        <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Add New User</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {formData.role === 'student' && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Roll Number</label>
                                            <input
                                                type="text"
                                                name="roll_number"
                                                value={formData.roll_number}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Semester</label>
                                            <input
                                                type="number"
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Section</label>
                                            <input
                                                type="text"
                                                name="section"
                                                value={formData.section}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.role === 'teacher' && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Teacher ID</label>
                                            <input
                                                type="text"
                                                name="teacher_id"
                                                value={formData.teacher_id}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#E2E8F0]">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Users List */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">All Users</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#1E293B]">
                                            <th className="p-3 text-[#94A3B8] font-semibold">Name</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Email</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Role</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                <td className="p-3 text-[#E2E8F0] font-medium">{user.name}</td>
                                                <td className="p-3 text-[#94A3B8]">{user.email}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin'
                                                            ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                                                            : user.role === 'teacher'
                                                                ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                                                                : 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
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

export default UserManagement;
