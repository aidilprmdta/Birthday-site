// src/components/WishForm.jsx

import { useState } from 'react';

export default function WishForm() {
  const [wish, setWish] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://birthdaywinda.vercel.app/api/send-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wish }),
      });

      const data = await response.json();
      alert(data.message || 'Terkirim!');

      setWish('');
    } catch (error) {
      alert('Ups! Gagal mengirim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        placeholder="Tulis ucapan di sini..."
        required
        className="p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Mengirim...' : 'Kirim Ucapan'}
      </button>
    </form>
  );
}
