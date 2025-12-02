const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @route   GET /api/student/attendance
// @desc    Get my attendance
// @access  Private/Student
router.get('/attendance', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const attendance = await Attendance.find({ student_id: student._id }).populate('course_id', 'course_name');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/student/results
// @desc    Get my results
// @access  Private/Student
router.get('/results', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const results = await Result.find({ student_id: student._id }).populate('course_id', 'course_name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/student/fees
// @desc    Get my fees
// @access  Private/Student
router.get('/fees', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const fees = await Fee.find({ student_id: student._id });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
