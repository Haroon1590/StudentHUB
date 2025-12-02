const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const bcrypt = require('bcryptjs');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/users
// @desc    Create a new user (Admin, Teacher, Student)
// @access  Private/Admin
router.post('/users', protect, authorize('admin'), async (req, res) => {
    const { name, email, password, role, ...otherDetails } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (role === 'student') {
            await Student.create({
                user_id: user._id,
                ...otherDetails
            });
        } else if (role === 'teacher') {
            await Teacher.create({
                user_id: user._id,
                ...otherDetails
            });
        }

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            // Also delete associated student/teacher profile
            if (user.role === 'student') {
                await Student.findOneAndDelete({ user_id: user._id });
            } else if (user.role === 'teacher') {
                await Teacher.findOneAndDelete({ user_id: user._id });
            }
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/courses', protect, authorize('admin'), async (req, res) => {
    try {
        const course = await Course.create(req.body);

        // If instructor is assigned, update the Teacher's assigned_courses
        if (req.body.instructor_id) {
            // Find the Teacher document by user_id (instructor_id is actually the User ID)
            const teacher = await Teacher.findOne({ user_id: req.body.instructor_id });
            if (teacher) {
                // Add course to teacher's assigned_courses if not already there
                if (!teacher.assigned_courses.includes(course._id)) {
                    teacher.assigned_courses.push(course._id);
                    await teacher.save();
                }
            }
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/courses
// @desc    Get all courses
// @access  Private/Admin
router.get('/courses', protect, authorize('admin'), async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructor_id', 'name');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/assign-course
// @desc    Assign a course to a student
// @access  Private/Admin
router.post('/assign-course', protect, authorize('admin'), async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
        // Find student by user_id (studentId is actually the User's _id from frontend)
        const student = await Student.findOne({ user_id: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already enrolled
        if (student.enrolled_courses.includes(courseId)) {
            return res.status(400).json({ message: 'Student already enrolled in this course' });
        }

        student.enrolled_courses.push(courseId);
        await student.save();

        res.json({ message: 'Course assigned successfully', student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/fees
// @desc    Create a fee for a student
// @access  Private/Admin
router.post('/fees', protect, authorize('admin'), async (req, res) => {
    try {
        const { student_id, amount, semester, description, due_date } = req.body;

        // Find student by user_id
        const student = await Student.findOne({ user_id: student_id });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const fee = await Fee.create({
            student_id: student._id,
            amount,
            semester,
            description,
            due_date,
            status: 'Unpaid'
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/fees
// @desc    Get all fees
// @access  Private/Admin
router.get('/fees', protect, authorize('admin'), async (req, res) => {
    try {
        const fees = await Fee.find({})
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'name email' }
            })
            .sort({ createdAt: -1 });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/fees/:id
// @desc    Update fee status
// @access  Private/Admin
router.put('/fees/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate({
            path: 'student_id',
            populate: { path: 'user_id', select: 'name email' }
        });

        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/admin/fees/:id
// @desc    Delete a fee
// @access  Private/Admin
router.delete('/fees/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }
        res.json({ message: 'Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/reports/teachers
// @desc    Get teacher reports
// @access  Private/Admin
router.get('/reports/teachers', protect, authorize('admin'), async (req, res) => {
    try {
        const teachers = await Teacher.find({})
            .populate('user_id', 'name email')
            .populate('assigned_courses', 'course_name course_id');

        const teacherReports = await Promise.all(teachers.map(async (teacher) => {
            // Count students across all assigned courses
            let totalStudents = 0;
            for (const course of teacher.assigned_courses) {
                const students = await Student.find({ enrolled_courses: course._id });
                totalStudents += students.length;
            }

            return {
                _id: teacher._id,
                name: teacher.user_id?.name,
                email: teacher.user_id?.email,
                teacher_id: teacher.teacher_id,
                department: teacher.department,
                courses: teacher.assigned_courses.length,
                students: totalStudents,
                courseDetails: teacher.assigned_courses
            };
        }));

        res.json(teacherReports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/reports/students
// @desc    Get student reports
// @access  Private/Admin
router.get('/reports/students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await Student.find({})
            .populate('user_id', 'name email')
            .populate('enrolled_courses', 'course_name course_id');

        const studentReports = await Promise.all(students.map(async (student) => {
            // Get attendance statistics
            const attendanceRecords = await Attendance.find({ student_id: student._id });
            const totalAttendance = attendanceRecords.length;
            const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
            const attendancePercentage = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(2) : 0;

            // Get results
            const results = await Result.find({ student_id: student._id }).populate('course_id', 'course_name');

            // Get fees
            const fees = await Fee.find({ student_id: student._id });
            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
            const unpaidFees = totalFees - paidFees;

            return {
                _id: student._id,
                name: student.user_id?.name,
                email: student.user_id?.email,
                student_id: student.student_id,
                roll_number: student.roll_number,
                department: student.department,
                semester: student.semester,
                section: student.section,
                enrolledCourses: student.enrolled_courses.length,
                attendancePercentage,
                totalAttendance,
                presentCount,
                resultsCount: results.length,
                totalFees,
                paidFees,
                unpaidFees,
                feeStatus: unpaidFees > 0 ? 'Pending' : 'Clear'
            };
        }));

        res.json(studentReports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
