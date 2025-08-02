import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

function getUserInfo(auth) {
  if (!auth) throw new Error("No auth header");
  const token = auth.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return { userId: payload.userId, role: payload.role };
}

export async function GET(req) {
  try {
    await connectDB();
    const { userId, role } = getUserInfo(req.headers.get('authorization'));
    
    let complaints;
    if (role === 'admin') {
      // Admin can see all complaints
      complaints = await Complaint.find()
        .populate('createdBy', 'username email')
        .populate('assignedTo', 'username')
        .sort({ createdAt: -1 });
    } else {
      // Users can only see their own complaints
      complaints = await Complaint.find({ createdBy: userId })
        .populate('createdBy', 'username email')
        .populate('assignedTo', 'username')
        .sort({ createdAt: -1 });
    }
    
    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, role } = getUserInfo(req.headers.get('authorization'));
    const { title, description, category, priority } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      createdBy: userId,
      status: 'pending',
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('createdBy', 'username email');

    return NextResponse.json(populatedComplaint, { status: 201 });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
