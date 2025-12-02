import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        amount: '',
        semester: '',
        description: '',
        due_date: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchFees();
        fetchStudents();
    }, []);

    const fetchFees = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/fees', config);
            setFees(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setStudents(data.filter(user => user.role === 'student'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.post('http://localhost:5000/api/admin/fees', formData, config);
            setMessage('✅ Fee added successfully');
            setFormData({
                student_id: '',
                amount: '',
                semester: '',
                description: '',
                due_date: ''
            });
            fetchFees();
        } catch (err) {
            setMessage('❌ Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (feeId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/fees/${feeId}`, { status: newStatus }, config);
            setMessage('✅ Fee status updated');
            fetchFees();
        } catch (err) {
            setMessage('❌ Error updating status');
        }
    };

    const handleDelete = async (feeId) => {
        if (window.confirm('Are you sure you want to delete this fee?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/fees/${feeId}`, config);
                setMessage('✅ Fee deleted successfully');
                fetchFees();
            } catch (err) {
                setMessage('❌ Error deleting fee');
            }
        }
    };

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidAmount = totalAmount - paidAmount;

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">Fee Management</h1>

                        {message && (
                            <div className={`p-4 rounded-lg mb-6 animate-slideInRight ${message.includes('✅')
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-[#EF4444] text-white'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card-dark card-hover p-6 animate-fadeInUp">
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Total Fees</h3>
                                <p className="text-3xl font-bold text-[#3B82F6]">₹{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Paid</h3>
                                <p className="text-3xl font-bold text-[#10B981]">₹{paidAmount.toLocaleString()}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Unpaid</h3>
                                <p className="text-3xl font-bold text-[#EF4444]">₹{unpaidAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Add Fee Form */}
                        <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Add New Fee</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Student</label>
                                    <select
                                        name="student_id"
                                        value={formData.student_id}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="">-- Select Student --</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>{student.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
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
                                <div>
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Due Date</label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium text-[#E2E8F0]">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="input-dark"
                                        placeholder="e.g., Tuition Fee"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add Fee'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Fees List */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">All Fees</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#1E293B]">
                                            <th className="p-3 text-[#94A3B8] font-semibold">Student</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Description</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Semester</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Amount</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Due Date</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Status</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.map(fee => (
                                            <tr key={fee._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                <td className="p-3">
                                                    <div className="font-medium text-[#E2E8F0]">{fee.student_id?.user_id?.name || 'N/A'}</div>
                                                    <div className="text-sm text-[#64748B]">{fee.student_id?.user_id?.email}</div>
                                                </td>
                                                <td className="p-3 text-[#E2E8F0]">{fee.description}</td>
                                                <td className="p-3 text-[#E2E8F0]">{fee.semester}</td>
                                                <td className="p-3 font-semibold text-[#3B82F6]">₹{fee.amount.toLocaleString()}</td>
                                                <td className="p-3 text-[#94A3B8]">{new Date(fee.due_date).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${fee.status === 'Paid'
                                                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                                            : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                                                        }`}>
                                                        {fee.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        {fee.status === 'Unpaid' ? (
                                                            <button
                                                                onClick={() => handleStatusUpdate(fee._id, 'Paid')}
                                                                className="text-[#10B981] hover:text-[#059669] text-sm font-medium transition-colors"
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleStatusUpdate(fee._id, 'Unpaid')}
                                                                className="text-[#F59E0B] hover:text-[#D97706] text-sm font-medium transition-colors"
                                                            >
                                                                Mark Unpaid
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(fee._id)}
                                                            className="text-[#EF4444] hover:text-[#DC2626] text-sm font-medium transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {fees.length === 0 && (
                                    <p className="text-center text-[#64748B] py-8">No fees found. Add a fee to get started.</p>
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

export default FeeManagement;
