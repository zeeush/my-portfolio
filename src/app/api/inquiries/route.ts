import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

export interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  timeline: string;
  services: string[];
  projectDetails: string;
  referenceLinks?: string;
  status: 'new' | 'replied';
  createdAt: string;
}

const inquiriesFilePath = path.join(process.cwd(), 'data', 'inquiries.json');

function getInquiries(): InquiryRecord[] {
  try {
    if (!fs.existsSync(inquiriesFilePath)) {
      const dir = path.dirname(inquiriesFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(inquiriesFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(inquiriesFilePath, 'utf-8');
    return JSON.parse(raw || '[]') as InquiryRecord[];
  } catch (error) {
    console.error('Error reading inquiries.json:', error);
    return [];
  }
}

function saveInquiries(data: InquiryRecord[]) {
  const dir = path.dirname(inquiriesFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(inquiriesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: Fetch all inquiries (sorted newest first)
export async function GET(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const inquiries = getInquiries();
    // Sort descending by creation date
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(inquiries);
  } catch (error: unknown) {
    console.error('Error fetching inquiries:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch inquiries';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Public submission from /start-project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      companyName,
      timeline,
      services,
      projectDetails,
      referenceLinks,
    } = body;

    if (!fullName || !email || !projectDetails) {
      return NextResponse.json(
        { error: 'Name, email, and project details are required.' },
        { status: 400 }
      );
    }

    const newInquiry: InquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      companyName: companyName ? String(companyName).trim() : 'Independent / Not specified',
      timeline: timeline ? String(timeline).trim() : 'Flexible',
      services: Array.isArray(services) ? services : [],
      projectDetails: String(projectDetails).trim(),
      referenceLinks: referenceLinks ? String(referenceLinks).trim() : '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const list = getInquiries();
    list.unshift(newInquiry);
    saveInquiries(list);

    return NextResponse.json({
      success: true,
      message: 'Brief inquiry recorded successfully',
      inquiry: newInquiry,
    });
  } catch (error: unknown) {
    console.error('Error saving inquiry:', error);
    const message = error instanceof Error ? error.message : 'Failed to record brief inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Update status (e.g. mark as replied)
export async function PATCH(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Inquiry ID and status are required.' }, { status: 400 });
    }

    const list = getInquiries();
    const index = list.findIndex((inq) => inq.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    list[index].status = status;
    saveInquiries(list);

    return NextResponse.json({ success: true, inquiry: list[index] });
  } catch (error: unknown) {
    console.error('Error updating inquiry:', error);
    const message = error instanceof Error ? error.message : 'Failed to update inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove an inquiry
export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required for deletion.' }, { status: 400 });
    }

    const list = getInquiries();
    const filtered = list.filter((inq) => inq.id !== id);

    if (filtered.length === list.length) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    saveInquiries(filtered);

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting inquiry:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
