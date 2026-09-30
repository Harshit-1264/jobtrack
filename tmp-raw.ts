import 'dotenv/config'
import mariadb from 'mariadb'

const u = new URL(process.env.DATABASE_URL!)
const base = {
  host: u.hostname,
  port: Number(u.port || 3306),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.slice(1),
  connectTimeout: 5000,
}

async function attempt(label: string, extra: object) {
  try {
    const c = await mariadb.createConnection({ ...base, ...extra })
    const r = await c.query("SELECT 1 AS ok")
    console.log('✅', label, '→ connected', JSON.stringify(r[0]))
    await c.end()
  } catch (e: any) {
    console.log('❌', label, '→', e.code || '', String(e.message).split('\n')[0].slice(0, 140))
  }
}

async function main() {
  await attempt('plain (what the adapter does)', {})
  await attempt('allowPublicKeyRetrieval: true', { allowPublicKeyRetrieval: true })
}
main()
