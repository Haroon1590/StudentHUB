const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Course = require('../models/Course');
const Student = require('../models/Student');

// @route   POST /api/teacher/attendance
// @desc    Mark attendance
// @access  Private/Teacher
router.post('/attendance', protect, authorize('teacher'), async (req, res) => {
    try {
        const { student_id, course_id, date, status } = req.body;

        // Check if attendance already marked for this date/student/course
        const existingAttendance = await Attendance.findOne({
            student_id,
            course_id,
            date
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this student on this date' });
        }

        const attendance = await Attendance.create({
            student_id,
            course_id,
            date,
            status
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/teacher/results
// @desc    Add/Update results
// @access  Private/Teacher
router.post('/results', protect, authorize('teacher'), async (req, res) => {
    try {
        const { student_id, course_id, quiz, assignment, mid, final } = req.body;

        // Calculate total, grade, gpa (simplified logic)
        const total = (quiz || 0) + (assignment || 0) + (mid || 0) + (final || 0);
        let grade = 'F';
        let gpa = 0.0;

        if (total >= 90) { grade = 'A'; gpa = 4.0; }
        else if (total >= 80) { grade = 'B'; gpa = 3.0; }
        else if (total >= 70) { grade = 'C'; gpa = 2.0; }
        else if (total >= 60) { grade = 'D'; gpa = 1.0; }

        let result = await Result.findOne({ student_id, course_id });

        if (result) {
            result.quiz = quiz || result.quiz;
            result.assignment = assignment || result.assignment;
            result.mid = mid || result.mid;
            result.final = final || result.final;
            result.total = total;
            result.grade = grade;
            result.gpa = gpa;
            await result.save();
        } else {
            result = await Result.create({
                student_id,
                course_id,
                quiz,
                assignment,
                mid,
                final,
                total,
                grade,
                gpa
            });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/teacher/courses
// @desc    Get assigned courses
// @access  Private/Teacher
router.get('/courses', protect, authorize('teacher'), async (req, res) => {
    try {
        // Assuming the teacher's user ID is linked to the Teacher model
        const teacher = await require('../models/Teacher').findOne({ user_id: req.user._id });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const courses = await Course.find({ _id: { $in: teacher.assigned_courses } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/teacher/enrolled-students/:courseId
// @desc    Get students enrolled in a specific course
// @access  Private/Teacher
router.get('/enrolled-students/:courseId', protect, authorize('teacher'), async (req, res) => {
    try {
        const students = await Student.find({ enrolled_courses: req.params.courseId })
            .populate('user_id', 'name email'); // Get user details
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
