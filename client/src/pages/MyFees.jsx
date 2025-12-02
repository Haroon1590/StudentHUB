import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MyFees = () => {
    const [fees, setFees] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/fees', config);
                setFees(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFees();
    }, []);

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidAmount = totalAmount - paidAmount;

    return (
        <div className="flex min-h-screen bg-[#0A0F1F]">
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#E2E8F0] animate-fadeInUp">My Fees</h1>

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

                        {/* Fees Table */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#E2E8F0]">Fee Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#1E293B]">
                                            <th className="p-3 text-[#94A3B8] font-semibold">Description</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Semester</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Amount</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Due Date</th>
                                            <th className="p-3 text-[#94A3B8] font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.map((fee) => (
                                            <tr key={fee._id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30 transition-colors">
                                                <td className="p-3 text-[#E2E8F0]">{fee.description}</td>
                                                <td className="p-3 text-[#94A3B8]">{fee.semester}</td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {fees.length === 0 && (
                                    <p className="text-center text-[#64748B] py-8">No fee records found</p>
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

export default MyFees;
