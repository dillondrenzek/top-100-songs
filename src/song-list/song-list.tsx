import React, { useState, useEffect } from 'react';
import './song-list.scss';

interface Song {
  label: string;
  count: number;
}

function useSongList() {
  const [items, setItems] = useState<Song[]>([]);
  const shouldFetchItems = items && items.length

  useEffect(() => {
    console.log('items:', items);
    setItems([
      { label: 'A', count: 0 },
      { label: 'B', count: 0 },
      { label: 'C', count: 0 }
    ]);
  }, [shouldFetchItems]);

  return {
    songs: items,
    increaseSongCount: (song: Song) => {
      const newItems = [
        ...items.filter((item) => item !== song),
        { ...song, count: song.count + 1 }
      ].sort((a, b) => {
        return b.count - a.count;
      });
      setItems(newItems);
    }
  }
}

export function SongList() {
  const { 
    songs,
    increaseSongCount
  } = useSongList();

  return (songs.length ? (
    <ul className='SongList'>
      {songs.map((song, i) => (
        <li className='song' key={i}>
          <div>{song.label}</div>
          <div>
            <button onClick={() => increaseSongCount(song)}>Up</button>
            <span>{song.count}</span>
            <button onClick={() => null}>Down</button>
          </div>
        </li>
      ))}
    </ul>
  ) : null);
}