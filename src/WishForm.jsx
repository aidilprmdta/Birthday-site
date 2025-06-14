import { useState } from "react";

export default function WishForm() {
  const [wish, setWish] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputText }), // ganti inputText dengan state pesan kamu
    });

    const data = await response.json();
    if (data.ok) {
      alert('Pesan berhasil terkirim!');
    } else {
      alert('Gagal mengirim: ' + data.error);
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi error: ' + error.message);
  }
};

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <textarea
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        placeholder="Tulis ucapanmu di sini..."
        className="p-4 rounded-md border border-pink-300"
        rows={4}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
      >
        {loading ? "Mengirim..." : "Kirim Ucapan 🎉"}
      </button>
    </form>
  );
}
