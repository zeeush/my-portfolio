import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/portfolio`, {
      next: { revalidate: 60 } // or cache: 'no-store' if we want it fully dynamic without revalidate
    });
    if (!res.ok) return [];
    return res.json();
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
    <div className="min-h-screen bg-[#050505] text-zinc-300">
      {/* Dynamic Header */}
      <div 
        className="relative h-[40vh] min-h-[400px] flex items-end pb-16 pt-32"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.3) 100%), url(${category.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/#work" className="inline-flex items-center text-zinc-400 hover:text-cyan-400 transition-colors mb-6 group text-sm font-medium">
            <i className="ph ph-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            Back to Selected Works
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">{category.title}</h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl">{category.description}</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-20">
        {category.projects && category.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {category.projects.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800/50 mb-6 bg-zinc-900">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-6 py-3 bg-black/80 text-white rounded-full text-sm font-medium tracking-wide backdrop-blur-md border border-zinc-700/50 flex items-center gap-2">
                      View Detail <i className="ph ph-arrow-up-right"></i>
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <p className="text-zinc-400 mb-4">{project.shortDesc}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-cyan-400/80">
                        {project.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800/50">
                    {project.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <i className="ph ph-empty text-4xl text-zinc-600 mb-4 block"></i>
            <h3 className="text-xl text-white font-medium mb-2">No projects yet</h3>
            <p className="text-zinc-500">Check back soon for updates to this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
