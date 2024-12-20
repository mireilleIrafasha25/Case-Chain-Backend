import  mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ownerNationalId: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['New', 'In Progress', 'Escalated', 'Resolved'], default: 'New' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  assignedTo: { type: String, default: 'Local Authority' },
  escalationLevel: { type: Number, default: 0 },
  submittedDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

const CaseModel = mongoose.model('Case', caseSchema);
export default CaseModel;