"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const fileInputRef = useRef(null);

  function handleAddNote() {
    if (!title && !description) return;

    const newNote = {
      id: Date.now(),
      title,
      description,
      image,
    };

    setNotes([newNote, ...notes]);

    setTitle("");
    setDescription("");
    setImage(null);
    setExpanded(false);
  }

  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
    } catch (error) {
      console.error(error.message);
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-6">
        <h1 className="font-semibold text-lg">Parchment Paper</h1>

        <Input
          placeholder="Search notes..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      {/* Note Input Section */}
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4 space-y-3">
            {/* Expand trigger */}
            <Input
              placeholder="Take a note..."
              onFocus={() => setExpanded(true)}
              className={!expanded ? "block" : "hidden"}
            />

            {/* Expanded editor */}
            {expanded && (
              <>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  placeholder="Write your note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex justify-between items-center pt-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => setImage(reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />

                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Image
                  </Button>

                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      <div className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-2">
              {note.image && (
                <img
                  src={note.image}
                  className="rounded-md max-h-40 object-cover w-full"
                />
              )}

              {note.title && <h3 className="font-semibold">{note.title}</h3>}

              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {note.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
