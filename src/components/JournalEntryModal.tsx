/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Link as LinkIcon, 
  Tag as TagIcon, 
  Wrench, 
  FileText 
} from 'lucide-react';
import { JournalEntry, GLOBAL_TAGS, GlobalTag } from '../types';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  targetType: 'project' | 'subproject';
  targetId: string;
  targetTitle: string;
  initialEntry?: JournalEntry | null;
}

const TITLE_SUGGESTIONS = [
  'First implementation',
  'Manual test results',
  'Debugging notes',
  'Design decision',
  'Retest results',
  'Weekly progress',
  'Architecture review',
  'Vulnerability finding'
];

export const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  targetType,
  targetId,
  targetTitle,
  initialEntry,
}) => {
  const [entryTitle, setEntryTitle] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [whatIDid, setWhatIDid] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [problemsAndBlockers, setProblemsAndBlockers] = useState('');
  const [solutionsOrDecisions, setSolutionsOrDecisions] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEntry) {
      setEntryTitle(initialEntry.entry_title || '');
      setWorkDate(initialEntry.work_date || new Date().toISOString().split('T')[0]);
      setWhatIDid(initialEntry.what_i_did || '');
      setWhatILearned(initialEntry.what_i_learned || '');
      setProblemsAndBlockers(initialEntry.problems_and_blockers || '');
      setSolutionsOrDecisions(initialEntry.solutions_or_decisions || '');
      setNextStep(initialEntry.next_step || '');
      setTools(initialEntry.tools_and_technologies || []);
      setEvidenceLinks(initialEntry.evidence_links || []);
      setSelectedTags(initialEntry.tags || []);
    } else {
      setEntryTitle('');
      setWorkDate(new Date().toISOString().split('T')[0]);
      setWhatIDid('');
      setWhatILearned('');
      setProblemsAndBlockers('');
      setSolutionsOrDecisions('');
      setNextStep('');
      setTools([]);
      setEvidenceLinks([]);
      setSelectedTags([]);
    }
    setError('');
  }, [initialEntry, isOpen]);

  if (!isOpen) return null;

  const handleAddTool = () => {
    const trimmed = newTool.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleAddLink = () => {
    const trimmed = newLink.trim();
    if (trimmed && !evidenceLinks.includes(trimmed)) {
      setEvidenceLinks([...evidenceLinks, trimmed]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setEvidenceLinks(evidenceLinks.filter((l) => l !== linkToRemove));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim()) {
      setError('Entry title is required.');
      return;
    }

    const now = new Date().toISOString();
    const entry: JournalEntry = {
      entry_id: initialEntry ? initialEntry.entry_id : `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entry_title: entryTitle.trim(),
      target_type: targetType,
      target_id: targetId,
      created_at: initialEntry ? initialEntry.created_at : now,
      updated_at: now,
      work_date: workDate,
      what_i_did: whatIDid.trim(),
      what_i_learned: whatILearned.trim(),
      problems_and_blockers: problemsAndBlockers.trim(),
      solutions_or_decisions: solutionsOrDecisions.trim(),
      tools_and_technologies: tools,
      evidence_links: evidenceLinks,
      next_step: nextStep.trim(),
      tags: selectedTags,
    };

    onSave(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                {targetId}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {targetType === 'project' ? 'Flagship Project Journal' : 'Sub-Project Journal'}
              </span>
            </div>
            <h2 className="text-base font-semibold text-neutral-100 mt-1 line-clamp-1">
              {targetTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs rounded-md bg-rose-950/60 border border-rose-800 text-rose-300">
              {error}
            </div>
          )}

          {/* Title & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Entry Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={entryTitle}
                onChange={(e) => {
                  setEntryTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. First implementation, Retest results..."
                className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TITLE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEntryTitle(s)}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Work Date
              </label>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-neutral-300"
              />
            </div>
          </div>

          {/* What I Did */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <span>What I Did</span>
              <span className="text-[11px] text-neutral-500 font-normal">(Tasks completed, experiments run, scripts written)</span>
            </label>
            <textarea
              rows={4}
              value={whatIDid}
              onChange={(e) => setWhatIDid(e.target.value)}
              placeholder="Detailed record of what was personally configured, written, audited, or executed..."
              className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans placeholder:text-neutral-600"
            />
          </div>

          {/* What I Learned */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <span>What I Learned</span>
              <span className="text-[11px] text-neutral-500 font-normal">(Technical takeaways, protocol behavior, tool nuances)</span>
            </label>
            <textarea
              rows={3}
              value={whatILearned}
              onChange={(e) => setWhatILearned(e.target.value)}
              placeholder="Key insights, internal mechanics, protocol responses, defensive observations..."
              className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed placeholder:text-neutral-600"
            />
          </div>

          {/* Problems / Blockers & Solutions / Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Problems / Blockers
              </label>
              <textarea
                rows={3}
                value={problemsAndBlockers}
                onChange={(e) => setProblemsAndBlockers(e.target.value)}
                placeholder="Failures, bugs, syntax issues, network obstacles..."
                className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Solutions / Decisions
              </label>
              <textarea
                rows={3}
                value={solutionsOrDecisions}
                onChange={(e) => setSolutionsOrDecisions(e.target.value)}
                placeholder="How the blocker was resolved or architecture adjusted..."
                className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Evidence / Links */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Evidence / Links</span>
              <span className="text-[11px] text-neutral-500 font-normal">(GitHub commits, test outputs, reports, screenshots)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
                placeholder="https://github.com/... or /path/to/report.pdf"
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {evidenceLinks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {evidenceLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300"
                  >
                    <span className="truncate max-w-[90%]">{link}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tools & Technologies */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-400" />
              <span>Tools & Technologies Used</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
                placeholder="e.g. Wireshark, BloodHound, Burp Suite, AWS IAM..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-xs text-neutral-200"
                  >
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="text-neutral-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Next Step */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Next Step / Action
            </label>
            <input
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="Immediate next technical action to take..."
              className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Tags (from Part E) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Track Tags</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-neutral-950 border border-neutral-800 rounded-lg">
              {GLOBAL_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Save Journal Entry
          </button>
        </div>
      </div>
    </div>
  );
};
