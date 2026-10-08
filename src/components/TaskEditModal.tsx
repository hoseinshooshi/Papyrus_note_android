import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../types';
import { 
  X, 
  Trash2, 
  Calendar, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Save, 
  Pencil,
  Check
} from 'lucide-react';

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  categories: string[];
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories,
}) => { 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Work');
  const [completed, setCompleted] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setCategory(task.category || 'Work');
      setCompleted(task.completed || false);
      setTags(task.tags || []);
      setTagInput('');
      setShowDeleteConfirm(false);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      category,
      completed,
      completedAt: completed ? (task.completedAt || Date.now()) : undefined,
      tags: tags.length > 0 ? tags : [category.toLowerCase()],
    });
    onClose();
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const setQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F0] border border-[#E5DECD] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC9] flex items-center justify-between bg-[#F4ECE0]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2E251C] text-[#FAF7F0] flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-base text-[#2C241C]">
                Edit Task
              </h2>
              <p className="text-[11px] text-[#7A6B5B]">
                Update title, priority, due date, and details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7D6C] hover:text-[#2C241C] hover:bg-black/5 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                  completed
                    ? 'bg-[#5B8258] border-[#4A6D47] text-white shadow-2xs'
                    : 'border-[#C4B7A3] hover:border-[#8C724B] bg-white'
                }`}
              >
                {completed && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <span className="text-xs font-semibold text-[#2C241C]">
                {completed ? 'Status: Completed' : 'Status: In Progress / Pending'}
              </span>
            </div>
            <span className="text-[10px] text-[#8C7D6C]">
              {completed ? 'Done' : 'Pending'}
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be accomplished?"
              className="w-full text-sm px-3 py-2.5 bg-white border border-[#DDD2BC] rounded-xl text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:border-[#8C724B] focus:ring-1 focus:ring-[#8C724B] transition-all font-medium"
            />
          </div>

          {/* Description / Notes */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional context, references, or instructions..."
              className="w-full text-xs px-3 py-2 bg-white border border-[#DDD2BC] rounded-xl text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:border-[#8C724B] focus:ring-1 focus:ring-[#8C724B] transition-all resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? p === 'high'
                          ? 'bg-[#B5736E] border-[#9E5752] text-white shadow-xs'
                          : p === 'medium'
                          ? 'bg-[#C29D38] border-[#A88528] text-white shadow-xs'
                          : 'bg-[#5B8258] border-[#486B45] text-white shadow-xs'
                        : 'bg-[#F2ECE0] border-[#DDD2BC] text-[#6D5E4F] hover:bg-[#EAE1D2]'
                    }`}
                  >
                    {p === 'high' && <Flame className="w-3.5 h-3.5" />}
                    {p === 'medium' && <Clock className="w-3.5 h-3.5" />}
                    {p === 'low' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date Row with Quick Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8C7D6C]" />
                <span>Due Date</span>
              </label>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="text-[10px] text-[#A14740] hover:underline"
                >
                  Clear Date
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#DDD2BC] rounded-xl text-xs text-[#2C241C] focus:outline-none focus:border-[#8C724B]"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                    dueDate === todayStr 
                      ? 'bg-[#2E251C] text-white border-[#2E251C]' 
                      : 'bg-[#F2ECE0] border-[#DDD2BC] text-[#554737] hover:bg-[#EAE1D2]'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#DDD2BC] bg-[#F2ECE0] hover:bg-[#EAE1D2] text-[#554737] text-[11px] font-medium transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#DDD2BC] bg-[#F2ECE0] hover:bg-[#EAE1D2] text-[#554737] text-[11px] font-medium transition-colors"
                >
                  +1 Week
                </button>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#8C7D6C]" />
              <span>Category</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD2BC] rounded-xl text-xs text-[#2C241C] focus:outline-none focus:border-[#8C724B]"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5E4F] uppercase tracking-wider">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 px-3 py-1.5 bg-white border border-[#DDD2BC] rounded-xl text-xs text-[#2C241C] focus:outline-none focus:border-[#8C724B]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#EFE9DC] hover:bg-[#E5DDC9] border border-[#DDD2BC] rounded-xl text-xs font-semibold text-[#483B2D] transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-[#EDE4D3] text-[#554737] text-[11px] font-medium flex items-center gap-1"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-[#998B7B] hover:text-[#2C241C]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="p-3 rounded-xl bg-[#FBF0EE] border border-[#F0CEC9] text-[#9E3F38] space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-xs">
                  Are you sure you want to delete this task?
                </span>
              </div>
              <p className="text-[11px] text-[#A14740]">
                This obligation will be permanently removed.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(task.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition-colors"
                >
                  Yes, Delete Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#F0CEC9] text-[#6D5E4F] hover:bg-[#F2ECE0] text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E8DFC9] flex items-center justify-between gap-3">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 rounded-xl text-[#A14740] hover:bg-[#FBECE9] border border-transparent hover:border-[#F2DFDD] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#EFE9DC] hover:bg-[#E5DDC9] border border-[#DDD2BC] text-[#483B2D] text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#45372A] disabled:opacity-40 text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
