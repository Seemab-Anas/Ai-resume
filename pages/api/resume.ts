import type { NextApiRequest, NextApiResponse } from 'next';
import { getMongoDb } from '../../lib/mongodb';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user from Supabase session (from cookie)
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No auth token' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid auth' });

  const db = await getMongoDb();
  const resumes = db.collection('resumes');

  if (req.method === 'POST') {
    const { resume, tailored, jobDescription } = req.body;
    if (!resume || !tailored || !jobDescription) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const doc = {
      userId: user.id,
      resume,
      tailored,
      jobDescription,
      createdAt: new Date(),
    };
    await resumes.insertOne(doc);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const docs = await resumes.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ resumes: docs });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 