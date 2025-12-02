const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher_id: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    assigned_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
