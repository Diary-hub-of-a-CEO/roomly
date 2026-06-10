import { useEffect, useMemo, useState } from 'react';

type Room = {
  id: number;
  name: string;
  type: string;
  owner: string;
  price: number;
  noise: string;
  location: string;
  city: string;
  universities: string[];
  facilities: string[];
  petsAllowed: boolean;
  description: string;
  rating: number;
  image: string;
  distance: string;
};

type EstimateRequest = {
  location: string;
  roomType: string;
  noiseLevel: string;
  petsAllowed: boolean;
  furnished: boolean;
  bathrooms: number;
  proximityScore: number;
};

type EstimateResponse = {
  estimatedRent: number;
  explanation: string;
};

const themeOptions = ['light', 'dark', 'pink'] as const;

type ThemeName = (typeof themeOptions)[number];

const roomTypes = ['Single Bed', 'Double Bed', 'Office Space', 'Studio Apartment'];
const noiseOptions = ['Low', 'Moderate', 'High'];

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [theme, setTheme] = useState<ThemeName>('light');
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EstimateRequest>({
    location: 'Downtown',
    roomType: 'Single Bed',
    noiseLevel: 'Moderate',
    petsAllowed: true,
    furnished: true,
    bathrooms: 1,
    proximityScore: 7
  });

  useEffect(() => {
    const stored = window.localStorage.getItem('roomly-theme') as ThemeName | null;
    if (stored && themeOptions.includes(stored)) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('roomly-theme', theme);
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setActiveRoom(data[0] ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  const nearbyFeatures = useMemo(
    () => [
      'Smart room search with owner match suggestions',
      'Real-time availability tracker for listed rooms',
      'Neighborhood score, university proximity and sound comfort badges',
      'Fast AI-powered rent estimate using location and room type factors'
    ],
    []
  );

  const submitEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch('/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await response.json();
    setEstimate(result);
    setLoading(false);
  };

  const selectedUniversity = activeRoom?.universities[0] ?? 'Nearby campuses';

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/logo.svg" alt="Roomly logo" className="logo" />
          <div>
            <h1>Roomly</h1>
            <p>Where finding a room feels easy.</p>
          </div>
        </div>
        <div className="theme-controls">
          {themeOptions.map((option) => (
            <button
              key={option}
              className={theme === option ? 'theme-chip active' : 'theme-chip'}
              onClick={() => setTheme(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <main>
        <section className="hero-panel">
          <div>
            <span className="eyebrow">Roomly PWA</span>
            <h2>Find pet-friendly rooms, connect with trusted owners, and estimate rent instantly.</h2>
            <p>Rooms filtered by noise level, university proximity, facilities, and owner match preferences. Pick your mode and explore smart listings in one responsive app.</p>
            <div className="hero-actions">
              <a href="#browse" className="cta-button">Browse rooms</a>
              <a href="#estimator" className="secondary-button">AI rent estimator</a>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-tag">Unique selling points</div>
            <ul>
              <li>Owners curated by room type and lifestyle match</li>
              <li>Pets allowed filter with verified facilities</li>
              <li>In-app rent estimate tuned for location and room style</li>
            </ul>
          </div>
        </section>

        <section id="browse" className="room-carousel-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Featured rooms</p>
              <h3>Scroll through rooms and find your ideal owner match.</h3>
            </div>
            <span>{rooms.length} listings live</span>
          </div>

          <div className="room-carousel">
            {rooms.map((room) => (
              <article
                key={room.id}
                className={room.id === activeRoom?.id ? 'room-card active' : 'room-card'}
                onClick={() => setActiveRoom(room)}
              >
                <img src={room.image} alt={room.name} />
                <div className="room-card-body">
                  <div className="room-card-top">
                    <span className="pill">{room.type}</span>
                    {room.petsAllowed && <span className="pill pets">Pets allowed</span>}
                  </div>
                  <h4>{room.name}</h4>
                  <p>{room.description}</p>
                  <div className="room-tags">
                    <span>{room.noise} noise</span>
                    <span>{room.city}</span>
                    <span>{room.distance} from {selectedUniversity}</span>
                  </div>
                  <div className="owner-line">
                    <strong>Owner:</strong> {room.owner}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="feature-grid">
            {nearbyFeatures.map((feature) => (
              <div key={feature} className="feature-card">
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-panel">
            <h3>{activeRoom?.name || 'Choose a room'}</h3>
            <p>{activeRoom?.description}</p>
            <dl>
              <div>
                <dt>Owner</dt>
                <dd>{activeRoom?.owner}</dd>
              </div>
              <div>
                <dt>Room type</dt>
                <dd>{activeRoom?.type}</dd>
              </div>
              <div>
                <dt>Noise level</dt>
                <dd>{activeRoom?.noise}</dd>
              </div>
              <div>
                <dt>Universities nearby</dt>
                <dd>{activeRoom?.universities.join(', ')}</dd>
              </div>
              <div>
                <dt>Facilities</dt>
                <dd>{activeRoom?.facilities.join(', ')}</dd>
              </div>
            </dl>
          </div>
          <div className="detail-stats">
            <div className="stat-card">
              <span>Monthly rent</span>
              <strong>${activeRoom?.price.toLocaleString()}/month</strong>
            </div>
            <div className="stat-card">
              <span>Comfort score</span>
              <strong>{activeRoom?.rating}/10</strong>
            </div>
            <div className="stat-card">
              <span>Location</span>
              <strong>{activeRoom?.location}</strong>
            </div>
            <div className="stat-card">
              <span>Pets allowed</span>
              <strong>{activeRoom?.petsAllowed ? 'Yes' : 'No'}</strong>
            </div>
          </div>
        </section>

        <section id="estimator" className="estimator-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Rent estimator</p>
              <h3>AI-powered cost preview for any room style and location.</h3>
            </div>
          </div>

          <div className="estimator-grid">
            <form className="estimator-form" onSubmit={submitEstimate}>
              <label>
                City or neighborhood
                <input
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  placeholder="Downtown"
                />
              </label>
              <label>
                Room type
                <select
                  value={form.roomType}
                  onChange={(event) => setForm({ ...form, roomType: event.target.value })}
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Noise expectation
                <select
                  value={form.noiseLevel}
                  onChange={(event) => setForm({ ...form, noiseLevel: event.target.value })}
                >
                  {noiseOptions.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>
              <label className="toggle-row">
                <span>Pets allowed</span>
                <input
                  type="checkbox"
                  checked={form.petsAllowed}
                  onChange={(event) => setForm({ ...form, petsAllowed: event.target.checked })}
                />
              </label>
              <label className="toggle-row">
                <span>Furnished</span>
                <input
                  type="checkbox"
                  checked={form.furnished}
                  onChange={(event) => setForm({ ...form, furnished: event.target.checked })}
                />
              </label>
              <label>
                Number of bathrooms
                <input
                  type="number"
                  min={1}
                  value={form.bathrooms}
                  onChange={(event) => setForm({ ...form, bathrooms: Number(event.target.value) })}
                />
              </label>
              <label>
                Campus proximity score
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.proximityScore}
                  onChange={(event) => setForm({ ...form, proximityScore: Number(event.target.value) })}
                />
                <span>{form.proximityScore}/10</span>
              </label>
              <button type="submit" className="cta-button" disabled={loading}>
                {loading ? 'Estimating...' : 'Estimate rent'}
              </button>
            </form>

            <div className="estimator-preview">
              <div className="preview-card">
                <h4>Quick rent estimate</h4>
                <p>Enter your room details and receive a location-backed projection with premium features included.</p>
                {estimate ? (
                  <div className="estimate-result">
                    <span>Estimated monthly rent</span>
                    <strong>${estimate.estimatedRent.toLocaleString()}</strong>
                    <p>{estimate.explanation}</p>
                  </div>
                ) : (
                  <div className="estimate-empty">
                    <p>Select room preferences to generate a smart estimate.</p>
                  </div>
                )}
              </div>
              <div className="quick-facts">
                <div>
                  <strong>24/7 support</strong>
                  <p>Match with verified owners and local room managers.</p>
                </div>
                <div>
                  <strong>Offline ready</strong>
                  <p>Roomly works as a PWA with installable app behavior.</p>
                </div>
                <div>
                  <strong>Multiple modes</strong>
                  <p>Switch between light, dark and pink for better readability.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <span>Roomly • Progressive room finder app • Built with smart listing and live rent estimate.</span>
      </footer>
    </div>
  );
}

export default App;
