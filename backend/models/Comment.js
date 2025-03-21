const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Conteúdo do comentário é obrigatório'],
    trim: true
  },
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
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'heart', 'laugh', 'surprised', 'sad', 'angry'],
      required: true
    },
    _id: false
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: {
      type: String,
      required: true
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    _id: false
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

// Indexes
commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

// Method to add reaction
commentSchema.methods.addReaction = function(userId, reactionType) {
  const existingReaction = this.reactions.find(
    reaction => reaction.user.toString() === userId.toString()
  );

  if (existingReaction) {
    if (existingReaction.type === reactionType) {
      // Remove reaction if same type is clicked again
      this.reactions = this.reactions.filter(
        reaction => reaction.user.toString() !== userId.toString()
      );
    } else {
      // Update existing reaction type
      existingReaction.type = reactionType;
    }
  } else {
    // Add new reaction
    this.reactions.push({ user: userId, type: reactionType });
  }

  return this.save();
};

// Method to edit comment
commentSchema.methods.edit = function(newContent) {
  // Store current content in edit history
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });

  // Update content and mark as edited
  this.content = newContent;
  this.isEdited = true;

  return this.save();
};

// Method to add attachment
commentSchema.methods.addAttachment = function(attachment) {
  this.attachments.push(attachment);
  return this.save();
};

// Method to remove attachment
commentSchema.methods.removeAttachment = function(attachmentId) {
  const attachment = this.attachments.id(attachmentId);
  if (attachment) {
    attachment.remove();
    return this.save();
  }
  return Promise.reject(new Error('Attachment not found'));
};

// Static method to get comment thread
commentSchema.statics.getThread = async function(commentId) {
  const comment = await this.findById(commentId)
    .populate('user', 'name avatar')
    .populate('mentions', 'name avatar')
    .populate('reactions.user', 'name avatar')
    .populate({
      path: 'replies',
      populate: [
        { path: 'user', select: 'name avatar' },
        { path: 'mentions', select: 'name avatar' },
        { path: 'reactions.user', select: 'name avatar' }
      ]
    });

  return comment;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;