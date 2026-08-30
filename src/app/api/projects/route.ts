import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

export interface ProjectRecord {
  id: string;
  title: string;
  companyName: string;
  year: string;
  category: string;
  categoryName: string;
  folderSlug: string;
  tagline: string;
  description: string;
  tags: string[];
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

function getProjectsData(): ProjectRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent || '[]') as ProjectRecord[];
  } catch (error) {
    console.error('Error reading projects.json:', error);
    return [];
  }
}

function saveProjectsData(data: ProjectRecord[]) {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET all projects (Public read for showcase)
export async function GET() {
  const projects = getProjectsData();
  return NextResponse.json(projects);
}

// POST create a new project (Protected)
export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, companyName, year, category, categoryName, folderSlug, tagline, description, imageUrl, tags } = body;

    if (!title || !category || !imageUrl) {
      return NextResponse.json({ error: 'Title, category, and image are required.' }, { status: 400 });
    }

    const projects = getProjectsData();

    // Extract hashtags from tagline if not explicitly passed
    const extractedTags = tags || (tagline ? (tagline.match(/#[a-zA-Z0-9_]+/g) || []) : []);

    const newProject: ProjectRecord = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      companyName: (companyName || title).trim(),
      year: (year || new Date().getFullYear().toString()).toString().trim(),
      category,
      categoryName: categoryName || category,
      folderSlug: folderSlug || category,
      tagline: tagline ? tagline.trim() : '',
      description: description ? description.trim() : '',
      tags: extractedTags,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    projects.unshift(newProject);
    saveProjectsData(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: unknown) {
    console.error('Error adding project:', error);
    const message = error instanceof Error ? error.message : 'Failed to add project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update an existing project (Protected)
export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, companyName, year, category, categoryName, folderSlug, tagline, description, imageUrl, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required for editing.' }, { status: 400 });
    }

    const projects = getProjectsData();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const extractedTags = tags || (tagline ? (tagline.match(/#[a-zA-Z0-9_]+/g) || []) : projects[index].tags);

    projects[index] = {
      ...projects[index],
      title: title !== undefined ? title.trim() : projects[index].title,
      companyName: companyName !== undefined ? companyName.trim() : projects[index].companyName,
      year: year !== undefined ? year.toString().trim() : projects[index].year,
      category: category || projects[index].category,
      categoryName: categoryName || projects[index].categoryName,
      folderSlug: folderSlug || projects[index].folderSlug,
      tagline: tagline !== undefined ? tagline.trim() : projects[index].tagline,
      description: description !== undefined ? description.trim() : projects[index].description,
      tags: extractedTags,
      imageUrl: imageUrl || projects[index].imageUrl,
      updatedAt: new Date().toISOString(),
    };

    saveProjectsData(projects);

    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error: unknown) {
    console.error('Error updating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE a project (Protected)
export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required for deletion.' }, { status: 400 });
    }

    const projects = getProjectsData();
    const filteredProjects = projects.filter((p) => p.id !== id);

    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    saveProjectsData(filteredProjects);

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting project:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
