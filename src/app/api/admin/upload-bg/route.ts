import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const section = (formData.get('section') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    // Validate supported image types
    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
      'image/gif',
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Supported formats: PNG, JPG, JPEG, WEBP, SVG, GIF.' },
        { status: 400 }
      );
    }

    // Target folder: /public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const sanitizedSection = section.replace(/[^a-zA-Z0-9_-]/g, '');
    const ext = path.extname(file.name) || '.jpg';
    const fileName = `${sanitizedSection}_bg_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      section,
    });
  } catch (error: unknown) {
    console.error('Error uploading background image:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload background image';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
