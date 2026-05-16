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
  const { uploadFileToStorage } = useAdmin()
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [newForm,  setNewForm]  = useState(false)
  const [newData,  setNewData]  = useState({ name: '', rating: 5, text: '', photo_url: '' })
  const [editingId, setEditingId] = useState(null)
  const [editData,  setEditData]  = useState({})
  const [uploadingPhoto, setUploadingPhoto] = useState(null)
  const photoRef = useRef()
  const editPhotoRef = useRef()

  const getApi = () => import('../api')

  const reload = async () => {
    const api = await getApi()
    const data = await api.fetchReviews()
    setReviews(data || [])
  }

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const toggle = async (id, visible) => {
    const api = await getApi()
    await api.updateReview(id, { visible: !visible })
    reload()
  }

  const del = async (id) => {
    if (!confirm('Deletar esta avaliação?')) return
    const api = await getApi()
    await api.deleteReview(id)
    reload()
  }

  const handlePhotoUpload = async (file, forNew = true) => {
    setUploadingPhoto(forNew ? 'new' : editingId)
    try {
      const ext = file.name.split('.').pop()
      const path = `reviews/photo_${Date.now()}.${ext}`
      const url = await uploadFileToStorage(file, path)
      if (forNew) {
        setNewData(p => ({ ...p, photo_url: url }))
      } else {
        setEditData(p => ({ ...p, photo_url: url }))
      }
    } catch (e) { alert('Erro no upload: ' + e.message) }
    setUploadingPhoto(null)
  }

  const create = async () => {
    if (!newData.name || !newData.text) { alert('Preencha nome e texto'); return }
    const api = await getApi()
    await api.createReview(newData)
    setNewData({ name: '', rating: 5, text: '', photo_url: '' })
    setNewForm(false)
    reload()
  }

  const startEdit = (r) => {
    setEditingId(r.id)
    setEditData({ name: r.name, rating: r.rating, text: r.text, photo_url: r.photo_url || '' })
  }

  const saveEdit = async () => {
    const api = await getApi()
    await api.updateReview(editingId, editData)
    setEditingId(null)
    setEditData({})
    reload()
  }

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="space-y-4">
      <SectionTitle icon="💬" label="Gerenciar Avaliações" />
      <p className="text-xs text-gray-500 mb-2">
        Adicione avaliações manualmente. Elas aparecem no carrossel de depoimentos para os visitantes.
        Você pode ocultar ou excluir a qualquer momento.
      </p>

      <button onClick={() => setNewForm(true)}
        className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-700 text-sm font-bold rounded-2xl hover:bg-emerald-50 flex items-center justify-center gap-2">
        <Plus size={16} /> Nova Avaliação
      </button>

      {/* Formulário de nova avaliação */}
      <AnimatePresence>
        {newForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-emerald-700 uppercase">Nova Avaliação</p>

              {/* Foto do cliente */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => photoRef.current?.click()}
                  className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center cursor-pointer overflow-hidden bg-white hover:bg-emerald-50 flex-shrink-0"
                >
                  {uploadingPhoto === 'new' ? (
                    <Spinner />
                  ) : newData.photo_url ? (
                    <img src={newData.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">📷</span>
                  )}
                </div>
                <div className="flex-1">
                  <input placeholder="Nome do cliente" value={newData.name}
                    onChange={e => setNewData(p => ({ ...p, name: e.target.value }))}
                    className="w-full text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 text-black" />
                </div>
                <input ref={photoRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, true); e.target.value = '' }} />
              </div>

              <textarea placeholder="O que o cliente disse..." value={newData.text}
                onChange={e => setNewData(p => ({ ...p, text: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 resize-none text-black" rows={3} />

              {/* Estrelas clicáveis */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Nota</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setNewData(p => ({ ...p, rating: n }))}
                      className={`text-xl transition-transform hover:scale-125 ${n <= newData.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={create} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">Salvar Avaliação</button>
                <button onClick={() => { setNewForm(false); setNewData({ name: '', rating: 5, text: '', photo_url: '' }) }}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-300 transition">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio */}
      {reviews.length === 0 && !newForm && (
        <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-semibold">Nenhuma avaliação cadastrada</p>
          <p className="text-xs mt-1">Clique acima para adicionar depoimentos dos seus clientes.</p>
        </div>
      )}

      {/* Lista de avaliações */}
      {reviews.map(r => (
        <div key={r.id} className={`border rounded-2xl p-4 text-sm transition-all ${
          r.visible ? 'border-emerald-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-60'
        }`}>
          {editingId === r.id ? (
            // MODO EDIÇÃO
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => editPhotoRef.current?.click()}
                  className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center cursor-pointer overflow-hidden bg-emerald-50 flex-shrink-0"
                >
                  {uploadingPhoto === editingId ? (
                    <Spinner />
                  ) : editData.photo_url ? (
                    <img src={editData.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm">📷</span>
                  )}
                </div>
                <input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                  className="flex-1 text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 text-black" />
                <input ref={editPhotoRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, false); e.target.value = '' }} />
              </div>
              <textarea value={editData.text} onChange={e => setEditData(p => ({ ...p, text: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 resize-none text-black" rows={3} />
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setEditData(p => ({ ...p, rating: n }))}
                    className={`text-xl transition-transform hover:scale-125 ${n <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">Salvar</button>
                <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg">Cancelar</button>
              </div>
            </div>
          ) : (
            // MODO VISUALIZAÇÃO
            <>
              <div className="flex items-start gap-3 mb-2">
                {r.photo_url ? (
                  <img src={r.photo_url} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-emerald-200 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 truncate">{r.name}</span>
                    <span className="text-yellow-400 text-xs flex-shrink-0 ml-2">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs italic mt-1 line-clamp-2">"{r.text}"</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pl-13">
                <button onClick={() => toggle(r.id, r.visible)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition ${
                    r.visible ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                  {r.visible ? '👁 Visível' : '🙈 Oculto'}
                </button>
                <button onClick={() => startEdit(r)}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                  ✏️ Editar
                </button>
                <button onClick={() => del(r.id)}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-bold bg-red-50 text-red-600 hover:bg-red-100 transition ml-auto">
                  🗑
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Contagem */}
      {reviews.length > 0 && (
        <p className="text-[10px] text-gray-400 text-center pt-2">
          {reviews.filter(r => r.visible).length} visível{reviews.filter(r => r.visible).length !== 1 ? 'is' : ''} de {reviews.length} total
        </p>
      )}
    </div>
  )
}

// ── Aba Vídeo / Impermeabilização ────────────────────────────────────────────
function VideoTab() {
  const { siteConfig, updateSiteConfig, uploadFileToStorage } = useAdmin()
  const [uploading, setUploading] = useState(false)
  const [localText, setLocalText] = useState({})
  const fileRef = useRef()

  const videoData = siteConfig?.videoSection || {}

  const handleVideoUpload = async (file) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `video/impermeabilizacao_${Date.now()}.${ext}`
      const url = await uploadFileToStorage(file, path)
      await updateSiteConfig({ videoSection: { ...videoData, videoUrl: url } })
    } catch (e) { alert('Erro no upload: ' + e.message) }
    setUploading(false)
  }

  const handleText = (field, value) => {
    setLocalText(p => ({ ...p, [field]: value }))
    clearTimeout(window[`_vtimer_${field}`])
    window[`_vtimer_${field}`] = setTimeout(() => {
      updateSiteConfig({ videoSection: { ...videoData, ...localText, [field]: value } }).catch(console.error)
    }, 800)
  }

  const currentTitle = localText.title ?? videoData.title ?? 'Nós cuidamos do seu investimento'
  const currentDesc = localText.description ?? videoData.description ?? 'Impermeabilização profissional cria uma barreira contra líquidos, sujeira e manchas, preservando cores, prolongando a vida útil dos tecidos e facilitando a limpeza do dia a dia.'
  const currentHighlight = localText.highlight ?? videoData.highlight ?? 'investimento'

  return (
    <div className="space-y-4">
      <SectionTitle icon={<Video size={16} />} label="Seção de Vídeo (Impermeabilização)" />
      <p className="text-xs text-gray-500 mb-3">
        Edite o vídeo, título e descrição da seção de impermeabilização que aparece no site.
      </p>

      {/* Upload do vídeo */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">🎬 Vídeo Principal</p>
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all h-[200px] ${
            videoData.videoUrl ? 'border-transparent' : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <Spinner />
              <span className="ml-2 text-sm text-emerald-600 font-medium">Enviando vídeo...</span>
            </div>
          )}
          {videoData.videoUrl ? (
            <>
              <video src={videoData.videoUrl} className="w-full h-full object-cover absolute inset-0" muted playsInline autoPlay loop />
              <button onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
                className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                🔄 Trocar Vídeo
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-3xl mb-2">🎬</p>
              <p className="text-xs text-gray-400 font-bold">Clique para enviar vídeo</p>
              <p className="text-[10px] text-gray-300 mt-1">MP4, MOV, WebM</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="video/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); e.target.value = '' }} />
        </div>
        {!videoData.videoUrl && (
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Sem vídeo personalizado — usando o vídeo padrão do site.
          </p>
        )}
      </div>

      {/* Textos */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">✏️ Textos da Seção</p>

        <div>
          <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Título</label>
          <input
            className="w-full text-sm font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 text-black"
            value={currentTitle}
            onChange={e => handleText('title', e.target.value)}
            placeholder="Nós cuidamos do seu investimento"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Palavra em destaque (verde)</label>
          <input
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 text-black"
            value={currentHighlight}
            onChange={e => handleText('highlight', e.target.value)}
            placeholder="investimento"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Descrição</label>
          <textarea
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 resize-none text-black"
            rows={4}
            value={currentDesc}
            onChange={e => handleText('description', e.target.value)}
            placeholder="Texto descritivo sobre impermeabilização..."
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">👁 Preview do título</p>
        <p className="text-lg font-extrabold text-gray-900">
          {currentTitle.split(currentHighlight).map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && <span className="text-green-700">{currentHighlight}</span>}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  )
}

// ── Main Panel ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'services', label: '🧹 Serviços'   },
  { id: 'video',    label: '🎬 Vídeo'      },
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
              {tab === 'video'    && <VideoTab />}
              {tab === 'blocks'   && <BlocksTab />}
              {tab === 'reviews'  && <ReviewsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-3 px-5 bg-gray-50 flex-shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            ☁️ Mídias → Supabase Storage · Dados → Neon PostgreSQL
          </p>
        </div>
      </motion.div>
    </div>
  )
}
