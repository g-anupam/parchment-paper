'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  async function fetchNotes() {
    const res = await fetch('/api/notes');

    if (res.status === 401) {
      router.push('/login');
      return;
    }

    const data = await res.json();
    setNotes(data);
  }

  async function addNote() {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    setTitle('');
    setContent('');
    fetchNotes();
  }

  async function deleteNote(id: string) {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Parchment Paper</h2>

      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={addNote}>Add Note</button>
      </div>

      <div>
        {notes.map((note) => (
          <div key={note._id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
