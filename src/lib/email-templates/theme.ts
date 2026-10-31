/** Shared Meltaways Spa email typography + brand tokens (inline styles only). */
export const SERIF = "'Didot','Bodoni MT','Playfair Display',Georgia,'Times New Roman',serif"
export const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif"

export const BRAND = {
  ink: '#1c1917',
  body: '#4a4441',
  gold: '#7a5a3f',
  cream: '#faf7f4',
  line: '#ece5de',
  muted: '#9a9490',
}

export const main = { backgroundColor: '#ffffff', fontFamily: SANS, margin: 0, padding: '0' }
export const container = { padding: '32px 30px 24px', maxWidth: '580px', margin: '0 auto' }
export const brandBar = {
  fontFamily: SERIF,
  fontSize: '13px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: BRAND.gold,
  textAlign: 'center' as const,
  margin: '0 0 6px',
}
export const rule = { borderColor: BRAND.line, borderWidth: '1px 0 0 0', margin: '14px 0 26px' }
export const h1 = {
  fontFamily: SERIF,
  fontSize: '27px',
  lineHeight: '1.25',
  fontWeight: 400 as const,
  color: BRAND.ink,
  margin: '0 0 20px',
  textAlign: 'center' as const,
}
export const text = { fontFamily: SANS, fontSize: '15px', color: BRAND.body, lineHeight: '1.75', margin: '0 0 16px' }
export const bullet = { ...text, margin: '0 0 8px', paddingLeft: '10px' }
export const card = { backgroundColor: BRAND.cream, borderRadius: '4px', padding: '20px 22px', margin: '22px 0' }
export const tagline = {
  fontFamily: SERIF,
  fontSize: '15px',
  fontStyle: 'italic' as const,
  color: BRAND.gold,
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '26px 0 6px',
}
export const signature = { fontFamily: SERIF, fontSize: '16px', color: BRAND.ink, textAlign: 'center' as const, margin: '0 0 4px' }
export const button = {
  backgroundColor: BRAND.ink,
  color: '#ffffff',
  fontFamily: SANS,
  fontSize: '13px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  borderRadius: '2px',
  padding: '14px 30px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const hr = { borderColor: BRAND.line, margin: '30px 0 14px' }
export const footer = { fontFamily: SANS, fontSize: '11px', color: BRAND.muted, textAlign: 'center' as const, lineHeight: '1.7', margin: 0 }
