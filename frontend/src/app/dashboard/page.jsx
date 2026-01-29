"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [selectedNote, setSelectedNote] = useState(null);

  // Add new note
  function handleAddNote() {
    if (!title && !description) return;

    const newNote = {
      id: Date.now(),
      title,
      description,
      image,
    };

    setNotes([...notes, newNote]);

    setTitle("");
    setDescription("");
    setImage(null);
  }

  // Update existing note
  function handleUpdateNote() {
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? selectedNote : note,
    );

    setNotes(updatedNotes);
    setSelectedNote(null);
  }

  // Delete note
  function handleDeleteNote(id) {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
    setSelectedNote(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="h-14 bg-white border-b flex items-center px-6">
        <h1 className="text-xl font-semibold">Parchment Paper</h1>
      </div>

      {/* Notes Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => setSelectedNote(note)}
          >
            <CardContent className="p-4 space-y-2">
              {note.image && (
                <img
                  src={note.image}
                  className="rounded-md max-h-40 object-cover w-full"
                />
              )}

              <h3 className="font-semibold">{note.title}</h3>

              <p className="text-sm text-gray-600 line-clamp-4">
                {note.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Note Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full text-2xl">
            +
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => setImage(reader.result);
                reader.readAsDataURL(file);
              }}
            />

            <Button onClick={handleAddNote} className="w-full">
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit / View Modal */}
      {selectedNote && (
        <Dialog open={true} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                value={selectedNote.title}
                onChange={(e) =>
                  setSelectedNote({
                    ...selectedNote,
                    title: e.target.value,
                  })
                }
              />

              <Textarea
                value={selectedNote.description}
                onChange={(e) =>
                  setSelectedNote({
                    ...selectedNote,
                    description: e.target.value,
                  })
                }
              />

              {selectedNote.image && (
                <img
                  src={selectedNote.image}
                  className="rounded-md max-h-48 object-cover w-full"
                />
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    setSelectedNote({
                      ...selectedNote,
                      image: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <div className="flex gap-2">
                <Button onClick={handleUpdateNote} className="flex-1">
                  Update
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
