const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quiz: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    mid: { type: Number, default: 0 },
    final: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    grade: { type: String },
    gpa: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
