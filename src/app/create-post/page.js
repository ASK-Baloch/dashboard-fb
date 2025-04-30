'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [form, setForm] = useState({ caption: '', comment: '', link: '', scheduleAt: '', image: null });

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(setGroups);
  }, []);

  const handleChange = e => {
    const { name, value, files, options } = e.target;
    if (name === 'image') setForm({ ...form, image: files[0] });
    else if (name === 'groups') {
      const vals = Array.from(options).filter(o => o.selected).map(o => o.value);
      setSelectedGroups(vals);
    } else setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e, postNow = false) {
    e.preventDefault();
    const payload = new FormData();
    payload.append('groups', JSON.stringify(selectedGroups));
    Object.entries(form).forEach(([k,v]) => v && payload.append(k, v));
    payload.append('postNow', postNow);

    await fetch('/api/posts', { method: 'POST', body: payload });
    router.push('/history');
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create & Schedule Post</h2>
      <form className="space-y-5" onSubmit={e => handleSubmit(e, false)}>
        <label className="block">
          <span className="text-gray-700">Select Groups</span>
          <select name="groups" multiple onChange={handleChange} className="mt-1 block w-full p-2 border rounded-lg">
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Caption</span>
          <input type="text" name="caption" onChange={handleChange} className="mt-1 w-full p-2 border rounded-lg" />
        </label>
        <label className="block">
          <span className="text-gray-700">Link</span>
          <input type="url" name="link" onChange={handleChange} className="mt-1 w-full p-2 border rounded-lg" />
        </label>
        <label className="block">
          <span className="text-gray-700">Comment Text</span>
          <textarea name="comment" onChange={handleChange} className="mt-1 w-full p-2 border rounded-lg" />
        </label>
        <label className="block">
          <span className="text-gray-700">Schedule At</span>
          <input type="datetime-local" name="scheduleAt" onChange={handleChange} className="mt-1 w-full p-2 border rounded-lg" />
        </label>
        <label className="block">
          <span className="text-gray-700">Image</span>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="mt-1 w-full" />
        </label>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-medium rounded-2xl hover:bg-green-700">Schedule Post</button>
          <button type="button" onClick={e => handleSubmit(e, true)} className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700">Post Now</button>
        </div>
        </form>
    </div>
  );
}