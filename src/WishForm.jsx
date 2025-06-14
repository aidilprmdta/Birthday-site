import React, { useState } from "react";

export default function WishForm() {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Pesan terkirim 🎉');
      setInputText(''); // reset field
    } catch (error) {
      alert('Terjadi error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <textarea
        className="border p-2"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Tulis ucapanmu..."
      />
      <button
        type="submit"
        className="bg-pink-500 text-white p-2 mt-2"
      >
        Kirim Ucapan 🎉
      </button>
    </form>
  );
}
