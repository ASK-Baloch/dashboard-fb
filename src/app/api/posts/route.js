import { connect } from '@/lib/mongoose';
import { getSession } from 'next-auth/react';
import Post from '@/models/Post';
import axios from 'axios';

export async function POST(req) {
  const session = await getSession();
  if (!session) return new Response(null, { status: 401 });
  const { groups, caption, comment, link, imageUrl, scheduleAt, postNow } = await req.json();
  await connect();

  // Save to DB
  const doc = await Post.create({
    userId: session.user.email,
    groups,
    caption,
    comment,
    link,
    imageUrl,
    scheduleAt: scheduleAt ? new Date(scheduleAt) : null,
    posted: false
  });

  // If postNow, publish immediately
  if (postNow) await publishPost(doc, session.accessToken);

  return new Response(JSON.stringify(doc));
}

async function publishPost(doc, token) {
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