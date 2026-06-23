export default function HeroSection({ img, title, ctaLabel, onCta }) {
  return (
    <section
      dir="rtl"
      style={{
        position: 'relative',
        height: 192,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        zIndex: 1,
      }} />
      {img && (
        <img
          src={img}
          alt="hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'var(--space-lg)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 var(--space-sm)',
        }}>
          {title}
        </h2>
        <button
          onClick={onCta}
          style={{
            alignSelf: 'flex-start',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: 'var(--space-sm) var(--space-lg)',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#561f00',
            cursor: 'pointer',
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  )
}
