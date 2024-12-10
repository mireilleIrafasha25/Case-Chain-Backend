import mongoose from "mongoose";
const schema=mongoose.Schema;

const caseSchema = new schema({

   
  caseTitle: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'under review', 'resolved', 'closed'],
    default: 'pending'
  },
  caseOuner: { type: String, required: true}, // National Id will be provided here
  currentLevel: {
    type: String,
    enum: [ 'Mutwarasibo', 'Mudugudu',"Umuturage"],
    required: true
  },
  expected_resolution_date:{type :Date, default: Date.now()+7*24*60*60*1000},
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Who is handling the case
  updates: [{ 
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updateText: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})
const CaseModel=mongoose.model("Case",caseSchema);

export default CaseModel;