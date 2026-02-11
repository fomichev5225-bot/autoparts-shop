"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  oemNumber: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to read cart from localStorage", err);
    }
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function updateStorage(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  function handleRemove(id: string) {
    const next = items.filter((item) => item.id !== id);
    updateStorage(next);
  }

  function handleChangeQuantity(id: string, delta: number) {
    const next = items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    updateStorage(next);
  }

  function handleClear() {
    setItems([]);
    localStorage.removeItem("cart");
  }

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Продолжить покупки
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Корзина
          </h1>
          <p className="mt-2 text-zinc-500">
            {itemCount > 0 ? (
              <>
                {itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'} на сумму {total.toLocaleString()} ₽
              </>
            ) : (
              'Добавьте товары для оформления заказа'
            )}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                Корзина пуста
              </h2>
              <p className="text-zinc-500 mb-6">
                Найдите нужные запчасти через поиск на главной странице
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Перейти к поиску
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-4 animate-fade-in">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-5">
                    {/* Image */}
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-contain bg-zinc-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/product/${item.id}`}
                        className="font-semibold text-zinc-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-zinc-500 mt-1">
                        {item.brand} • {item.oemNumber}
                      </p>
                      <p className="text-sm text-zinc-400 mt-1">
                        {item.price.toLocaleString()} ₽ за шт.
                      </p>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-600 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-600 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-zinc-900">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-sm text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Очистить корзину
              </button>
            </div>

            {/* Order Summary */}
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                  Ваш заказ
                </h2>

                <div className="space-y-3 pb-6 border-b border-zinc-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Товары ({itemCount})
                    </span>
                    <span className="text-zinc-900">
                      {total.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Доставка</span>
                    <span className="text-zinc-900">Рассчитывается</span>
                  </div>
                </div>

                <div className="flex justify-between py-6">
                  <span className="text-lg font-semibold text-zinc-900">Итого</span>
                  <span className="text-2xl font-bold text-zinc-900">
                    {total.toLocaleString()} ₽
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full h-12 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                >
                  Оформить заказ
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <div className="mt-6 flex items-center gap-3 p-4 bg-zinc-50 rounded-xl">
                  <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs text-zinc-500">
                    Безопасная оплата и гарантия возврата
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
