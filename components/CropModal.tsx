import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import type { Area } from 'react-easy-crop';
import { Button } from './Button';
import { XMarkIcon } from './Icons';

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise<void>((resolve) => { image.onload = () => resolve(); });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/jpeg',
      0.95
    );
  });
}

interface CropModalProps {
  imageSrc: string;
  onCropDone: (blob: Blob) => void;
  onCancel: () => void;
}

export const CropModal: React.FC<CropModalProps> = ({ imageSrc, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(blob);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Crop Photo</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Drag to reposition · Scroll or use slider to zoom</p>
          </div>
          <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative bg-zinc-950" style={{ height: '320px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="rect"
            showGrid={true}
            style={{ containerStyle: { backgroundColor: '#09090b' } }}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
              style={{ accentColor: '#6366f1' }}
            />
            <span className="text-xs text-zinc-500 w-8 text-right tabular-nums">{zoom.toFixed(1)}×</span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              isLoading={isProcessing}
              className="flex-1 bg-brand-600 hover:bg-brand-500 text-white border-0"
            >
              {isProcessing ? 'Processing...' : 'Crop & Continue'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
