export const dynamic = "force-dynamic";
("use client");
import { useEffect, useState } from "react";
import Image from 'next/image';

export default function History() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  async function handleDelete(id) {
    // Call the DELETE handler
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    // Remove from UI
    setPosts((current) => current.filter((p) => p._id !== id));
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Previous Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <div key={p._id} className="p-4 bg-white rounded-2xl shadow">
            <p className="font-medium text-lg">{p.caption}</p>
            {p.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden max-h-40">
                <Image
                  src={p.imageUrl}
                  alt="Post image"
                  width={400}
                  height={240}
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Scheduled: {new Date(p.scheduleAt).toLocaleString()}
            </p>
            <p
              className={`mt-1 font-medium ${
                p.posted ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {p.posted ? "✅ Posted" : "⏳ Pending"}
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
