import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface IResumeSuggestion {
  id: string;
  text: string;
}

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: ApplicationStatus;
  jdLink?: string;
  notes?: string;
  dateApplied: Date;
  salaryRange?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority?: string;
  location?: string;
  rawJobDescription?: string;
  resumeSuggestions?: IResumeSuggestion[];
  followUpDate?: Date;
}

const JobSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  role: {
    type: String,
    required: [true, 'Please add a role/position'],
  },
  status: {
    type: String,
    enum: ['applied', 'phone_screen', 'interview', 'offer', 'rejected'],
    default: 'applied',
  },
  jdLink: String,
  notes: String,
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  salaryRange: String,
  requiredSkills: [String],
  niceToHaveSkills: [String],
  seniority: String,
  location: String,
  rawJobDescription: String,
  resumeSuggestions: [
    {
      id: String,
      text: String,
    },
  ],
  followUpDate: Date,
}, {
  timestamps: true,
});

export default mongoose.model<IJob>('Job', JobSchema);
