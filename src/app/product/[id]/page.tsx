"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

type Product = {
  id: string;
  oemNumber: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  description?: string;
  inStock?: boolean;
};

type CartItem = Product & {
  quantity: number;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/catalog/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Mock product for demo
          setProduct({
            id,
            oemNumber: "ABC-123456",
            name: "Тормозные колодки передние",
            brand: "Toyota",
            price: 4500,
            description: "Оригинальные тормозные колодки для Toyota Camry. Обеспечивают надёжное торможение и длительный срок службы. Подходят для моделей 2015-2023 годов выпуска.",
            inStock: true,
          });
        }
      } catch {
        // Mock product for demo
        setProduct({
          id,
          oemNumber: "ABC-123456",
          name: "Тормозные колодки передние",
          brand: "Toyota",
          price: 4500,
          description: "Оригинальные тормозные колодки для Toyota Camry. Обеспечивают надёжное торможение и длительный срок службы. Подходят для моделей 2015-2023 годов выпуска.",
          inStock: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;

    try {
      const raw = localStorage.getItem("cart");
      let cart: CartItem[] = raw ? JSON.parse(raw) : [];

      const index = cart.findIndex((c) => c.id === product.id);
      if (index >= 0) {
        cart[index].quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Товар не найден</h1>
          <p className="text-zinc-500 mb-6">К сожалению, запрашиваемый товар не существует</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться к поиску
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к поиску
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-sm aspect-square flex items-center justify-center">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-zinc-50 flex items-center justify-center">
                  <svg className="w-24 h-24 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="space-y-6">
              {/* Badge */}
              {product.inStock !== false && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  В наличии
                </span>
              )}

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  {product.name}
                </h1>
                <p className="mt-2 text-zinc-500">
                  {product.brand} • {product.oemNumber}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-zinc-900">
                  {product.price.toLocaleString()} ₽
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-zinc prose-sm">
                  <p className="text-zinc-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="pt-6 border-t border-zinc-200">
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-lg font-semibold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Добавлено в корзину
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Добавить в корзину
                      </>
                    )}
                  </button>
                </div>

                {/* Total */}
                {quantity > 1 && (
                  <p className="mt-3 text-sm text-zinc-500">
                    Итого: <span className="font-semibold text-zinc-900">{(product.price * quantity).toLocaleString()} ₽</span>
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm">
                    <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">Гарантия</h3>
                  <p className="text-xs text-zinc-500 mt-1">12 месяцев</p>
                </div>
                
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm">
                    <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">Доставка</h3>
                  <p className="text-xs text-zinc-500 mt-1">1-3 дня</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
