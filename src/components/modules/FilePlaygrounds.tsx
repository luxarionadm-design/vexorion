import React, { useState } from 'react';
import { useFileUpload } from '../../core/FileUpload.js';
import { useFileReader } from '../../core/FileReader.js';
import { Upload, FileText, Trash2, CheckCircle2, Image as ImageIcon, FileCode } from 'lucide-react';

export function FilePlaygrounds({ moduleId }: { moduleId: string }) {
  // FileUpload State
  const [fileQueue, setFileQueue] = useState<any[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // FileReader State
  const [readerResult, setReaderResult] = useState<string | null>(null);
  const [readerType, setReaderType] = useState<'text' | 'dataUrl'>('text');
  const [fileName, setFileName] = useState<string>('');

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploader = new useFileUpload({
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/json']
    });

    uploader.addFiles(e.target.files);
    setFileQueue((prev) => [...prev, ...uploader.getFiles()]);
    setUploadErrors(uploader.getErrors());
  };

  const handleStartSimulatedUpload = () => {
    setIsSimulatingUpload(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsSimulatingUpload(false);
        setFileQueue((prev) => prev.map((f) => ({ ...f, status: 'success', progress: 100 })));
      }
    }, 300);
  };

  const handleFileReaderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new useFileReader();
    if (readerType === 'dataUrl' || file.type.startsWith('image/')) {
      const dataUrl = await reader.readAsDataURL(file);
      setReaderResult(dataUrl as string);
    } else {
      const text = await reader.readAsText(file);
      setReaderResult(text as string);
    }
  };

  if (moduleId === 'filereader') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Promise-based client-side FileReader supporting text, Base64 Data URLs, ArrayBuffer, and binary strings.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700 text-xs">
            <span className="text-neutral-400">Read Mode:</span>
            <button
              onClick={() => setReaderType('text')}
              className={`px-2 py-0.5 rounded font-medium ${readerType === 'text' ? 'bg-amber-600 text-white' : 'text-neutral-400'}`}
            >
              Text / JSON
            </button>
            <button
              onClick={() => setReaderType('dataUrl')}
              className={`px-2 py-0.5 rounded font-medium ${readerType === 'dataUrl' ? 'bg-amber-600 text-white' : 'text-neutral-400'}`}
            >
              Base64 Data URL
            </button>
          </div>

          <label className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg cursor-pointer flex items-center gap-2">
            <FileCode className="w-4 h-4" /> Choose File to Read
            <input type="file" onChange={handleFileReaderChange} className="hidden" />
          </label>
        </div>

        {readerResult && (
          <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-2">
            <div className="text-neutral-500 flex justify-between border-b border-neutral-800 pb-2">
              <span>File: {fileName}</span>
              <span>Format: {readerType}</span>
            </div>
            {readerType === 'dataUrl' && readerResult.startsWith('data:image') ? (
              <div className="space-y-3">
                <img src={readerResult} alt="preview" className="max-h-48 rounded-lg border border-neutral-700" referrerPolicy="no-referrer" />
                <div className="text-neutral-400 break-all select-all text-[11px] max-h-24 overflow-y-auto">
                  {readerResult}
                </div>
              </div>
            ) : (
              <pre className="text-emerald-300 max-h-60 overflow-y-auto whitespace-pre-wrap">{readerResult}</pre>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default: useFileUpload
  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-xl p-6 text-center transition-colors">
        <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-neutral-200">Select Files for Upload Queue</h4>
        <p className="text-xs text-neutral-400 mt-1 mb-3">Allowed: JPG, PNG, PDF, TXT (Max 5MB per file)</p>
        <label className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg cursor-pointer inline-flex items-center gap-2">
          Browse Files
          <input type="file" multiple onChange={handleFilesAdded} className="hidden" />
        </label>
      </div>

      {uploadErrors.length > 0 && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs space-y-1">
          {uploadErrors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      {fileQueue.length > 0 && (
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-xs text-neutral-400">
            <span>Files in Queue ({fileQueue.length})</span>
            <button
              onClick={handleStartSimulatedUpload}
              disabled={isSimulatingUpload}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-xs disabled:opacity-50"
            >
              {isSimulatingUpload ? `Uploading (${uploadProgress}%)` : 'Simulate Upload'}
            </button>
          </div>

          <div className="space-y-2">
            {fileQueue.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-neutral-200 font-medium">{f.name}</div>
                    <div className="text-neutral-500 text-[10px]">{(f.size / 1024).toFixed(1)} KB • {f.type || 'unknown'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${f.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'}`}>
                    {f.status}
                  </span>
                  <button
                    onClick={() => setFileQueue((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
