'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Dashboard() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(setGroups);
  }, []);

  return (
    <div className="p-4">
      <button onClick={() => signOut()}>Logout</button>
      <h1>Your Groups</h1>
      <ul>{groups.map(g => <li key={g.id}>{g.name}</li>)}</ul>
    </div>
  );
}