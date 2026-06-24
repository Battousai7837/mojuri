import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { BlogCategory } from '@/models/BlogCategory';

const schema = z.object({ name: z.string().min(2), slug: z.string().min(2).regex(/^[a-z0-9-]+$/) });
export async function GET(){try{await connectDb();return NextResponse.json({items:await BlogCategory.find().sort({name:1})})}catch(error){return apiError(error)}}
export async function POST(request:NextRequest){try{requireAdmin(request);await connectDb();return NextResponse.json(await BlogCategory.create(schema.parse(await request.json())),{status:201})}catch(error){return apiError(error)}}
