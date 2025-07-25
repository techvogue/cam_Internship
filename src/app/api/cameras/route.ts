import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      orderBy: { id: 'asc' }
    });
    
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cameras' },
      { status: 500 }
    );
  }
}
