import { connect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Post from '@/models/Post';

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(null, { status: 401 });

  await connect();

  const post = await Post.findById(params.id);
  if (!post || post.userId !== session.user.email) {
    return new Response('Not allowed', { status: 403 });
  }

  await Post.findByIdAndDelete(params.id);
  return new Response(null, { status: 204 });
}