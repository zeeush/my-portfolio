import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Read Portfolio Error:', error);
    return NextResponse.json({ error: 'Failed to read portfolio data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Save Portfolio Error:', error);
    return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
  }
}
