'use client';
import { useEffect, useState } from 'react';

export default function History() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);

  async function handleDelete(id) {
    // Call the DELETE handler
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    // Remove from UI
    setPosts(current => current.filter(p => p._id !== id));
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Previous Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(p => (
          <div key={p._id} className="p-4 bg-white rounded-2xl shadow">
            <p className="font-medium text-lg">{p.caption}</p>
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt="Post image"
                className="mt-2 rounded-lg max-h-40 object-cover"
              />
            )}
            <p className="text-sm text-gray-600 mt-2">
              Scheduled: {new Date(p.scheduleAt).toLocaleString()}
            </p>
            <p
              className={`mt-1 font-medium ${
                p.posted ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {p.posted ? '✅ Posted' : '⏳ Pending'}
            </p>
            <button
              onClick={() => handleDelete(p._id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
// Compare this snippet from src/app/api/posts/route.js:
// import { connect } from '@/lib/mongoose';
// import { getSession } from 'next-auth/react';
// import Post from '@/models/Post';
// import axios from 'axios';
//
// export async function GET(req) {
//   const session = await getSession();
//   if (!session) return new Response(null, { status: 401 });
//   await connect();
//   const posts = await Post.find({ userId: session.user.email }).sort({ createdAt: -1 });
//   return new Response(JSON.stringify(posts));
// }
//
// export async function DELETE(req) {
//   const session = await getSession();
//   if (!session) return new Response(null, { status: 401 });
//   const { id } = req.query;
//   await connect();
//   await Post.findByIdAndDelete(id);
//   return new Response(null, { status: 204 });
// }
// Compare this snippet from src/app/api/posts/[id]/route.js:
// import { connect } from '@/lib/mongoose';
// import { getSession } from 'next-auth/react';
// import Post from '@/models/Post';
// import axios from 'axios';
//
// export async function DELETE(req, { params }) {
//   const session = await getSession();
//   if (!session) return new Response(null, { status: 401 });
//   await connect();
//   const { id } = params;
//   await Post.findByIdAndDelete(id);
//   return new Response(null, { status: 204 });
// }

