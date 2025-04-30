import { getSession } from 'next-auth/react';
import axios from 'axios';

export async function GET(req) {
  const session = await getSession();
  if (!session) return new Response(null, { status: 401 });

  const res = await axios.get(
    `https://graph.facebook.com/me/groups?fields=name,id&access_token=${session.accessToken}`
  );
  return new Response(JSON.stringify(res.data.data));
}