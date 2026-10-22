import { useEffect } from "react";
import { useTankStore } from "./store/tankStore";
import { useAccountStore } from "./store/accountStore";
import { Garage } from "./components/garage/Garage";
import { Battle } from "./components/battle/Battle";
import { AuthScreen } from "./components/ui/AuthScreen";
import "./App.css";

function EntryLoadingScreen({ label = "DEPLOYING…" }: { label?: string }) {
  return (
    <div
      className="app"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f1410 0%, #1a221c 50%, #0c1010 100%)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "2.4rem",
            letterSpacing: "0.2em",
            color: "#c5d0c0",
            fontWeight: 700,
          }}
        >
          TREADS
        </h1>
        <p style={{ color: "#6b7a68", marginTop: 12, letterSpacing: "0.12em" }}>{label}</p>
        <div
          style={{
            margin: "28px auto 0",
            width: 180,
            height: 4,
            borderRadius: 2,
            background: "#2a332c",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "40%",
              borderRadius: 2,
              background: "#8a9a7a",
              animation: "treads-load 1.2s ease-in-out infinite",
            }}
          />
        </div>
        <p style={{ color: "#4a5548", marginTop: 36, fontSize: 12, letterSpacing: "0.08em" }}>
          iyova1 · slate.interactive
        </p>
        <style>{`
          @keyframes treads-load {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function App() {
  const authPhase = useAccountStore((s) => s.authPhase);
  const entryLoading = useAccountStore((s) => s.entryLoading);
  const clearEntryLoading = useAccountStore((s) => s.clearEntryLoading);
  const init = useAccountStore((s) => s.init);
  const phase = useTankStore((s) => s.phase);
  const hydrate = useTankStore((s) => s.hydrateFromAccount);

  useEffect(() => {
    void (async () => {
      await init();
      const phaseNow = useAccountStore.getState().authPhase;
      if (phaseNow === "play") {
        useAccountStore.setState({ entryLoading: true });
        await hydrate();
      }
    })();
  }, [init, hydrate]);

  useEffect(() => {
    if (!entryLoading) return;
    const t = window.setTimeout(() => clearEntryLoading(), 2000);
    return () => window.clearTimeout(t);
  }, [entryLoading, clearEntryLoading]);

  if (authPhase === "boot" || (authPhase === "play" && entryLoading)) {
    return (
      <EntryLoadingScreen
        label={phase === "battle" ? "ENTERING BATTLE…" : "DEPLOYING…"}
      />
    );
  }

  if (authPhase !== "play") {
    return (
      <div className="app">
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="app">{phase === "garage" ? <Garage /> : <Battle />}</div>
  );
}
