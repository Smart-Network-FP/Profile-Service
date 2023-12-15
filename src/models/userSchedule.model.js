const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userScheduleSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    expertId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Expert',
    },
    scheduledDateAndTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes or seconds (based on your requirement)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userScheduleSchema.plugin(toJSON);
userScheduleSchema.plugin(paginate);

/**
 * @typedef UserSchedule
 */
const UserSchedule = mongoose.model('UserSchedule', userScheduleSchema);

module.exports = UserSchedule;
