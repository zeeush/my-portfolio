import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Project {
  id: string;
  title: string;
  year: string;
  shortDesc: string;
  type: string;
  image: string;
}

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  projects: Project[];
}

async function getPortfolioData(): Promise<Category[]> {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categories = await getPortfolioData();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Header */}
        <div 
          className="relative min-h-[320px] sm:min-h-[380px] flex items-end pb-10 sm:pb-16 pt-24 sm:pt-32"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0.7) 40%, rgba(5,5,8,0.3) 100%), url(${category.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/#work" className="inline-flex items-center text-zinc-400 hover:text-cyan-400 transition-colors mb-4 sm:mb-6 group text-xs sm:text-sm font-medium">
              <i className="ph ph-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
              Back to Selected Works
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight font-['Outfit']">{category.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed">{category.description}</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {category.projects && category.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {category.projects.map((project) => (
                <div key={project.id} className="group">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800/50 mb-4 sm:mb-6 bg-zinc-900">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-cyan-400 text-zinc-950 font-bold text-xs">
                        {project.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 mb-1 block">{project.year}</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-2">{project.shortDesc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 sm:py-32 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
              <i className="ph ph-empty text-3xl sm:text-4xl text-zinc-600 mb-3 sm:mb-4 block"></i>
              <h3 className="text-lg sm:text-xl text-white font-medium mb-2">No projects yet</h3>
              <p className="text-xs sm:text-sm text-zinc-500">Check back soon for updates to this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
