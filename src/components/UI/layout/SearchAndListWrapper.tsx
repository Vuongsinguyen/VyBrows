import { useState } from 'preact/hooks';
import SearchAndList from './SearchAndList';


interface Product {
  id: number;
  title: string;
  description?: string;
  image?: string;
  techs?: string[];
  members?: number;
  months?: number;
  link?: string;
}


interface Props {
  allProducts: Product[];
}

export default function SearchAndListWrapper({ allProducts }: Props) {
  const [search, setSearch] = useState('');
  return (
    <SearchAndList
      allProducts={allProducts}
      search={search}
      onSearch={setSearch}
    />
  );
}


