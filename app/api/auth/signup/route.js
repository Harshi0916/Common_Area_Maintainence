// app/api/auth/signup/route.js
import connectDB from '@/utils/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, email, password, role = 'user' } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ message: 'Signup error', error: err.message }, { status: 500 });
  }
}
