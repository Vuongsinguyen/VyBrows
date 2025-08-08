import { useState } from 'preact/hooks';


// Highlight function for search keyword
function highlightText(text: string, keyword: string) {
  if (!keyword) return <>{text}</>;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return <>{parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} class="bg-yellow-200 text-black rounded px-1">{part}</mark>
      : <span key={i}>{part}</span>
  )}</>;
}


interface Product {
  id: number;
  title: string;
  description?: string;
  image?: string;
  techs?: string[];
  members?: number;
  months?: number;
  link?: string;
  category?: string;
  industry?: string;
}

interface Props {
  allProducts: Product[];
  search: string;
  onSearch: (value: string) => void;
}


export default function SearchAndList({ allProducts, search, onSearch }: Props) {
  const [page, setPage] = useState(1);
  // Lấy các giá trị duy nhất cho filter
  const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));
  const industries = Array.from(new Set(allProducts.map(p => p.industry).filter(Boolean)));
  const techs = Array.from(new Set(allProducts.flatMap(p => p.techs || [])));
  const membersArr = allProducts.map(p => p.members).filter((v): v is number => typeof v === 'number');
  const monthsArr = allProducts.map(p => p.months).filter((v): v is number => typeof v === 'number');
  const minMembers = membersArr.length ? Math.min(...membersArr) : 0;
  const maxMembers = membersArr.length ? Math.max(...membersArr) : 0;
  const minMonths = monthsArr.length ? Math.min(...monthsArr) : 0;
  const maxMonths = monthsArr.length ? Math.max(...monthsArr) : 0;

  // State cho filter
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [membersMin, setMembersMin] = useState<number | ''>('');
  const [membersMax, setMembersMax] = useState<number | ''>('');
  const [monthsMin, setMonthsMin] = useState<number | ''>('');
  const [monthsMax, setMonthsMax] = useState<number | ''>('');

  // Lọc theo search và filter
  const filteredProducts = allProducts.filter((p) => {
    const matchSearch = (p.title ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategories.length === 0 || (p.category && selectedCategories.includes(p.category));
    const matchIndustry = selectedIndustries.length === 0 || (p.industry && selectedIndustries.includes(p.industry));
    const matchTech = selectedTechs.length === 0 || (p.techs && p.techs.some(t => selectedTechs.includes(t)));
    const matchMembers = (membersMin === '' && membersMax === '') || (typeof p.members === 'number' && (membersMin === '' || p.members >= membersMin) && (membersMax === '' || p.members <= membersMax));
    const matchMonths = (monthsMin === '' && monthsMax === '') || (typeof p.months === 'number' && (monthsMin === '' || p.months >= monthsMin) && (monthsMax === '' || p.months <= monthsMax));
    return matchSearch && matchCategory && matchIndustry && matchTech && matchMembers && matchMonths;
  });
  const pageSize = 12;
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / pageSize);
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Handler cho filter
  const handleCheckbox = (type: string, value: string | number) => {
    if (type === 'category') {
      setSelectedCategories((prev) => prev.includes(value as string) ? prev.filter(v => v !== value) : [...prev, value as string]);
    } else if (type === 'industry') {
      setSelectedIndustries((prev) => prev.includes(value as string) ? prev.filter(v => v !== value) : [...prev, value as string]);
    } else if (type === 'tech') {
      setSelectedTechs((prev) => prev.includes(value as string) ? prev.filter(v => v !== value) : [...prev, value as string]);
    }
    setPage(1);
  };

  const handleInput = (e: preact.JSX.TargetedEvent<HTMLInputElement, Event>) => {
    onSearch(e.currentTarget.value);
    setPage(1);
  };
  const handleSubmit = (e: preact.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
  };
  const handlePageClick = (e: Event, i: number) => {
    e.preventDefault();
    setPage(i + 1);
  };

  return (
    <div class="flex flex-col md:flex-row gap-6 items-start">
      {/* Sidebar filter */}
      <aside class="w-full md:w-72 bg-surface rounded-lg p-4 text-on-surface shadow mb-4 md:mb-0 md:sticky md:top-32 z-20 h-auto border border-border">
        <form class="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Search projects..."
            class="w-full border rounded p-2 mb-4"
            value={search}
            onInput={handleInput}
            autoFocus
          />
          {/* Filter UI */}
          <div class="flex flex-col gap-4 mb-4">
            {/* Category filter */}
            {categories.length > 0 && (
              <div>
                <div class="font-semibold mb-1">Category</div>
                {categories.map(cat => (
                  <label class="block text-sm" key={cat}>
                    <input type="checkbox" checked={selectedCategories.includes(cat as string)} onChange={() => handleCheckbox('category', String(cat))} class="mr-1" />
                    {cat}
                  </label>
                ))}
              </div>
            )}
            {/* Industry filter */}
            {industries.length > 0 && (
              <div>
                <div class="font-semibold mb-1">Industry</div>
                {industries.map(ind => (
                  <label class="block text-sm" key={ind}>
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(ind as string)}
                      onChange={() => handleCheckbox('industry', String(ind))}
                      class="mr-1"
                    />
                    {ind}
                  </label>
                ))}
              </div>
            )}
            {/* Tech filter */}
            {techs.length > 0 && (
              <div>
                <div class="font-semibold mb-1">Techs</div>
                {techs.map(tech => (
                  <label class="block text-sm" key={tech}>
                    <input type="checkbox" checked={selectedTechs.includes(tech)} onChange={() => handleCheckbox('tech', tech)} class="mr-1" />
                    {tech}
                  </label>
                ))}
              </div>
            )}
            {/* Members filter (range) */}
            <div>
              <div class="font-semibold mb-1">Members</div>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min={minMembers}
                  max={maxMembers}
                  value={membersMin}
                  onInput={e => setMembersMin(e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))}
                  placeholder={`Min (${minMembers})`}
                  class="w-16 border rounded p-1 text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  min={minMembers}
                  max={maxMembers}
                  value={membersMax}
                  onInput={e => setMembersMax(e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))}
                  placeholder={`Max (${maxMembers})`}
                  class="w-16 border rounded p-1 text-sm"
                />
              </div>
            </div>
            {/* Months filter (range) */}
            <div>
              <div class="font-semibold mb-1">Months</div>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min={minMonths}
                  max={maxMonths}
                  value={monthsMin}
                  onInput={e => setMonthsMin(e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))}
                  placeholder={`Min (${minMonths})`}
                  class="w-16 border rounded p-1 text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  min={minMonths}
                  max={maxMonths}
                  value={monthsMax}
                  onInput={e => setMonthsMax(e.currentTarget.value === '' ? '' : Number(e.currentTarget.value))}
                  placeholder={`Max (${maxMonths})`}
                  class="w-16 border rounded p-1 text-sm"
                />
              </div>
            </div>
          </div>
        </form>
      </aside>
      {/* Main content: Product list */}
      <section class="flex-1 bg-surface rounded-lg text-on-surface w-full border border-border">
        <div class="space-y-4">
          {pagedProducts.length === 0 ? (
            <div class="text-center text-on-surface/50 py-12">Không có sản phẩm nào để hiển thị</div>
          ) : (
            pagedProducts.map((product) => (
              <a href={product.link || '#'} class="block group" style={{ textDecoration: 'none' }}>
                <div class="flex items-start gap-4 bg-surface-1 rounded-lg shadow-lg border border-border hover:bg-surface-2 hover:shadow-2xl transition px-4 py-3 group-hover:shadow-2xl cursor-pointer">
                  <div class="flex-shrink-0 w-40 aspect-[16/9] bg-surface-2 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.title ?? ''} class="object-cover w-full h-full rounded-lg" />
                    ) : (
                      <span class="text-3xl text-on-surface/40">📦</span>
                    )}
                  </div>
                  <div class="flex-1 min-w-0">
                    {product.title ? (
                      <>
                        <h2 class="text-lg font-semibold mb-1 truncate">
                          {highlightText(product.title, search)}
                        </h2>
                        {(product.industry || product.category) && (
                          <div class="flex gap-2 mb-1">
                            {product.industry && <span class="bg-surface-2 text-on-surface/80 px-2 py-0.5 rounded text-xs">🏷️ {product.industry}</span>}
                            {product.category && <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">📂 {product.category}</span>}
                          </div>
                        )}
                      </>
                    ) : null}
                    {product.description ? (
                      <p class="text-on-surface/70 text-sm mb-2 truncate">{product.description}</p>
                    ) : null}
                    {product.techs && product.techs.length > 0 && (
                      <div class="flex flex-wrap gap-1 mb-2">
                        {product.techs.map((tech) => (
                          <span class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{tech}</span>
                        ))}
                      </div>
                    )}
                    {(product.members || product.months) ? (
                      <div class="flex items-center gap-4 text-xs text-on-surface/60 mb-1">
                        {product.members && <span>👥 {product.members} thành viên</span>}
                        {product.months && <span>⏳ {product.months} tháng</span>}
                      </div>
                    ) : null}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
        <div class="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <a
              href="#"
              onClick={e => handlePageClick(e, i)}
              class={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-primary text-on-primary' : 'bg-surface-1 text-primary hover:bg-primary/10'}`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
