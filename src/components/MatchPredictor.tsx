import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Info, Loader2, Target, Sword, MapPin, History, Users, RefreshCcw } from 'lucide-react';
import { predictMatch, PredictionRequest, PredictionResponse } from '../services/geminiService';

export default function MatchPredictor() {
  const [formData, setFormData] = useState<PredictionRequest>({
    opponent: '',
    venue: '',
    rrForm: '',
    opponentForm: '',
    tossResult: '',
    includesVaibhav: true,
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await predictMatch(formData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPrediction(null);
    setFormData({
      opponent: '',
      venue: '',
      rrForm: '',
      opponentForm: '',
      tossResult: '',
      includesVaibhav: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" id="match-predictor-root">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rr-blue/10 pb-6">
        <div>
          <h1 className="text-4xl font-display font-black text-rr-blue tracking-tighter">
            RR MATCH <span className="text-rr-pink">PREDICTOR</span>
          </h1>
          <p className="text-sm font-mono text-rr-blue/60 uppercase tracking-widest mt-1">
            Data-Driven Victory Analysis
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-rr-blue text-white rounded-full text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          SYSTEM ONLINE
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <motion.div 
          layout
          className={`lg:col-span-${prediction ? '5' : '12'} space-y-6 transition-all duration-500`}
        >
          <form onSubmit={handleSubmit} className="bg-white border-1 border-rr-blue/10 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-display font-bold text-xl flex items-center gap-2 text-rr-blue">
              <History className="w-5 h-5 text-rr-pink" /> 
              INPUT STATS
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-rr-blue/60 ml-1">Opponent Team</label>
                  <input
                    required
                    id="input-opponent"
                    placeholder="e.g. Mumbai Indians"
                    className="w-full px-4 py-2.5 rounded-xl border-1 border-rr-blue/10 bg-rr-blue/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-rr-blue/60 ml-1">Match Venue</label>
                  <input
                    required
                    id="input-venue"
                    placeholder="e.g. Sawai Mansingh Stadium"
                    className="w-full px-4 py-2.5 rounded-xl border-1 border-rr-blue/10 bg-rr-blue/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-rr-blue/60 ml-1">RR Recent Form (5 Matches)</label>
                  <input
                    required
                    id="input-rr-form"
                    placeholder="e.g. W W L W W"
                    className="w-full px-4 py-2.5 rounded-xl border-1 border-rr-blue/10 bg-rr-blue/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm font-mono"
                    value={formData.rrForm}
                    onChange={(e) => setFormData({ ...formData, rrForm: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-rr-blue/60 ml-1">Opponent Form (5 Matches)</label>
                  <input
                    required
                    id="input-opponent-form"
                    placeholder="e.g. L L W L W"
                    className="w-full px-4 py-2.5 rounded-xl border-1 border-rr-blue/10 bg-rr-blue/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm font-mono"
                    value={formData.opponentForm}
                    onChange={(e) => setFormData({ ...formData, opponentForm: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-rr-blue/60 ml-1">Toss Result (Optional)</label>
                <input
                  id="input-toss"
                  placeholder="e.g. RR batches first"
                  className="w-full px-4 py-2.5 rounded-xl border-1 border-rr-blue/10 bg-rr-blue/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rr-pink/20 transition-all text-sm"
                  value={formData.tossResult}
                  onChange={(e) => setFormData({ ...formData, tossResult: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-rr-pink/5 rounded-xl border-1 border-rr-pink/20">
                <input
                  type="checkbox"
                  id="v-surya-toggle"
                  className="w-4 h-4 accent-rr-pink"
                  checked={formData.includesVaibhav}
                  onChange={(e) => setFormData({ ...formData, includesVaibhav: e.target.checked })}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-rr-blue leading-none">Factor in Vaibhav Suryavanshi</span>
                  <span className="text-[10px] text-rr-blue/60 uppercase font-mono mt-1">High-ceiling Opener Analytics</span>
                </div>
              </div>
            </div>

            <button
              id="predict-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-rr-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rr-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-rr-blue/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  GENERATE PREDICTION
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border-1 border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              {error}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="bg-white border-1 border-rr-blue/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                {/* Probability Card */}
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-rr-blue/40 uppercase">Confidence</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                      prediction.confidence === 'High' || prediction.confidence === 'Very High' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prediction.confidence}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Win Percentage Circle */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-rr-blue/5"
                        />
                        <motion.circle
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * prediction.winProbability) / 100 }}
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray="440"
                          className="text-rr-pink"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-display font-black text-rr-blue">{prediction.winProbability}%</span>
                        <span className="text-[10px] font-mono font-bold text-rr-blue/40">WIN PROBABILITY</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm italic font-medium text-rr-blue/80 max-w-sm">
                        "{prediction.oneLineSummary}"
                      </p>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-rr-blue/40 uppercase tracking-widest flex items-center gap-2">
                        <Sword className="w-3 h-3" /> MATCH RATIONALE
                      </h3>
                      <ul className="space-y-3">
                        {prediction.rationale.map((item, i) => (
                          <li key={i} className="text-sm text-rr-blue/80 flex gap-3 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-rr-blue/40 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3" /> STRATEGIC RISKS
                      </h3>
                      <div className="bg-rr-blue/5 p-4 rounded-xl border-l-2 border-rr-blue">
                        <p className="text-sm text-rr-blue/80 leading-relaxed font-medium">
                          {prediction.keyMatchups}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-rr-blue/5 flex justify-end">
                    <button 
                      onClick={resetForm}
                      className="text-xs font-mono font-bold text-rr-blue/60 hover:text-rr-pink flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-rr-pink/5 transition-all"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      RE-RUN SIMULATION
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder when no result */}
        {!prediction && !loading && (
          <div className="lg:col-span-7 hidden lg:flex flex-col items-center justify-center bg-rr-blue/3 rounded-2xl border-2 border-dashed border-rr-blue/10 p-12 text-center space-y-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Trophy className="w-12 h-12 text-rr-blue/10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-rr-blue/40">READY FOR SIMULATION</h3>
              <p className="text-xs font-mono text-rr-blue/30 max-w-xs uppercase">
                Input match parameters to begin advanced outcome projection.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Meta Data */}
      <footer className="pt-12 text-center text-[10px] font-mono text-rr-blue/30 uppercase tracking-[0.2em] space-y-4">
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Jaipur CMS HQ
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" /> Core Analytics Engine 
          </div>
        </div>
        <p>© 2026 Rajasthan Royals Strategic Operations</p>
      </footer>
    </div>
  );
}
