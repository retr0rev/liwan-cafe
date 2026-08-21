const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let supabase = null
function getSupabase() {
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)
  }
  return supabase
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images'

function auth(h) {
  if (!h || !h.startsWith('Bearer ')) return null
  try { return jwt.verify(h.slice(7), JWT_SECRET) } catch { return null }
}

function isValidUrl(v) {
  if (v === '') return true
  try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false }
}
function isValidPhone(v) {
  if (v === '') return true
  return /^\d{7,15}$/.test(v.replace(/\D/g,'')) && v.replace(/\D/g,'').length >= 8
}

let ready = false
async function init() {
  const s = getSupabase()
  await s.rpc('exec',{}).catch(()=>{})
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    const m = req.method
    const u = (req.url || '').split('?')[0]
    const s = getSupabase()
    if (!process.env.SUPABASE_URL) return res.status(500).json({ error: 'SUPABASE_URL not set' })

    if (u === '/api/health') return res.json({ ok: true })

    if (!ready) { ready = true }

    if (u === '/api/auth/login' && m === 'POST') {
      const { username, password } = req.body || {}
      if (!username || !password) return res.status(400).json({ error: 'Missing' })
      const { data } = await s.from('admin').select('*').eq('username', username).single()
      if (!data || !bcrypt.compareSync(password, data.password_hash)) return res.status(401).json({ error: 'Invalid' })
      return res.json({ token: jwt.sign({ id: data.id, username: data.username }, JWT_SECRET, { expiresIn: '7d' }), admin: { id: data.id, username: data.username } })
    }

    if (u === '/api/auth/verify' && m === 'GET') {
      const user = auth(req.headers.authorization)
      return user ? res.json({ admin: user }) : res.status(401).json({ error: 'Invalid' })
    }

    if (u === '/api/auth/password' && m === 'PUT') {
      const user = auth(req.headers.authorization)
      if (!user) return res.status(401).json({ error: 'Invalid' })
      const { currentPassword, newPassword } = req.body || {}
      if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ error: 'Invalid' })
      const { data } = await s.from('admin').select('*').eq('id', user.id).single()
      if (!bcrypt.compareSync(currentPassword, data.password_hash)) return res.status(401).json({ error: 'Wrong' })
      await s.from('admin').update({ password_hash: bcrypt.hashSync(newPassword, 10) }).eq('id', user.id)
      return res.json({ message: 'Updated' })
    }

    if (u === '/api/categories' && m === 'GET') {
      const user = auth(req.headers.authorization)
      let data, error
      try {
        const res1 = user ? await s.from('categories').select('*').order('display_order') : await s.from('categories').select('*').eq('is_active', true).order('display_order')
        data = res1.data; error = res1.error
        if (error && error.message.includes('display_order')) throw error
      } catch (e) {
        const res2 = user ? await s.from('categories').select('*').order('id') : await s.from('categories').select('*').eq('is_active', true).order('id')
        data = res2.data; error = res2.error
      }
      if (error) return res.status(500).json({ error: error.message })
      return res.json(data || [])
    }

    if (u === '/api/categories' && m === 'POST') {
      if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
      const { name_ar, name_en, display_order, is_active } = req.body || {}
      if (!name_ar || !name_en) return res.status(400).json({ error: 'Required' })
      let data, error
      const payload = { name_ar, name_en, is_active: is_active !== false }
      try {
        const r = await s.from('categories').insert({ ...payload, display_order: display_order ?? 0 }).select().single()
        data = r.data; error = r.error
        if (error && error.message.includes('display_order')) throw error
      } catch (e) {
        const r = await s.from('categories').insert(payload).select().single()
        data = r.data; error = r.error
      }
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    }

    const cm = u.match(/^\/api\/categories\/(\d+)$/)
    if (cm) {
      const id = Number(cm[1])
      if (m === 'PUT') {
        if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
        const { name_ar, name_en, is_active, display_order } = req.body || {}
        const upd = {}
        if (name_ar !== undefined) upd.name_ar = name_ar
        if (name_en !== undefined) upd.name_en = name_en
        if (is_active !== undefined) upd.is_active = is_active
        if (display_order !== undefined) upd.display_order = display_order
        upd.updated_at = new Date().toISOString()
        const { data } = await s.from('categories').update(upd).eq('id', id).select().single()
        return res.json(data)
      }
      if (m === 'DELETE') {
        if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
        await s.from('categories').delete().eq('id', id)
        return res.status(204).send('')
      }
    }

    if (u === '/api/items' && m === 'GET') {
      const user = auth(req.headers.authorization)
      const { data, error } = user
        ? await s.from('menu_items').select('*').order('display_order')
        : await s.from('menu_items').select('*').eq('is_available', true).order('display_order')
      if (error) return res.status(500).json({ error: error.message })
      return res.json(data || [])
    }

    if (u === '/api/items' && m === 'POST') {
      if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
      const b = req.body || {}
      if (!b.name_ar || !b.name_en || b.price === undefined || !b.category_id) return res.status(400).json({ error: 'Missing' })
      const { data } = await s.from('menu_items').insert({ category_id: b.category_id, name_ar: b.name_ar, name_en: b.name_en, description_ar: b.description_ar || '', description_en: b.description_en || '', price: b.price, image_url: b.image_url || null, is_popular: !!b.is_popular, is_available: b.is_available !== false }).select().single()
      return res.status(201).json(data)
    }

    const im = u.match(/^\/api\/items\/(\d+)$/)
    if (im) {
      const id = Number(im[1])
      if (m === 'PUT') {
        if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
        const b = req.body || {}
        const upd = {}
        if (b.name_ar !== undefined) upd.name_ar = b.name_ar
        if (b.name_en !== undefined) upd.name_en = b.name_en
        if (b.description_ar !== undefined) upd.description_ar = b.description_ar
        if (b.description_en !== undefined) upd.description_en = b.description_en
        if (b.price !== undefined) upd.price = b.price
        if (b.category_id !== undefined) upd.category_id = b.category_id
        if (b.image_url !== undefined) upd.image_url = b.image_url
        if (b.is_popular !== undefined) upd.is_popular = !!b.is_popular
        if (b.is_available !== undefined) upd.is_available = !!b.is_available
        upd.updated_at = new Date().toISOString()
        const { data } = await s.from('menu_items').update(upd).eq('id', id).select().single()
        return res.json(data)
      }
      if (m === 'DELETE') {
        if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
        await s.from('menu_items').delete().eq('id', id)
        return res.json({ message: 'Deleted' })
      }
    }

    if (u === '/api/popular' && m === 'GET') {
      const { data } = await s.from('menu_items').select('*, categories(name_ar,name_en)').eq('is_popular', true).eq('is_available', true).limit(4)
      return res.json(data || [])
    }

    if (u === '/api/settings' && m === 'GET') {
      const { data } = await s.from('settings').select('key,value')
      const obj = {}
      for (const r of (data || [])) obj[r.key] = r.value || ''
      return res.json(obj)
    }

    if (u === '/api/settings' && m === 'PUT') {
      if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
      const updates = req.body || {}
      const results = {}
      for (const [k, v] of Object.entries(updates)) {
        if (typeof v !== 'string') continue
        if (v.length > 2000) return res.status(400).json({ error: `Value for '${k}' too long` })
        if (['instagram','facebook','tiktok','maps_url'].includes(k) && v && !isValidUrl(v)) return res.status(400).json({ error: `Invalid URL for ${k}` })
        if (k === 'whatsapp_number' && v && !isValidPhone(v)) return res.status(400).json({ error: 'Invalid whatsapp_number' })
        await s.from('settings').upsert({ key: k, value: v }, { onConflict: 'key' })
        results[k] = v
      }
      return res.json(results)
    }

    if (u === '/api/stats' && m === 'GET') {
      if (!auth(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' })
      const { count: catCount } = await s.from('categories').select('*', { count: 'exact', head: true })
      const { count: itemCount } = await s.from('menu_items').select('*', { count: 'exact', head: true })
      const { count: popCount } = await s.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_popular', true)
      return res.json({ categories: catCount || 0, items: itemCount || 0, popular: popCount || 0 })
    }

    return res.status(404).json({ error: 'Not found' })
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal server error', message: err.message })
  }
}
