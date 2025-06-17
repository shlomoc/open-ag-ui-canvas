"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HaikuWorkspaceProps {
  haikus: Haiku[]
  setHaikus: (haiku: Haiku[]) => void;
  selectedHaiku: Haiku
  setSelectedHaiku: (haiku: Haiku) => void;
}

export interface Haiku {
  japanese: string[];
  english: string[];
  image_names: string[];
  selectedImage: string | null;
}

export function HaikuWorkspace({ haikus, setHaikus, selectedHaiku, setSelectedHaiku }: HaikuWorkspaceProps) {
  const [editing, setEditing] = useState<{ type: 'japanese' | 'english'; index: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);


  // Helper to update haiku line
  const updateHaikuLine = (type: 'japanese' | 'english', index: number, value: string) => {
    // Update selectedHaiku
    const updatedSelected = {
      ...selectedHaiku,
      [type]: selectedHaiku[type].map((l, i) => (i === index ? value : l)),
    };
    setSelectedHaiku(updatedSelected);
    // Update haikus array
    setHaikus(
      haikus.map((h) =>
        h.english[0] === selectedHaiku.english[0]
          ? { ...h, [type]: h[type].map((l, i) => (i === index ? value : l)) }
          : h
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 h-full min-h-0" style={{height: '100%'}}>
      {/* Code Editor */}
      <div className="lg:col-span-3 h-full flex flex-col min-h-0">
        <Card className="rounded-2xl shadow-sm h-full flex flex-col min-h-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Haiku Canvas</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center min-h-0" style={{ marginLeft: '-48px' }}>
            <div className="haiku-stack w-full h-full flex items-center justify-center">
              <div
                className={`haiku-card`}
              >
                {selectedHaiku?.japanese.map((line, lineIndex) => (
                  <div
                    className="flex items-start gap-4 mb-4 haiku-line"
                    key={lineIndex}
                  >
                    {editing?.type === 'japanese' && editing.index === lineIndex ? (
                      <input
                        ref={inputRef}
                        className="text-4xl font-bold text-gray-600 w-auto bg-transparent focus:outline-none"
                        style={{
                          border: 'none',
                          width: `${editValue.length + 3.5}ch`,
                          minWidth: '1ch',
                          padding: 0,
                          margin: 0,
                          background: 'transparent',
                        }}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => {
                          updateHaikuLine('japanese', lineIndex, editValue);
                          setEditing(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updateHaikuLine('japanese', lineIndex, editValue);
                            setEditing(null);
                          }
                        }}
                      />
                    ) : (
                      <p
                        className="text-4xl font-bold text-gray-600 w-auto cursor-pointer"
                        onClick={() => {
                          setEditing({ type: 'japanese', index: lineIndex });
                          setEditValue(line);
                        }}
                      >
                        {line}
                      </p>
                    )}
                    {editing?.type === 'english' && editing.index === lineIndex ? (
                      <input
                        ref={inputRef}
                        className="text-base font-light text-gray-600 w-auto bg-transparent focus:outline-none"
                        style={{
                          border: 'none',
                          width: `${editValue.length + 1}ch`,
                          minWidth: '1ch',
                          padding: 0,
                          margin: 0,
                          background: 'transparent',
                        }}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => {
                          updateHaikuLine('english', lineIndex, editValue);
                          setEditing(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updateHaikuLine('english', lineIndex, editValue);
                            setEditing(null);
                          }
                        }}
                      />
                    ) : (
                      <p
                        className="text-base font-light text-gray-600 w-auto cursor-pointer"
                        onClick={() => {
                          setEditing({ type: 'english', index: lineIndex });
                          setEditValue(selectedHaiku?.english?.[lineIndex] || "");
                        }}
                      >
                        {selectedHaiku?.english?.[lineIndex]}
                      </p>
                    )}
                  </div>
                ))}

                {selectedHaiku?.image_names && selectedHaiku?.image_names.length === 3 && (
                  <div className="mt-6 flex gap-4 justify-center">
                    {selectedHaiku?.image_names.map((imageName, imgIndex) => (
                      <img
                        key={imageName}
                        src={`/images/${imageName}`}
                        alt={imageName || ""}
                        style={{
                          width: '130px',
                          height: '130px',
                          objectFit: 'cover',
                        }}
                        onClick={() => {
                          let find = haikus.findIndex((haiku) => haiku.english[0] === selectedHaiku.english[0])
                          console.log(find);
                          
                          if (find>=0) {
                            console.log(haikus.map((haiku, index) => index === find ? { ...haiku, selectedImage: imageName } : haiku));
                            if (imageName != selectedHaiku.selectedImage) {
                              setSelectedHaiku({ ...selectedHaiku, selectedImage: imageName })
                            }
                            setHaikus(haikus.map((haiku, index) => index === find ? { ...haiku, selectedImage: imageName } : haiku))
                          }
                        }}
                        className={(selectedHaiku?.selectedImage === imageName) ? `suggestion-card-image-focus` : `haiku-card-image`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Explorer & Tools */}
      <div className="h-full flex flex-col min-h-0">
        {/* File Explorer */}
        <Card className="rounded-2xl shadow-sm mr-4 h-full flex flex-col min-h-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Haikus</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 min-h-0">
              {haikus.length > 0 && haikus.map((haiku, index) => (
                <div
                  key={index}
                  style={{
                    height: '120px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    opacity: (selectedHaiku?.english[0] === haiku?.english[0]) ? 1 : 0.5,
                    marginBottom: '60px', // Even spacing except last
                  }}
                  onClick={() => setSelectedHaiku(haiku)}
                >
                  <div
                    className={`haiku-card animated-fade-in applied-flash active`}
                    style={{
                      margin: "0 auto",
                      width: "90%",
                      maxWidth: "320px",
                      transform: "scale(0.29)",
                      transformOrigin: "top left",
                    }}
                  >
                    {haiku?.japanese.map((line, lineIndex) => (
                      <div
                        className="flex items-start gap-4 mb-4 haiku-line"
                        key={lineIndex}
                        style={{ animationDelay: `${lineIndex * 0.1}s` }}
                      >
                        <p className="text-4xl font-bold text-gray-600 w-auto">{line}</p>
                        <p className="text-base font-light text-gray-500 w-auto">{haiku?.english?.[lineIndex]}</p>
                      </div>
                    ))}
                    {haiku?.image_names && haiku?.image_names.length === 3 && (
                      <div className="mt-6 flex gap-4 justify-center">
                        {haiku?.image_names.map((imageName, imgIndex) => (
                          <img
                            key={imageName}
                            src={`/images/${imageName}`}
                            alt={imageName || ""}
                            style={{
                              width: '130px',
                              height: '130px',
                              objectFit: 'cover',
                            }}
                            className={(haiku?.selectedImage === imageName) ? `suggestion-card-image-focus` : `haiku-card-image`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
