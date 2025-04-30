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
  // similar to publishPost above
}