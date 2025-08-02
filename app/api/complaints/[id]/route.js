import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Complaint from '@/models/Complaint';
import jwt from 'jsonwebtoken';

function getUserInfo(auth) {
  if (!auth) throw new Error("No auth header");
  const token = auth.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return { userId: payload.userId, role: payload.role };
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId, role } = getUserInfo(req.headers.get('authorization'));
    const { id } = params;

    const complaint = await Complaint.findById(id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username');

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    // Users can only view their own complaints, admins can view all
    if (role !== 'admin' && complaint.createdBy._id.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { userId, role } = getUserInfo(req.headers.get('authorization'));
    const { id } = params;
    const { status, adminNotes, assignedTo } = await req.json();

    // Only admins can update complaint status
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can update complaints' }, { status: 403 });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'username email')
     .populate('assignedTo', 'username');

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
