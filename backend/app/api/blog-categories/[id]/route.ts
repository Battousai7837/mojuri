import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { BlogCategory } from '@/models/BlogCategory';

export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{requireAdmin(request);await connectDb();await BlogCategory.findByIdAndDelete((await params).id);return NextResponse.json({message:'Đã xóa danh mục blog'})}catch(error){return apiError(error)}}
