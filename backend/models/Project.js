const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do projeto é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição do projeto é obrigatória'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['Administrador', 'Membro', 'Visualizador'],
      default: 'Membro'
    },
    _id: false
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  status: {
    type: String,
    enum: ['Em Andamento', 'Concluído', 'Arquivado'],
    default: 'Em Andamento'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task statistics
projectSchema.virtual('taskStats').get(function() {
  const totalTasks = this.tasks.length;
  const completedTasks = this.tasks.filter(task => task.status === 'Concluída').length;
  
  return {
    total: totalTasks,
    completed: completedTasks,
    pending: totalTasks - completedTasks,
    progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  };
});

// Method to check if user is member
projectSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if user has specific role
projectSchema.methods.hasRole = function(userId, role) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  return member && member.role === role;
};

// Method to add member
projectSchema.methods.addMember = function(userId, role = 'Membro') {
  if (!this.isMember(userId)) {
    this.members.push({ user: userId, role });
    return this.save();
  }
  return Promise.reject(new Error('User is already a member'));
};

// Method to remove member
projectSchema.methods.removeMember = function(userId) {
  if (this.owner.toString() === userId.toString()) {
    return Promise.reject(new Error('Cannot remove project owner'));
  }
  
  const memberIndex = this.members.findIndex(member => member.user.toString() === userId.toString());
  if (memberIndex > -1) {
    this.members.splice(memberIndex, 1);
    return this.save();
  }
  return Promise.reject(new Error('User is not a member'));
};

// Method to update member role
projectSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  if (member) {
    member.role = newRole;
    return this.save();
  }
  return Promise.reject(new Error('User is not a member'));
};

// Update progress based on tasks
projectSchema.methods.updateProgress = function() {
  if (this.tasks.length === 0) {
    this.progress = 0;
  } else {
    const completedTasks = this.tasks.filter(task => task.status === 'Concluída').length;
    this.progress = (completedTasks / this.tasks.length) * 100;
  }
  return this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;