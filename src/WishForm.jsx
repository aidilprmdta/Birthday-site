import { useState } from "react";

export default function WishForm() {
  const [wish, setWish] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wish.trim()) return alert("Tulis pesannya dulu ya 🤍");

    setLoading(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/send-wish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish }),
      });

      alert("Terima kasih! Pesanmu sudah dikirim 🎉");
      setWish("");
    } catch (error) {
      console.error(error);
      alert("Ups! Gagal mengirim. Coba lagi ya.");
    } finally {
      setLoading(false);
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
