import { useState } from 'react';

export default function WishForm() {
  const [wish, setWish] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/send-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wish }),
      });
      alert('Terima kasih! Keinginanmu sudah dikirim 🎉');
      setWish('');
    } catch (error) {
      alert('Ups! Gagal mengirim. Coba lagi ya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        className="border-2 border-pink-300 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-pink-200 transition duration-200 placeholder-gray-400"
        rows="5"
        placeholder="Tulis di sini ya..."
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        required
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className={`bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:from-pink-600 hover:to-pink-500 transition duration-300 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Mengirim...' : '🎈 Kirim'}
      </button>
    </form>
  );
}
