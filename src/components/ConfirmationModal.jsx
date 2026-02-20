import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">{title}</h3>
        <p className="text-slate-500 font-medium mb-10 text-sm">{message}</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;