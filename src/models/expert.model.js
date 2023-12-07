const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { string } = require('joi');

const Experience = {
  title: {
    type: String,
    maxlength: 10,
  },
  startDate: Date,
  endDate: Date,
  companyName: String,
  description: {
    type: String,
    maxlength: 500,
  },
};

const Expertise = {
  skills: {
    type: Array,
    of: String,
  },
  country: {
    type: String,
  },
  company: {
    type: String,
  },
  description: {
    type: String,
    maxlength: 500,
  },
};
const expertSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      // required: true,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    industry: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid Mobile Number');
        }
      },
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      trim: true,
      default: '',
    },
    experience: [Experience],
    expertise: [Expertise],
    summary: {
      type: String,
      maxlength: 2000,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
expertSchema.plugin(toJSON);
expertSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
expertSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  console.log('user', user);
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
expertSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Return Personal Info
 * @returns {Promise<PersonalInfo>}
 */
expertSchema.methods.getPersonalInfo = async function () {
  const expert = this;
  return {
    firstName: expert.firstName,
    lastName: expert.lastName,
    phoneNumber: expert.phoneNumber,
    industry: expert.industry,
    city: expert.city,
    state: expert.state,
    country: expert.country,
    language: expert.language,
  };
};

/**
 * Return Experience Info
 * @returns {Promise<ExperienceInfo>}
 */
expertSchema.methods.getExperienceInfo = async function () {
  const expert = this;
  return {
    experience: expert.experience,
  };
};

/**
 * Return Expertise Info
 * @returns {Promise<ExpertiseInfo>}
 */
expertSchema.methods.getExpertiseInfo = async function () {
  const expert = this;
  return {
    expertise: expert.expertise,
  };
};

/**
 * Return Summary Info
 * @returns {Promise<SummaryInfo>}
 */
expertSchema.methods.getSummaryInfo = async function () {
  const expert = this;
  return {
    summary: expert.summary,
  };
};

/**
 * Return Profile Info
 * @returns {Promise<ProfileInfo>}
 */
expertSchema.methods.getProfileInfo = async function () {
  const expert = this;
  return {
    firstName: expert.firstName,
    lastName: expert.lastName,
    phoneNumber: expert.phoneNumber,
    industry: expert.industry,
    city: expert.city,
    state: expert.state,
    country: expert.country,
    language: expert.language,
    experience: expert.experience,
    expertise: expert.expertise,
    summary: expert.summary,
  };
};

/**
 * Return public Info
 * @returns {Promise<ExpertInfo>}
 */
expertSchema.methods.getPublic = async function () {
  const expert = this;
  return {
    email: expert.email,
    firstName: expert.firstName,
    lastName: expert.lastName,
    id: expert.id,
  };
};

expertSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('Expert', expertSchema);

module.exports = User;
