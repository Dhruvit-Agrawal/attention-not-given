import { useEffect, useRef, useState } from 'react';

const reminders = [
  {
    title: 'A little reminder',
    message: "You don't have to be okay all the time. You deserve love and patience on the difficult days, too.",
    number: '01',
    sprig: 'flower',
  },
  {
    title: 'Something I mean',
    message: "I want to be more intentional about making time for us. I don't want you to feel like you have to compete with my schedule.",
    number: '02',
    sprig: 'leaf',
  },
  {
    title: 'One thing I owe you',
    message: 'My time. No distractions, no rushing, just us.',
    number: '03',
    sprig: 'stem',
  },
];

const coupons = [
  {
    id: 'attention',
    label: 'THE ATTENTION PASS',
    emoji: '📵',
    title: 'Your Undivided Attention',
    description: '30 minutes. Just us. No distractions.',
    details: [
      { label: 'Long-distance redemption', text: 'A proper video call where we actually spend time together.' },
      { label: 'In-person redemption', text: 'Phone away. Work aside. Just us.' },
    ],
    finePrint: "You don't need a coupon to deserve my attention.",
    confirmation: 'Thirty minutes, all yours. I promise to leave my phone out of it.',
  },
  {
    id: 'hotline',
    label: 'THE EMERGENCY BOYFRIEND HOTLINE',
    emoji: '☎️',
    title: 'Your Person, On Call',
    description: 'Redeem whenever you need someone to listen.',
    details: [{ label: 'The plan', text: 'Talk, rant, laugh, or sit in silence together. No fixing everything unless you want solutions.' }],
    finePrint: 'Boyfriend may be sleepy but will try his best.',
    confirmation: "Your person is on call. Bring absolutely any kind of day you've had.",
  },
  {
    id: 'mood-lifter',
    label: 'THE MOOD-LIFTER PASS',
    emoji: '🧸',
    title: 'One Attempt at Making You Smile',
    description: 'Memes, terrible jokes, a voice note, or a little surprise.',
    details: [
      { label: 'Long-distance', text: 'Your customised digital mood-lifting package.' },
      { label: 'In-person', text: 'Hugs and whatever little thing cheers you up.' },
    ],
    finePrint: 'Results may vary. Effort is guaranteed.',
    confirmation: 'A carefully assembled smile attempt is on its way, with questionable jokes included.',
  },
  {
    id: 'hug',
    label: 'THE ONE-LONG-HUG PASS',
    emoji: '🫂',
    title: 'One Long Hug',
    description: 'No rushing. No checking the time. Just a proper hug.',
    details: [],
    finePrint: 'Duration to be negotiated by the recipient.',
    confirmation: 'One very unhurried hug, reserved for whenever we see each other.',
  },
  {
    id: 'main-character',
    label: 'THE MAIN CHARACTER PASS',
    emoji: '✨',
    title: 'Tonight, You Choose',
    description: 'One outing where you decide the plan.',
    details: [{ label: 'Your options', text: 'Food, dancing, pictures, a walk, or simply hanging out.' }],
    finePrint: "Boyfriend's job is to participate enthusiastically.",
    confirmation: 'You pick the plan; I will bring my most enthusiastic participation.',
  },
  {
    id: 'navratri',
    label: 'THE NAVRATRI SPECIAL',
    emoji: '🪩',
    title: 'Your Navratri Privilege',
    description: 'Choose ONE special moment during our Navratri nights together.',
    options: [
      'One garba song with my full attention.',
      'One proper photo session together.',
      'One post-garba food stop of your choice.',
      'One little moment together away from the crowd.',
    ],
    finePrint: 'Valid during our upcoming Navratri nights together.',
    confirmation: 'One Navratri moment, picked by you and saved just for us.',
  },
  {
    id: 'princess',
    label: 'THE PRINCESS TREATMENT PASS',
    emoji: '👑',
    title: 'Let Me Plan It',
    description: 'One date planned by me, so you can simply enjoy it.',
    details: [{ label: 'The details', text: "I'll handle the planning and details within our budget." }],
    finePrint: 'Your only responsibility is to show up and be your lovely self.',
    confirmation: 'Date planning is officially my job. Your lovely-self duties are already covered.',
  },
  {
    id: 'your-choice',
    label: 'THE YOUR-CHOICE PASS',
    emoji: '🎁',
    title: 'Your Wish, My Plan',
    description: 'Choose one activity you want us to do together.',
    details: [{ label: 'A few ideas', text: 'A date, a food outing, a walk, or simply spending time together.' }],
    finePrint: 'No expiry date. Subject to mutual availability and common sense.',
    confirmation: 'One activity of your choosing is on our little together-list.',
  },
];

const redemptionStorageKey = 'khushi-privilege-book-redemptions';

function readRedemptions() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(redemptionStorageKey) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function CouponBook() {
  const deckRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openCoupon, setOpenCoupon] = useState(null);
  const [selectedNavratri, setSelectedNavratri] = useState('');
  const [redemptions, setRedemptions] = useState(readRedemptions);
  const [confirmation, setConfirmation] = useState(null);

  // This history stays in this browser; it does not synchronise redemption between devices.
  useEffect(() => {
    try {
      window.localStorage.setItem(redemptionStorageKey, JSON.stringify(redemptions));
    } catch {
      // Redemption still works for the current visit if browser storage is unavailable.
    }
  }, [redemptions]);

  const showCoupon = (index) => {
    const nextIndex = Math.max(0, Math.min(coupons.length - 1, index));
    setActiveIndex(nextIndex);
    setOpenCoupon(null);
    setSelectedNavratri('');
    slideRefs.current[nextIndex]?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const updateActiveCoupon = () => {
    const deck = deckRef.current;
    if (!deck) return;
    const center = deck.getBoundingClientRect().left + deck.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.getBoundingClientRect().left + slide.clientWidth / 2 - center);
      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });
    if (nearestIndex !== activeIndex) {
      setActiveIndex(nearestIndex);
      setOpenCoupon(null);
      setSelectedNavratri('');
    }
  };

  const redeemCoupon = (coupon) => {
    if (redemptions[coupon.id] || (coupon.options && !selectedNavratri)) return;
    const option = coupon.options ? selectedNavratri : '';
    setRedemptions((current) => ({ ...current, [coupon.id]: { option, redeemedAt: new Date().toISOString() } }));
    setConfirmation({ couponId: coupon.id, option });
  };

  const backToCoupons = () => {
    setConfirmation(null);
    setOpenCoupon(null);
  };

  const confirmedCoupon = coupons.find((coupon) => coupon.id === confirmation?.couponId);

  return (
    <section className="privilege-section" aria-labelledby="privilege-heading">
      <div className="privilege-intro">
        <p className="privilege-kicker"><span>♡</span> A little book of us <span>♡</span></p>
        <h2 id="privilege-heading">Khushi's Little Privilege Book <span>♡</span></h2>
        <p className="privilege-subtitle">8 little ways to remind you that you're loved.</p>
        <div className="privilege-meta">
          <span>Issued by: Your Favourite Person</span>
          <span>Valid: Always ♡</span>
        </div>
        <p className="privilege-disclaimer">No coupon required for basic love, care, respect, or attention.</p>
      </div>

      {confirmation && confirmedCoupon ? (
        <div className="redemption-confirmation" aria-live="polite">
          <span className="confirmation-seal" aria-hidden="true">♡</span>
          <p className="confirmation-kicker">Officially claimed, with love</p>
          <h3>{confirmedCoupon.title}</h3>
          <p className="confirmation-message">{confirmedCoupon.confirmation}</p>
          {confirmation.option && <p className="confirmed-option"><span>Your Navratri pick</span>{confirmation.option}</p>}
          <button className="coupon-secondary-button" onClick={backToCoupons}>Back to coupons <span aria-hidden="true">↗</span></button>
        </div>
      ) : (
        <div className="coupon-carousel" aria-label="Swipe through eight coupons">
          <div className="coupon-track" ref={deckRef} onScroll={updateActiveCoupon}>
            {coupons.map((coupon, index) => {
              const isOpen = openCoupon === coupon.id;
              const isRedeemed = Boolean(redemptions[coupon.id]);
              return (
                <article
                  className="coupon-slide"
                  key={coupon.id}
                  ref={(element) => { slideRefs.current[index] = element; }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Coupon ${String(index + 1).padStart(2, '0')} of ${coupons.length}`}
                >
                  <div className={`coupon-ticket ${isOpen ? 'coupon-is-open' : ''}`}>
                    <div className="ticket-topline">
                      <span>KHUSHI'S PRIVILEGE BOOK</span>
                      <span className="ticket-number">{String(index + 1).padStart(2, '0')} / 08</span>
                    </div>
                    <div className="ticket-main">
                      <p className="coupon-label">{coupon.label} <span>{coupon.emoji}</span></p>
                      <h3>{coupon.title}</h3>
                      <p className="coupon-description">{coupon.description}</p>
                      {isRedeemed && <span className="redeemed-ribbon">Already yours ♡</span>}
                      <button
                        className="coupon-details-toggle"
                        aria-expanded={isOpen}
                        aria-controls={`coupon-details-${coupon.id}`}
                        onClick={() => {
                          setOpenCoupon(isOpen ? null : coupon.id);
                          if (coupon.id !== 'navratri') setSelectedNavratri('');
                        }}
                      >
                        {isOpen ? 'Fold coupon back' : 'Open your coupon'} <span aria-hidden="true">{isOpen ? '−' : '＋'}</span>
                      </button>
                    </div>
                    <div className="ticket-perforation" aria-hidden="true"><span>♡</span></div>
                    {isOpen && (
                      <div className="coupon-details" id={`coupon-details-${coupon.id}`}>
                        {coupon.details?.map((detail) => (
                          <p className="coupon-detail" key={detail.label}><span>{detail.label}</span>{detail.text}</p>
                        ))}
                        {coupon.options && (
                          <fieldset className="navratri-options">
                            <legend>Choose exactly one little moment</legend>
                            {coupon.options.map((option) => (
                              <label className="navratri-option" key={option}>
                                <input type="radio" name="navratri-redemption" value={option} checked={selectedNavratri === option} onChange={() => setSelectedNavratri(option)} disabled={isRedeemed} />
                                <span>{option}</span>
                              </label>
                            ))}
                          </fieldset>
                        )}
                        <p className="coupon-fine-print"><span>Fine print</span>{coupon.finePrint}</p>
                        <button className="coupon-redeem-button" onClick={() => redeemCoupon(coupon)} disabled={isRedeemed || Boolean(coupon.options && !selectedNavratri)}>
                          {isRedeemed ? 'Already redeemed ♡' : 'Redeem this coupon'}
                          {!isRedeemed && <span aria-hidden="true">↗</span>}
                        </button>
                      </div>
                    )}
                    <span className="ticket-corner-mark" aria-hidden="true">✳</span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="coupon-navigation">
            <button className="coupon-nav-button" onClick={() => showCoupon(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous coupon">←</button>
            <span aria-live="polite"><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> <span>/ 08</span></span>
            <button className="coupon-nav-button" onClick={() => showCoupon(activeIndex + 1)} disabled={activeIndex === coupons.length - 1} aria-label="Next coupon">→</button>
          </div>
        </div>
      )}

      <p className="coupon-closing-note">Use whenever you like. The love part is always included.</p>
    </section>
  );
}

function FlowerIllustration() {
  return (
    <svg className="flower-art" viewBox="0 0 300 320" role="img" aria-label="A delicate hand-drawn flower">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className="stem-line" d="M145 286c8-61-7-104-3-151" />
        <path className="leaf-line" d="M144 230c-32-26-55-20-58-1 22 20 42 19 58 1Z" />
        <path className="leaf-line" d="M145 254c29-28 52-25 59-8-18 23-39 24-59 8Z" />
        <path className="petal-line" d="M142 107c-30-27-22-57-5-61 15-3 26 18 13 51 8-43 30-57 42-43 13 15 0 39-41 55 40-22 68-12 62 7-5 19-31 21-64-1 37 27 38 52 19 55-18 3-31-20-24-60-4 44-25 61-39 48-13-12-4-37 28-58-37 21-63 12-58-7 4-18 29-23 64 0Z" />
        <path className="center-line" d="M154 111c-3 5-10 6-14 3-4-3-2-10 2-13 4-4 12-3 15 1 3 3 1 7-3 9Z" />
        <path className="detail-line" d="M149 108c-24-20-24-37-18-46m24 46c10-31 25-44 36-48m-37 53c31-15 51-10 59-1m-63 4c29 22 34 38 27 50m-32-52c-4 31-17 45-31 49m29-53c-29-15-47-11-57-5" />
      </g>
      <circle className="pollen" cx="150" cy="107" r="2" />
      <circle className="pollen" cx="157" cy="110" r="1.6" />
      <circle className="pollen" cx="148" cy="115" r="1.3" />
    </svg>
  );
}

function CardSprig({ type }) {
  if (type === 'flower') {
    return (
      <svg className="card-sprig" viewBox="0 0 44 48" aria-hidden="true">
        <path d="M22 45V22m0 10c-9-8-14-5-15-1 5 6 10 6 15 1Zm0-6c7-8 13-6 15-2-4 6-9 7-15 2Z" />
        <path d="M22 22c-9-7-8-14-3-15 4-1 6 4 4 11 3-8 8-11 11-8 2 4-2 8-10 11 8-3 14-1 12 3-2 4-8 3-13-1 5 6 4 11 0 11-4 0-5-6-3-12-2 7-7 10-10 7-2-3 1-8 8-11-7 3-12 1-11-3 1-4 7-4 15-1Z" />
      </svg>
    );
  }
  return (
    <svg className="card-sprig" viewBox="0 0 44 48" aria-hidden="true">
      <path d="M21 45c4-14 1-27 2-39M22 28C11 17 5 19 4 24c6 7 12 8 18 4Zm1 7c9-10 15-8 17-4-5 8-10 9-17 7Z" />
      {type === 'stem' && <path d="M15 12c-5-5-3-9 0-9 3 1 3 4 1 7 4-4 7-4 8-1 0 3-4 5-9 4Z" />}
    </svg>
  );
}

function scrollTo(element) {
  element?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}

function App() {
  const letterRef = useRef(null);
  const beginningRef = useRef(null);
  const [letterOpened, setLetterOpened] = useState(false);
  const [openCards, setOpenCards] = useState([false, false, false]);
  const [hugCollected, setHugCollected] = useState(false);

  const openLetter = () => {
    setLetterOpened(true);
    scrollTo(letterRef.current);
  };

  const toggleCard = (index) => {
    setOpenCards((current) => current.map((isOpen, cardIndex) => cardIndex === index ? !isOpen : isOpen));
  };

  const replay = () => {
    setLetterOpened(false);
    setOpenCards([false, false, false]);
    setHugCollected(false);
    scrollTo(beginningRef.current);
  };

  return (
    <main>
      <section className="morning-section" ref={beginningRef} aria-labelledby="morning-title">
        <div className="margin-note" aria-hidden="true">a note for you</div>
        <div className="morning-copy">
          <p className="eyebrow"><span /> A small morning surprise</p>
          <h1 id="morning-title">Good morning,<br /><em>Khushi</em> <span className="outline-heart">♡</span></h1>
          <p className="morning-subtitle">I made a little something for you.</p>
          <button className="text-button primary-button" onClick={openLetter}>
            <span>Open your surprise</span><span className="button-arrow" aria-hidden="true">↘</span>
          </button>
        </div>
        <div className="flower-wrap"><FlowerIllustration /></div>
        <div className="hero-caption" aria-hidden="true"><span>01</span><span>A little more than words</span></div>
        <div className="petal petal-one" aria-hidden="true" />
        <div className="petal petal-two" aria-hidden="true" />
        <div className="petal petal-three" aria-hidden="true" />
      </section>

      <section className={`letter-section ${letterOpened ? 'is-opened' : ''}`} ref={letterRef} aria-labelledby="letter-heading">
        <div className="section-kicker"><span>01</span><span>From my heart</span></div>
        <article className="letter-card">
          <div className="letter-topline"><span>For Khushi</span><span className="letter-flourish" aria-hidden="true">✳</span></div>
          <h2 id="letter-heading">A note I needed<br />you to hear.</h2>
          <div className="letter-body">
            <p>Good morning, my girl.</p>
            <p>I wish I could start your morning with a hug instead of a message.</p>
            <p>I'm sorry I couldn't give you the time you needed from me. I know you wanted a little time together, and I couldn't be there the way you needed me to be.</p>
            <p>You shouldn't have to keep asking for my attention to feel important in my life.</p>
            <p>I can't change yesterday, but I can do better going forward. I want to make time for us, even when things get busy, instead of leaving you feeling like you have to ask for it.</p>
            <p>I love you, Khushi. And I'm sorry I hurt you. ❤️</p>
          </div>
          <div className="letter-signoff"><span>With all my love,</span><span className="signature">Always yours</span></div>
          <div className="letter-stamp" aria-hidden="true"><span>♡</span><small>WITH LOVE</small></div>
        </article>
        <div className="section-footnote"><span>Some things are better said slowly.</span><span>✳</span></div>
      </section>

      <section className="reminders-section" aria-labelledby="reminders-heading">
        <div className="reminders-heading">
          <div className="section-kicker"><span>02</span><span>Keep this close</span></div>
          <h2 id="reminders-heading">A few things<br /><em>to remember.</em></h2>
          <p>Little truths, for today and all the days after.</p>
        </div>
        <div className="reminder-list">
          {reminders.map((card, index) => (
            <button className={`reminder-card ${openCards[index] ? 'is-expanded' : ''}`} key={card.number} aria-expanded={openCards[index]} onClick={() => toggleCard(index)}>
              <span className="card-number">{card.number}</span>
              <span className="card-content">
                <span className="card-title">{card.title}</span>
                <span className="card-message" aria-hidden={!openCards[index]}>{card.message}</span>
                <span className="card-prompt">{openCards[index] ? 'A little more, always' : 'Tap to unfold'}</span>
              </span>
              <CardSprig type={card.sprig} />
              <span className="card-mark" aria-hidden="true">{openCards[index] ? '−' : '+'}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ending-section" aria-labelledby="ending-heading">
        <div className="ending-rule"><span>03</span><span className="rule-line" /><span>Just us</span></div>
        <div className="ending-content">
          <div className={`little-heart ${hugCollected ? 'heart-beat' : ''}`} aria-hidden="true">♡</div>
          <p className="ending-overline">A small promise</p>
          <h2 id="ending-heading">One hug, reserved<br />exclusively for you.</h2>
          <p className="ending-question">Can I make it up to you?</p>
          <button className="text-button ending-button" onClick={() => setHugCollected((collected) => !collected)} aria-expanded={hugCollected}>
            <span>{hugCollected ? 'Your hug is waiting' : "I'll collect it when we meet ♡"}</span>
            <span className="button-arrow" aria-hidden="true">↗</span>
          </button>
          <p className={`hug-note ${hugCollected ? 'is-visible' : ''}`} aria-live="polite">
            No expiry date. No cancellation policy. Terms and conditions: unlimited hugs. ❤️
          </p>
        </div>
        <button className="replay-button" onClick={replay}><span aria-hidden="true">↶</span> Begin again</button>
        <div className="footer-flower" aria-hidden="true"><FlowerIllustration /></div>
        <p className="closing-line">Made for you, with love.</p>
      </section>

      <CouponBook />
    </main>
  );
}

export default App;