import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

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
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }
    const body = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Save Portfolio Error:', error);
    return NextResponse.json({ error: 'Failed to save portfolio data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }
    const body = await request.json();
    const { id, title, description, coverImage } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const data = await fs.readFile(dataFilePath, 'utf-8');
    interface CategoryItem {
      id: string;
      slug: string;
      title: string;
      description: string;
      coverImage: string;
    }

    const categories = JSON.parse(data);
    const index = (categories as CategoryItem[]).findIndex((c) => c.id === id || c.slug === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    categories[index] = {
      ...categories[index],
      title: title !== undefined ? title.trim() : categories[index].title,
      description: description !== undefined ? description.trim() : categories[index].description,
      coverImage: coverImage !== undefined ? coverImage.trim() : categories[index].coverImage,
    };

    await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2), 'utf-8');
    return NextResponse.json({ success: true, category: categories[index] });
  } catch (error) {
    console.error('Update Category Error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
