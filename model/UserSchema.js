import mongoose from 'mongoose';

const UserModelSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  location: {
    type: String,
    default: 'gandhipuram,coimbatore'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

UserModelSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
export default mongoose.model('User', UserModelSchema);
