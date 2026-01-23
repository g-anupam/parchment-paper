import { connectDB } from '@/lib/mongodb';
import { Note } from '@/models/Note';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

function getUserIdFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('token='));

  if (!tokenMatch) return null;

  const token = tokenMatch.split('=')[1];

  const data: any = verifyToken(token);
  return data.userId;
}

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const notes = await Note.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  const note = await Note.create({
    ...body,
    userId,
  });

  return NextResponse.json(note);
}

export async function DELETE(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  await connectDB();

  await Note.deleteOne({ _id: id, userId });
  return NextResponse.json({ success: true });
}
