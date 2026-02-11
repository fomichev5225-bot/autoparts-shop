"use client";

import { FormEvent, useEffect, useState } from "react";
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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    console.log("ORDER_DATA", {
      customer: { name, phone, address, comment },
      items,
      total,
    });

    setSubmitted(true);
  }

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">
            Заказ оформлен!
          </h1>
          <p className="text-zinc-500 mb-8">
            Мы получили вашу заявку и свяжемся с вами в ближайшее время для подтверждения заказа.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться в корзину
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Оформление заказа
          </h1>
          <p className="mt-2 text-zinc-500">
            Заполните контактные данные для доставки
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
                Добавьте товары перед оформлением заказа
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                Перейти к поиску
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Form */}
            <div className="animate-fade-in">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        1
                      </span>
                      Контактные данные
                    </h2>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          ФИО
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Иван Иванов"
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          Телефон
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (999) 123-45-67"
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        2
                      </span>
                      Доставка
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Адрес доставки
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Город, улица, дом, квартира"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 text-xs flex items-center justify-center">
                        3
                      </span>
                      Дополнительно
                      <span className="text-sm font-normal text-zinc-400">(необязательно)</span>
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Комментарий к заказу
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Пожелания по доставке или заказу..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-0 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 w-full h-14 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Подтвердить заказ
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                  Ваш заказ
                </h2>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-zinc-50 rounded-xl"
                    >
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-contain bg-white flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {item.brand} • {item.quantity} шт.
                        </p>
                      </div>
                      
                      <p className="text-sm font-semibold text-zinc-900 flex-shrink-0">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Товары ({itemCount})</span>
                      <span className="text-zinc-900">{total.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Доставка</span>
                      <span className="text-zinc-900">Рассчитывается</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t border-zinc-100">
                    <span className="text-lg font-semibold text-zinc-900">Итого</span>
                    <span className="text-2xl font-bold text-zinc-900">{total.toLocaleString()} ₽</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <p className="text-xs text-blue-700">
                      После оформления заказа наш менеджер свяжется с вами для уточнения деталей и подтверждения наличия товаров
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
