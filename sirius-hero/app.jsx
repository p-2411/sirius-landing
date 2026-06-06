/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakSelect, TweakToggle, Nav, HeroSection, PageSections */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "centered",
  "headline": "knows",
  "orbColor": "star",
  "orbSize": 1,
  "bloom": 1,
  "halo": true,
  "ambient": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Ambient background intensity
  useEffect(() => {
    document.documentElement.style.setProperty("--neb-opacity", t.ambient ? "1" : "0");
    const sf = document.getElementById("starfield");
    if (sf) sf.style.opacity = t.ambient ? "1" : "0.18";
  }, [t.ambient]);

  // Fade the fixed ambient layers as the page scrolls past the hero.
  useEffect(() => {
    const sf = document.getElementById("starfield");
    const neb = document.querySelector(".nebula");
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const fade = Math.max(0.32, 1 - y / (window.innerHeight * 0.9));
        if (sf && t.ambient) sf.style.opacity = String(Math.max(0.16, fade));
        if (neb) neb.style.opacity = String(t.ambient ? fade : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [t.ambient]);

  return (
    <div className="page">
      <Nav />
      <HeroSection t={t} />
      <PageSections t={t} />

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio
          label="Hero layout"
          value={t.layout}
          options={["centered", "split", "backdrop"]}
          onChange={(v) => setTweak("layout", v)}
        />
        <TweakSection label="Copy" />
        <TweakSelect
          label="Headline"
          value={t.headline}
          options={[
            { value: "knows", label: "It knows you. It does the work." },
            { value: "delegate", label: "Delegate the work, not the thinking." },
            { value: "prompting", label: "Stop prompting. Start delegating." },
          ]}
          onChange={(v) => setTweak("headline", v)}
        />
        <TweakSection label="The orb" />
        <TweakRadio
          label="Color"
          value={t.orbColor}
          options={[{ value: "star", label: "Star (blue)" }, { value: "gold", label: "Gold" }]}
          onChange={(v) => setTweak("orbColor", v)}
        />
        <TweakSlider label="Size" value={t.orbSize} min={0.7} max={1.4} step={0.05} onChange={(v) => setTweak("orbSize", v)} />
        <TweakSlider label="Bloom" value={t.bloom} min={0} max={1.6} step={0.05} onChange={(v) => setTweak("bloom", v)} />
        <TweakToggle label="Light-ray halo" value={t.halo} onChange={(v) => setTweak("halo", v)} />
        <TweakSection label="Background" />
        <TweakToggle label="Ambient starfield" value={t.ambient} onChange={(v) => setTweak("ambient", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
