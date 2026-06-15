// Tiny event bus so the HTTP layer can signal "session expired" to the React
// auth layer (AuthContext) without importing it — avoids a circular dependency.
let listeners = [];

export const sessionEvents = {
  onSessionExpired(listener) {
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  },
  emitSessionExpired(reason) {
    listeners.forEach((l) => {
      try { l(reason); } catch { /* ignore */ }
    });
  },
};
