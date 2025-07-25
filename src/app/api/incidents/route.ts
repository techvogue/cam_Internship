import { NextRequest, NextResponse } from 'next/server';
import { fetchIncidents } from '../../../controllers/incidentController';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resolvedParam = searchParams.get('resolved');
  let resolved: boolean | undefined = undefined;
  if (resolvedParam === 'true') resolved = true;
  if (resolvedParam === 'false') resolved = false;
  try {
    const incidents = await fetchIncidents(resolved);
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 