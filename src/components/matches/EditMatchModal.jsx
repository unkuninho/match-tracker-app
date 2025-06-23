import React, { useState, useEffect } from 'react';
import { championshipOptions, tvChannelOptions } from '../../data/formOptions';
import { Loader2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'live', label: 'Ao Vivo' },
  { value: 'finished', label: 'Finalizada' },
];

const InputField = ({ label, name, type = 'text', value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

const SelectField = ({ label, name, value, onChange, required = false, options = [] }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
      <option value="" disabled>Selecione uma opção</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

export default function EditMatchModal({ isOpen, onClose, match, onSave }) {
  const [formData, setFormData] = useState({ ...match });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match) {
      setFormData({ ...match });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSave = {
      ...formData,
      home_score: formData.status === 'finished' ? Number(formData.home_score) : null,
      away_score: formData.status === 'finished' ? Number(formData.away_score) : null,
    };
    await onSave(dataToSave);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Editar Partida</h2>
                <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Time da Casa" name="home_team" value={formData.home_team ?? ''} onChange={handleChange} required />
                <InputField label="Time Visitante" name="away_team" value={formData.away_team ?? ''} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Data da Partida" name="match_date" type="date" value={formData.match_date ?? ''} onChange={handleChange} required />
                <InputField label="Horário" name="match_time" type="time" value={formData.match_time ?? ''} onChange={handleChange} required />
              </div>
              
              <SelectField label="Campeonato" name="championship" value={formData.championship ?? ''} onChange={handleChange} options={championshipOptions} />
              <SelectField label="Canal de TV" name="tv_channel" value={formData.tv_channel ?? ''} onChange={handleChange} options={tvChannelOptions} />

              {/* NOVOS CAMPOS PARA PLACAR E STATUS */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status da Partida</label>
                <select name="status" value={formData.status ?? 'scheduled'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              
              {formData.status === 'finished' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md">
                  <InputField label="Placar Casa" name="home_score" type="number" value={formData.home_score ?? ''} onChange={handleChange} />
                  <InputField label="Placar Visitante" name="away_score" type="number" value={formData.away_score ?? ''} onChange={handleChange} />
                </div>
              )}

              <div className="flex justify-end pt-4 gap-4">
                <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} Salvar Alterações
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}