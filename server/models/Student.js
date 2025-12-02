const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student_id: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true },
    roll_number: { type: String, required: true },
    enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
