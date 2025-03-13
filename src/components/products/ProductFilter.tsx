
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";

interface ProductFilterProps {
  onSearch: (query: string) => void;
  onAddNew: () => void;
  onOpenFilter: () => void;
}

export function ProductFilter({ onSearch, onAddNew, onOpenFilter }: ProductFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-1/2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="البحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <div className="flex gap-2">
        <Button onClick={onOpenFilter} variant="outline">
          <Filter className="h-4 w-4 ml-2" />
          تصفية
        </Button>
        <Button onClick={onAddNew} className="gap-1">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>
    </div>
  );
}
