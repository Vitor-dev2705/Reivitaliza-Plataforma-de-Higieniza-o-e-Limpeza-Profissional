import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import { Image, Video, LayoutGrid, Plus, Trash2, X, Loader } from 'lucide-react'

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return <Loader size={16} className="animate-spin text-emerald-600" />
}

// ── Upload Slot ───────────────────────────────────────────────────────────────
function UploadSlot({ accept = 'image/*', src, isVideo, onUpload, onRemove, height = 110, loading }) {
  const ref = useRef()
  return (
    <div
      onClick={() => !loading && ref.current?.click()}
      className={`relative rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all ${
        src ? 'border-transparent' : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
      }`}
      style={{ height }}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}
      {src ? (
        <>
          {isVideo
            ? <video src={src} className="w-full h-full object-cover absolute inset-0" muted playsInline />
            : <img src={src} alt="" className="w-full h-full object-cover absolute inset-0" />
          }
          <button onClick={e => { e.stopPropagation(); onRemove() }}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-red-50">
            <X size={14} className="text-gray-600" />
          </button>
          <button onClick={e => { e.stopPropagation(); ref.current?.click() }}
            className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
            🔄 Trocar
          </button>
        </>
      ) : (
        <span className="text-xs text-gray-400 text-center px-2 pointer-events-none">
          {isVideo ? '🎬 Vídeo' : '📷 Foto'}<br />Clique para upload
        </span>
      )}
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = '' }} />
    </div>
  )
}

function SectionTitle({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-emerald-600">{typeof icon === 'string' ? icon : icon}</span>
      <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">{label}</h3>
    </div>
  )
}

// ── Aba Serviços ──────────────────────────────────────────────────────────────
function ServicesTab() {
  const { services, uploadServiceMedia, clearServiceMedia, addService, removeService, updateServiceText } = useAdmin()
  const [uploading, setUploading] = useState({})
  const [localText, setLocalText] = useState({})

  const handleUpload = async (id, field, file) => {
    setUploading(p => ({ ...p, [`${id}_${field}`]: true }))
    try { await uploadServiceMedia(id, field, file) } catch (e) { alert('Erro no upload: ' + e.message) }
    setUploading(p => ({ ...p, [`${id}_${field}`]: false }))
  }

  const handleText = (id, field, value) => {
    setLocalText(p => ({ ...p, [`${id}_${field}`]: value }))
    clearTimeout(window[`_timer_${id}_${field}`])
    window[`_timer_${id}_${field}`] = setTimeout(() => {
      updateServiceText(id, field, value).catch(console.error)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <SectionTitle icon={<LayoutGrid size={16} />} label="Serviços — Antes & Depois" />
      <p className="text-xs text-gray-500 mb-3">Edite título, descrição e imagens/vídeos. Você pode adicionar ou remover serviços.</p>

      {services.map(svc => (
        <div key={svc.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 text-black"
              value={localText[`${svc.id}_title`] ?? svc.title ?? ''}
              onChange={e => handleText(svc.id, 'title', e.target.value)}
              placeholder="Título do serviço"
            />
            <button onClick={() => { if (confirm('Remover este serviço?')) removeService(svc.id) }}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-emerald-400 resize-none text-black"
            rows={2}
            value={localText[`${svc.id}_description`] ?? svc.description ?? ''}
            onChange={e => handleText(svc.id, 'description', e.target.value)}
            placeholder="Descrição..."
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">📷 Foto Antes</p>   
              <UploadSlot src={svc.before} loading={uploading[`${svc.id}_before`]}
                onUpload={f => handleUpload(svc.id, 'before', f)}
                onRemove={() => clearServiceMedia(svc.id, 'before')} height={90} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">📷 Foto Depois</p>
              <UploadSlot src={svc.after} loading={uploading[`${svc.id}_after`]}
                onUpload={f => handleUpload(svc.id, 'after', f)}
                onRemove={() => clearServiceMedia(svc.id, 'after')} height={90} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">🎬 Vídeo Antes</p>
              <UploadSlot src={svc.before_video} isVideo accept="video/*" loading={uploading[`${svc.id}_before_video`]}
                onUpload={f => handleUpload(svc.id, 'before_video', f)}
                onRemove={() => clearServiceMedia(svc.id, 'before_video')} height={90} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">🎬 Vídeo Depois</p>
              <UploadSlot src={svc.after_video} isVideo accept="video/*" loading={uploading[`${svc.id}_after_video`]}
                onUpload={f => handleUpload(svc.id, 'after_video', f)}
                onRemove={() => clearServiceMedia(svc.id, 'after_video')} height={90} />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addService}
        className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 flex items-center justify-center gap-2 transition text-sm">
        <Plus size={18} /> Adicionar Novo Serviço
      </button>
    </div>
  )
}

// ── Aba Blocos Extras ─────────────────────────────────────────────────────────
function BlocksTab() {
  const { extraBlocks, addBlock, removeBlock, updateBlockTitle, addBlockItem, removeBlockItem } = useAdmin()
  const [uploading, setUploading] = useState({})

  const handleUpload = async (blockId, file) => {
    setUploading(p => ({ ...p, [blockId]: true }))
    try { await addBlockItem(blockId, file) } catch (e) { alert('Erro no upload: ' + e.message) }
    setUploading(p => ({ ...p, [blockId]: false }))
  }

  return (
    <div className="space-y-4">
      <SectionTitle icon={<Image size={16} />} label="Galerias & Mídias Extras" />
      <p className="text-xs text-gray-500 mb-3">
        Adicione seções de fotos e vídeos em qualquer lugar do site. As seções aparecem entre os serviços e as avaliações.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => addBlock('gallery')}
          className="py-2 px-3 border-2 border-dashed border-blue-300 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-50 flex items-center justify-center gap-1 transition">
          <Image size={14} /> + Galeria de Fotos
        </button>
        <button onClick={() => addBlock('media')}
          className="py-2 px-3 border-2 border-dashed border-purple-300 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-50 flex items-center justify-center gap-1 transition">
          <Video size={14} /> + Seção Foto/Vídeo
        </button>
      </div>

      {extraBlocks.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-3xl mb-2">🖼️</p>
          <p className="font-semibold">Nenhuma seção criada ainda</p>
          <p className="text-xs mt-1">Crie uma galeria ou seção de mídia acima.</p>
        </div>
      )}

      {extraBlocks.map(block => (
        <div key={block.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <div className="flex gap-2 mb-3 items-center">
            <input
              className="flex-1 text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
              value={block.title}
              onChange={e => updateBlockTitle(block.id, e.target.value)}
            />
            <button onClick={() => { if (confirm('Remover esta seção?')) removeBlock(block.id) }}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {block.items.map(item => (
              <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
                {item.type === 'video'
                  ? <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                  : <img src={item.url} alt="" className="w-full h-full object-cover" />
                }
                <button onClick={() => removeBlockItem(block.id, item.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600">
                  ×
                </button>
                {item.type === 'video' && (
                  <div className="absolute bottom-1 left-1 bg-black/50 rounded text-white text-[9px] px-1">▶</div>
                )}
              </div>
            ))}

            <label className={`aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 text-[10px] text-gray-400 font-bold gap-1 transition ${uploading[block.id] ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading[block.id]
                ? <Spinner />
                : <><Plus size={18} className="text-gray-400" />{block.type === 'media' ? 'Foto/Vídeo' : 'Foto'}</>
              }
              <input type="file" accept={block.type === 'media' ? 'image/*,video/*' : 'image/*'} multiple className="hidden"
                disabled={uploading[block.id]}
                onChange={async e => {
                  for (const f of Array.from(e.target.files)) await handleUpload(block.id, f)
                  e.target.value = ''
                }} />
            </label>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">{block.items.length} item{block.items.length !== 1 ? 's' : ''}</p>
        </div>
      ))}
    </div>
  )
}

// ── Aba Avaliações ────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [newForm,  setNewForm]  = useState(false)
  const [newData,  setNewData]  = useState({ name: '', rating: 5, text: '', photo_url: '' })

  const getSupabase = () => import('../supabaseClient').then(m => m.supabase)

  const reload = async () => {
    const sb = await getSupabase()
    const { data } = await sb.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews(data || [])
  }

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const toggle = async (id, visible) => {
    const sb = await getSupabase()
    await sb.from('reviews').update({ visible: !visible }).eq('id', id)
    reload()
  }

  const del = async (id) => {
    if (!confirm('Deletar esta avaliação?')) return
    const sb = await getSupabase()
    await sb.from('reviews').delete().eq('id', id)
    reload()
  }

  const create = async () => {
    if (!newData.name || !newData.text) { alert('Preencha nome e texto'); return }
    const sb = await getSupabase()
    await sb.from('reviews').insert([{ ...newData, source: 'manual', visible: true }])
    setNewData({ name: '', rating: 5, text: '', photo_url: '' })
    setNewForm(false)
    reload()
  }

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="space-y-4">
      <SectionTitle icon="💬" label="Gerenciar Avaliações" />

      <button onClick={() => setNewForm(true)}
        className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-700 text-sm font-bold rounded-2xl hover:bg-emerald-50 flex items-center justify-center gap-2">
        <Plus size={16} /> Nova Avaliação Manual
      </button>

      {newForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
          <input placeholder="Nome do cliente" value={newData.name}
            onChange={e => setNewData(p => ({ ...p, name: e.target.value }))}
            className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
          <textarea placeholder="Texto da avaliação" value={newData.text}
            onChange={e => setNewData(p => ({ ...p, text: e.target.value }))}
            className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none resize-none" rows={3} />
          <select value={newData.rating} onChange={e => setNewData(p => ({ ...p, rating: +e.target.value }))}
            className="w-full text-sm border rounded-lg px-3 py-2">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrela{n>1?'s':''}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={create} className="flex-1 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">Criar</button>
            <button onClick={() => setNewForm(false)} className="flex-1 py-2 bg-gray-300 text-gray-700 text-sm font-bold rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      {reviews.length === 0 && !newForm && (
        <p className="text-center text-gray-400 text-sm py-6 bg-gray-50 rounded-2xl">Nenhuma avaliação no banco ainda.</p>
      )}

      {reviews.map(r => (
        <div key={r.id} className={`border rounded-xl p-3 text-sm ${r.visible ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
          <div className="flex justify-between mb-1">
            <span className="font-bold text-gray-800">{r.name}</span>
            <span className="text-yellow-500 text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
          </div>
          <p className="text-gray-600 text-xs italic mb-2 line-clamp-2">"{r.text}"</p>
          <div className="flex gap-2">
            <button onClick={() => toggle(r.id, r.visible)}
              className={`text-xs px-3 py-1 rounded-lg font-bold ${r.visible ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
              {r.visible ? '👁 Visível' : '🙈 Oculto'}
            </button>
            <button onClick={() => del(r.id)} className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white font-bold">🗑 Deletar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Panel ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'services', label: '🧹 Serviços'   },
  { id: 'blocks',   label: '🖼️ Seções'     },
  { id: 'reviews',  label: '💬 Avaliações' },
]

export default function AdminPanel({ onClose }) {
  const { logout, saving } = useAdmin()
  const [tab, setTab] = useState('services')

  return (
    <div className="fixed inset-0 z-[9998] flex" onClick={onClose}>
      <div className="flex-1 bg-black/40" />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-5 pt-6 pb-4 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">PAINEL ADMINISTRATIVO</div>
              <h2 className="text-white text-xl font-bold">Reivitaliza</h2>
              <div className="flex items-center gap-1 mt-1">
                {saving
                  ? <><Loader size={10} className="animate-spin text-emerald-300" /><span className="text-emerald-300 text-xs"> Salvando…</span></>
                  : <span className="text-emerald-300 text-xs">✓ Salvo automaticamente no Supabase</span>
                }
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { logout(); onClose() }}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg font-bold transition">
                Sair
              </button>
              <button onClick={onClose} className="text-white bg-white/20 hover:bg-white/30 w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition">
                ×
              </button>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  tab === t.id ? 'bg-white text-emerald-700' : 'text-white/80 hover:bg-white/20'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
              {tab === 'services' && <ServicesTab />}
              {tab === 'blocks'   && <BlocksTab />}
              {tab === 'reviews'  && <ReviewsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-3 px-5 bg-gray-50 flex-shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            ☁️ Imagens → Supabase Storage · Dados → Banco de dados Supabase
          </p>
        </div>
      </motion.div>
    </div>
  )
}
