import React, { useState } from 'react';
import { ExternalLink, Globe, Link2, Check, Settings } from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalUrl: string;
  onSavePortalUrl: (newUrl: string) => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  portalUrl,
  onSavePortalUrl,
}) => {
  const [urlInput, setUrlInput] = useState(portalUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = urlInput.trim();
    if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = `https://${cleaned}`;
    }
    onSavePortalUrl(cleaned || 'https://elearning.university.ac.ke');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const quickPresets = [
    { name: 'University LMS (Moodle)', url: 'https://elearning.university.ac.ke' },
    { name: 'Blackboard Learn', url: 'https://learn.blackboard.com' },
    { name: 'Canvas LMS', url: 'https://canvas.instructure.com' },
    { name: 'Google Classroom', url: 'https://classroom.google.com' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#03060f]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#0b1329] rounded-2xl max-w-lg w-full shadow-2xl border border-blue-900/60 overflow-hidden z-10 my-8 text-slate-100">
        <div className="px-6 py-4 border-b border-blue-900/40 flex items-center justify-between bg-[#070d1e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Link Your E-Learning Portal</h3>
              <p className="text-xs text-slate-400">
                Connect your institution's portal for one-click access from coursework, classes, and CATs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/40 rounded-lg transition-colors"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Portal Website URL (e.g. Moodle, Blackboard, Canvas):
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://elearning.university.ac.ke"
                className="w-full pl-3 pr-24 py-2.5 bg-[#070c1a] border border-blue-900/60 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <a
                href={urlInput.startsWith('http') ? urlInput : `https://${urlInput}`}
                target="_blank"
                rel="noreferrer"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-200 bg-blue-950/80 hover:bg-blue-900 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              CourseTrack Pro will link all your online classes, CAT 1 & 3 quizzes, and assignment submissions directly to this portal.
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1.5">
              Popular Presets:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quickPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setUrlInput(preset.url)}
                  className={`p-2 rounded-xl text-xs font-medium text-left transition-all border ${
                    urlInput === preset.url
                      ? 'bg-blue-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-[#070c1a] border-blue-950 text-slate-400 hover:text-white hover:border-blue-900'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{preset.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{preset.url}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-blue-900/40 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold">
              {savedSuccess ? 'Portal Linked Successfully!' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-blue-950/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                <span>Save Portal Link</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
