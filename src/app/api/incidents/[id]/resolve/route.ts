
import { NextRequest, NextResponse } from 'next/server';
import { toggleIncidentResolved } from '@/controllers/incidentController';
import { Incident } from '@/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Incident | { error: string }>> {
  const { id: paramId } = await params;
  const id = Number(paramId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid incident id' }, { status: 400 });
  }
  try {
    const updated = await toggleIncidentResolved(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 