import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

const contentFilePath = path.join(process.cwd(), 'data', 'site-content.json');

const DEFAULT_CONTENT = {
  home: {
    headline: "Timeless Craftsmanship. Next-Gen Velocity",
    tagline: "Design isn't just about aesthetics, it's about connection and intent. Grounded in over a decade of hands-on execution and high-speed modern workflows, I forge distinct visual identities that leave a lasting mark across every screen and surface.",
    ctaText: "Explore My Work",
    ctaLink: "#work",
    bgImage: "/images/1stpage-bg.jpg"
  },
  about: {
    bio: "I am Zeeshan, a Senior Brand Strategist and Multimedia Designer. I don't just design logos — I build immersive brand ecosystems.",
    experienceYears: "12+",
    story: "My journey began over a decade ago in the high-pressure print houses of Varanasi, mastering CorelDRAW and layout architecture by executing everything from local branding collaterals to rebuilding an entire 66-page magazine under tight deadlines.\n\nAs media transitioned, I channeled that foundational discipline into modern digital storytelling, where my active experience in video editing, live streaming, and content creation sharpened my understanding of audience psychology, visual pacing, and retention. Today, by fusing traditional design mastery (Adobe Premiere Pro, CorelDRAW, Canva, CapCut) with cutting-edge AI workflows (Leonardo.ai, Gemini, ChatGPT, Claude, Kling AI), I deliver premium quality at unmatched speeds — bridging core design fundamentals with next-gen generative technology to engineer high-converting visual solutions that dominate competitive spaces.",
    skills: [
      "Brand Strategy",
      "Logo Design",
      "Vector Architecture",
      "CorelDRAW",
      "Adobe Premiere Pro",
      "Generative AI & LLMs",
      "Motion Graphics",
      "Editorial Layouts",
      "Packaging Design",
      "Canva Pro",
      "CapCut"
    ],
    bgImage: ""
  },
  work: {
    sectionTitle: "Selected Works",
    sectionSubtitle: "10000+ successful projects delivered across tech, gaming, finance, lifestyle & enterprise brands.",
    bgImage: ""
  },
  process: {
    sectionTitle: "A Proven 4-Step Process",
    steps: [
      {
        number: "01",
        title: "Strategic Discovery & AI ideation",
        description: "Leveraging LLMs and generative AI (Leonardo.ai, Claude) alongside deep brand research to explore broad creative directions and rapid concept benchmarking."
      },
      {
        number: "02",
        title: "Foundation & Visual Architecture",
        description: "Distilling ideas with core design principles, structural composition, and typography hierarchy to establish a solid, memorable visual identity."
      },
      {
        number: "03",
        title: "Precision Vectoring & Editing",
        description: "Translating concepts into pixel-perfect vectors and multimedia assets using CorelDRAW, Premiere Pro, and Canva for seamless scalability across print and digital media."
      },
      {
        number: "04",
        title: "Ecosystem Deployment & Mockups",
        description: "Bringing brand assets to life with photorealistic 3D mockups, campaign-ready formats, and real-world collateral built for high conversion and market impact."
      }
    ],
    bgImage: ""
  }
};

function getSiteContent() {
  try {
    if (!fs.existsSync(contentFilePath)) {
      const dir = path.dirname(contentFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(contentFilePath, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf-8');
      return DEFAULT_CONTENT;
    }
    const raw = fs.readFileSync(contentFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      home: { ...DEFAULT_CONTENT.home, ...(parsed.home || {}) },
      about: { ...DEFAULT_CONTENT.about, ...(parsed.about || {}) },
      work: { ...DEFAULT_CONTENT.work, ...(parsed.work || {}) },
      process: { ...DEFAULT_CONTENT.process, ...(parsed.process || {}) },
    };
  } catch (error) {
    console.error('Error reading site-content.json:', error);
    return DEFAULT_CONTENT;
  }
}

// GET: Public read for site content
export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content);
}

// POST: Admin save for site content
export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid content payload provided.' }, { status: 400 });
    }

    const dir = path.dirname(contentFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Merge with defaults to ensure complete structure
    const current = getSiteContent();
    const updated = {
      ...current,
      ...body,
      home: { ...current.home, ...(body.home || {}) },
      about: { ...current.about, ...(body.about || {}) },
      work: { ...current.work, ...(body.work || {}) },
      process: { ...current.process, ...(body.process || {}) },
    };

    fs.writeFileSync(contentFilePath, JSON.stringify(updated, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Site content updated successfully',
      data: updated,
    });
  } catch (error: unknown) {
    console.error('Error saving site content:', error);
    const message = error instanceof Error ? error.message : 'Failed to save site content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
