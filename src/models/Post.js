import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: String,
  groups: [String],
  caption: String,
  comment: String,
  link: String,
  imageUrl: String,
  scheduleAt: Date,
  posted: Boolean
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;