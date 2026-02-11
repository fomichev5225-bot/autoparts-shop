"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type SearchResultItem = {
  id: string;
  oemNumber: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
};

type CartItem = SearchResultItem & {
  quantity: number;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [vin, setVin] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (vin) params.set("vin", vin);
      if (brand) params.set("brand", brand);
      if (model) params.set("model", model);
      if (year) params.set("year", year);

      const res = await fetch(`/api/catalog/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Ошибка поиска");
      }
      const data = await res.json();
      setResults(data.items ?? []);
    } catch (err) {
      console.error(err);
      setError("Не удалось выполнить поиск. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(item: SearchResultItem) {
    try {
      const raw = localStorage.getItem("cart");
      let cart: CartItem[] = raw ? JSON.parse(raw) : [];

      const index = cart.findIndex((c) => c.id === item.id);
      if (index >= 0) {
        cart[index].quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedToCart(item.id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.03),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Быстрый поиск по OEM и VIN
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
              Автозапчасти с&nbsp;
              <span className="text-blue-600">гарантией</span>
              &nbsp;качества
            </h1>
            
            <p className="mt-5 text-lg text-zinc-500 leading-relaxed">
              Найдите нужную деталь за секунды. Введите номер OEM или VIN автомобиля — мы покажем все подходящие варианты.
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Номер детали (OEM)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="VIN автомобиля"
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Поиск...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        Найти
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable Filters */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    Дополнительные фильтры
                  </button>
                  
                  <div className={`grid gap-3 md:grid-cols-3 overflow-hidden transition-all duration-300 ${showFilters ? 'mt-4 max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <input
                      type="text"
                      placeholder="Марка (например, Toyota)"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="h-11 px-4 rounded-xl bg-zinc-50 border-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Модель (например, Camry)"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="h-11 px-4 rounded-xl bg-zinc-50 border-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Год (например, 2018)"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-11 px-4 rounded-xl bg-zinc-50 border-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all appearance-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-zinc-900">
                Результаты поиска
                <span className="ml-3 text-base font-normal text-zinc-400">
                  {results.length} {results.length === 1 ? 'товар' : results.length < 5 ? 'товара' : 'товаров'}
                </span>
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-zinc-50 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300"
                >
                  <Link href={`/product/${item.id}`} className="block">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-36 object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-36 mb-4 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {item.brand} • {item.oemNumber}
                      </p>
                      <p className="text-xl font-bold text-zinc-900">
                        {item.price.toLocaleString()} ₽
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`mt-4 w-full h-11 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart === item.id
                        ? 'bg-green-500 text-white'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    {addedToCart === item.id ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Добавлено
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        В корзину
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {results.length === 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-3 stagger-children">
              <div className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Гарантия качества</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Только оригинальные запчасти и проверенные аналоги от надёжных поставщиков
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Быстрая доставка</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Доставим заказ в удобное для вас время по всей России
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Поддержка 24/7</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Наши специалисты помогут подобрать нужную деталь в любое время
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
