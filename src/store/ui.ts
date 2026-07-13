import { create } from "zustand";

type Theme = "light" | "dark";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  shortcutsOpen: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  setCommandOpen: (v: boolean) => void;
  setShortcutsOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  theme: "light",
  sidebarCollapsed: false,
  commandOpen: false,
  shortcutsOpen: false,
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return { theme: next };
    }),
  setTheme: (t) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", t === "dark");
    }
    set({ theme: t });
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandOpen: (v) => set({ commandOpen: v }),
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
}));
