import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, ChevronLeft, ChevronRight, Scale, Calendar } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { useStorage } from '@/hooks/useStorage';

const ProgressPhotos = () => {
  const { getItem, setItem } = useStorage();
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewIdx, setViewIdx] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    document.title = 'VORO | Progress Photos';
    const saved = getItem('voro_progress_photos') || [];
    setPhotos(saved);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        id: `photo-${Date.now()}`,
        src: reader.result,
        date: new Date().toISOString(),
        label: `Photo ${photos.length + 1}`,
        note: '',
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      setItem('voro_progress_photos', updated);
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    setItem('voro_progress_photos', updated);
    if (selected?.id === id) setSelected(null);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const sortedPhotos = [...photos].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Progress Photos</h1>
            <p className="text-gray-400 mt-1">Track your visual transformation over time</p>
          </div>
          <div className="flex gap-3">
            {photos.length >= 2 && (
              <Button
                variant={compareMode ? 'primary' : 'secondary'}
                onClick={() => { setCompareMode(!compareMode); setCompareA(null); setCompareB(null); }}
                size="sm"
              >
                {compareMode ? 'Exit Compare' : 'Compare Photos'}
              </Button>
            )}
            <Button onClick={() => fileRef.current?.click()} className="flex items-center gap-2">
              <Camera size={18} />
              Upload Photo
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {compareMode && (
          <Card className="p-6 mb-6 border border-violet-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Compare Mode — select two photos</h3>
            <div className="grid grid-cols-2 gap-8">
              {[compareA, compareB].map((photo, side) => (
                <div key={side} className="text-center">
                  <div className="text-sm text-gray-400 mb-2">{side === 0 ? 'Before' : 'After'}</div>
                  {photo ? (
                    <div className="relative">
                      <img src={photo.src} alt="" className="w-full h-64 object-cover rounded-lg" />
                      <div className="text-xs text-gray-400 mt-2">{formatDate(photo.date)}</div>
                      <button onClick={() => side === 0 ? setCompareA(null) : setCompareB(null)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-voro-card border-2 border-dashed border-voro-border rounded-lg flex items-center justify-center text-gray-500">
                      Click a photo below to select
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {photos.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-white mb-2">Start your transformation journey</h3>
            <p className="text-gray-400 mb-6">Upload your first progress photo to begin tracking your visual changes over time.</p>
            <Button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 mx-auto">
              <Camera size={18} /> Upload First Photo
            </Button>
          </Card>
        ) : (
          <>
            {/* Timeline stat */}
            {photos.length >= 2 && (
              <div className="flex gap-4 mb-6">
                <Card className="p-4 flex items-center gap-3 flex-1">
                  <Calendar className="text-violet-400" size={24} />
                  <div>
                    <div className="text-sm text-gray-400">First Photo</div>
                    <div className="text-white font-semibold">{formatDate(sortedPhotos[0].date)}</div>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 flex-1">
                  <Scale className="text-emerald-400" size={24} />
                  <div>
                    <div className="text-sm text-gray-400">Total Photos</div>
                    <div className="text-white font-semibold">{photos.length} photos</div>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-3 flex-1">
                  <Calendar className="text-amber-400" size={24} />
                  <div>
                    <div className="text-sm text-gray-400">Days Tracked</div>
                    <div className="text-white font-semibold">
                      {Math.round((new Date(sortedPhotos[sortedPhotos.length - 1].date) - new Date(sortedPhotos[0].date)) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    compareMode
                      ? compareA?.id === photo.id || compareB?.id === photo.id
                        ? 'border-violet-500'
                        : 'border-transparent hover:border-violet-500/50'
                      : selected?.id === photo.id
                        ? 'border-violet-500'
                        : 'border-transparent hover:border-violet-500/50'
                  }`}
                  onClick={() => {
                    if (compareMode) {
                      if (!compareA) setCompareA(photo);
                      else if (!compareB && compareA.id !== photo.id) setCompareB(photo);
                    } else {
                      setSelected(photo.id === selected?.id ? null : photo);
                    }
                  }}
                >
                  <img src={photo.src} alt={photo.label} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="text-white text-sm font-medium">{photo.label}</div>
                    <div className="text-gray-300 text-xs">{formatDate(photo.date)}</div>
                  </div>
                  {!compareMode && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id); }}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {(idx === 0) && <Badge variant="voro-primary" className="absolute top-4 left-4 text-[0.55rem]">START</Badge>}
                  {(idx === sortedPhotos.length - 1 && idx > 0) && <Badge variant="voro-secondary" dot className="absolute top-4 left-4 text-[0.55rem]">LATEST</Badge>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressPhotos;
