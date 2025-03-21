const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título da tarefa é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição da tarefa é obrigatória'],
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Andamento', 'Em Revisão', 'Concluída'],
    default: 'Pendente'
  },
  priority: {
    type: String,
    enum: ['Baixa', 'Média', 'Alta', 'Urgente'],
    default: 'Média'
  },
  deadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  }],
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dependencies: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked by'],
      required: true
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
taskSchema.index({ project: 1, order: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ deadline: 1 });

// Virtual for time tracking
taskSchema.virtual('timeTracking').get(function() {
  return {
    estimated: this.estimatedHours || 0,
    actual: this.actualHours || 0,
    difference: (this.estimatedHours || 0) - (this.actualHours || 0)
  };
});

// Virtual for deadline status
taskSchema.virtual('deadlineStatus').get(function() {
  if (this.status === 'Concluída') return 'completed';
  
  const now = new Date();
  const deadline = new Date(this.deadline);
  
  if (deadline < now) return 'overdue';
  
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  if (daysUntilDeadline <= 2) return 'urgent';
  if (daysUntilDeadline <= 5) return 'warning';
  
  return 'ok';
});

// Method to add comment
taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content
  });
  return this.save();
};

// Method to update comment
taskSchema.methods.updateComment = function(commentId, content) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.content = content;
    comment.updatedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Comment not found'));
};

// Method to delete comment
taskSchema.methods.deleteComment = function(commentId) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.remove();
    return this.save();
  }
  return Promise.reject(new Error('Comment not found'));
};

// Method to add attachment
taskSchema.methods.addAttachment = function(attachment) {
  this.attachments.push(attachment);
  return this.save();
};

// Method to remove attachment
taskSchema.methods.removeAttachment = function(attachmentId) {
  const attachment = this.attachments.id(attachmentId);
  if (attachment) {
    attachment.remove();
    return this.save();
  }
  return Promise.reject(new Error('Attachment not found'));
};

// Method to update status
taskSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'Concluída') {
    this.completedDate = new Date();
  } else {
    this.completedDate = undefined;
  }
  return this.save();
};

// Pre-save middleware to handle status changes
taskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'Em Andamento' && !this.startDate) {
      this.startDate = new Date();
    }
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;