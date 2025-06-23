import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Calendar, Clock, Tv, ArrowLeft, Send, Loader2, Share2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth.js';
import { addComment, getCommentsForMatch } from '../api/commentsApi.js';
import ShareModal from '../components/share/ShareModal.jsx'; // <-- IMPORTANDO O NOVO MODAL

const CommentsSection = ({ matchId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await getCommentsForMatch(matchId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchComments();
    }
  }, [matchId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const commentData = { text: newComment, user: { uid: user.uid, name: user.fullName || user.email } };
      await addComment(matchId, commentData);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Comentários ({comments.length})</h3>
      {user && (
        <form onSubmit={handleSubmitComment} className="flex gap-4 mb-8">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Deixe seu comentário..." className="flex-grow border-b-2 bg-transparent focus:outline-none focus:border-blue-500" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-slate-400" disabled={!newComment.trim()}><Send className="w-5 h-5" /></button>
        </form>
      )}
      <div className="space-y-6">
        {loadingComments ? <p>Carregando comentários...</p> : comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-grow bg-slate-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-bold text-slate-800">{comment.user.name}</p>
                <p className="text-xs text-slate-500">{comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: ptBR }) : 'agora'}</p>
              </div>
              <p className="text-slate-700 mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
        {!loadingComments && comments.length === 0 && (
          <p className="text-slate-500 text-center">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  );
};

export default function MatchDetailPage() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- NOVO ESTADO PARA O MODAL

  useEffect(() => {
    const fetchMatch = async () => {
      if (!matchId) { setError('ID da partida não encontrado na URL.'); setLoading(false); return; }
      setLoading(true);
      try {
        const matchDocRef = doc(db, 'matches', matchId);
        const matchDoc = await getDoc(matchDocRef);
        if (matchDoc.exists()) { setMatch({ id: matchDoc.id, ...matchDoc.data() }); } 
        else { setError('Partida não encontrada.'); }
      } catch (err) { setError('Erro ao buscar a partida.'); console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMatch();
  }, [matchId]);

  if (loading) { return <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>; }
  if (error) { return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>; }
  if (!match) { return <div className="text-center p-10 text-slate-500">Não foi possível carregar os dados da partida.</div>; }
  
  const matchDate = new Date(match.match_date);
  const isMatchFinished = match.status === 'finished';

  return (
    <>
      {/* O ShareModal agora é renderizado aqui */}
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        match={match} 
      />
      
      <div>
        <Link to="/all-matches" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6"><ArrowLeft className="w-4 h-4" />Voltar para todas as partidas</Link>
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <div className="text-center">
            <p className="font-semibold text-emerald-700">{match.championship}</p>
            <div className="flex flex-col md:flex-row justify-around items-center gap-4 my-6">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-center">{match.home_team}</span>
              
              {isMatchFinished ? (
                <div className="text-4xl md:text-6xl font-bold text-slate-900 bg-slate-100 px-4 py-2 md:px-6 md:py-3 rounded-lg order-first md:order-none">
                  <span>{match.home_score}</span>
                  <span className="mx-2 md:mx-3">-</span>
                  <span>{match.away_score}</span>
                </div>
              ) : (
                <span className="text-xl md:text-4xl font-light text-slate-500">vs</span>
              )}

              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-center">{match.away_team}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-x-4 gap-y-2 md:gap-x-6 text-slate-600 text-sm md:text-base">
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>{format(matchDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}</span></div>
              {!isMatchFinished && (
                <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span>{match.match_time}</span></div>
              )}
              <div className="flex items-center gap-2"><Tv className="w-5 h-5" /><span>{match.tv_channel}</span></div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t">
            {/* O botão agora apenas abre o modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:bg-slate-900"
            >
              <Share2 className="w-5 h-5" />
              Avaliar e Compartilhar
            </button>
            <p className="text-xs text-slate-500 mt-3 px-4">
              Dê sua nota para a partida e gere um card para compartilhar!
            </p>
          </div>
        </div>
        <CommentsSection matchId={match.id} />
      </div>
    </>
  );
}