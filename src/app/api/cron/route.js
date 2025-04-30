import { connect } from '@/lib/mongoose';
import Post from '@/models/Post';
import axios from 'axios';

export async function GET() {
  await connect();
  const due = await Post.find({ scheduleAt: { $lte: new Date() }, posted: false });
  for (const doc of due) {
    await publish(doc);
  }
  return new Response('OK');
}

async function publish(doc) {
    for (const groupId of doc.groups) {
        const url = `https://graph.facebook.com/${groupId}/feed`;
        await axios.post(url, {
          message: doc.caption,
          link: doc.link,
          access_token: token
        });
        if (doc.comment) {
          // Comment on the post
          // Handle retrieving post ID if needed
        }
      }
      doc.posted = true;
      await doc.save();
}