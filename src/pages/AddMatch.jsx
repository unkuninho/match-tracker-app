import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMatch } from '../api/matchesApi';
import { PlusCircle, Loader2 } from 'lucide-react';
import { championshipOptions, tvChannelOptions } from '../data/formOptions.js';

const statusOptions = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'live', label: 'Ao Vivo' },
  { value: 'finished', label: 'Finalizada' },
];

const AddMatch = () => {
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    match_date: '',
    match_time: '',
    championship: '',
    tv_channel: '',
    home_score: null,
    away_score: null,
    status: 'scheduled',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.home_team || !formData.away_team || !formData.match_date || !formData.match_time) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const dataToSave = {
        ...formData,
        home_score: formData.status === 'finished' ? Number(formData.home_score) : null,
        away_score: formData.status === 'finished' ? Number(formData.away_score) : null,
      };
      await addMatch(dataToSave);
      navigate('/all-matches');
    } catch (err) {
      setError('Ocorreu um erro ao salvar a partida. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Título responsivo */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">Adicionar Nova Partida</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Time da Casa" name="home_team" value={formData.home_team} onChange={handleChange} required />
          <InputField label="Time Visitante" name="away_team" value={formData.away_team} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Data da Partida" name="match_date" type="date" value={formData.match_date} onChange={handleChange} required />
          <InputField label="Horário" name="match_time" type="time" value={formData.match_time} onChange={handleChange} required />
        </div>
        
        <SelectField label="Campeonato" name="championship" value={formData.championship} onChange={handleChange} options={championshipOptions} />
        <SelectField label="Canal de TV" name="tv_channel" value={formData.tv_channel} onChange={handleChange} options={tvChannelOptions} />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status da Partida</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        
        {formData.status === 'finished' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md">
            <InputField label="Placar Casa" name="home_score" type="number" value={formData.home_score ?? ''} onChange={handleChange} />
            <InputField label="Placar Visitante" name="away_score" type="number" value={formData.away_score ?? ''} onChange={handleChange} />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Salvando...</> : <><PlusCircle className="w-5 h-5" /> Adicionar Partida</>}
          </button>
        </div>
      </form>
    </div>
  );
};

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
      {options.map(option => (<option key={option} value={option}>{option}</option>))}
    </select>
  </div>
);

export default AddMatch;