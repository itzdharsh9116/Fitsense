const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    workoutName: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0.01, 'Duration must be greater than zero']
    },
    caloriesBurned: {
      type: Number,
      required: [true, 'Calories burned is required'],
      min: [0, 'Calories burned must be greater than or equal to zero']
    },
    workoutDate: {
      type: Date,
      required: [true, 'Workout date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

workoutSchema.methods.toJSON = function () {
  const workoutObject = this.toObject();
  delete workoutObject.__v;
  return workoutObject;
};

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
