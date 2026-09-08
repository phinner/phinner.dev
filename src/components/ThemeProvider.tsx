import {
  type Accessor,
  createContext,
  createSignal,
  onSettled,
  type ParentProps,
  useContext,
} from "solid-js";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Accessor<Theme>;
  ready: Accessor<boolean>;
  toggleTheme: () => void;
}>();

export function ThemeProvider(props: ParentProps) {
  const [theme, setTheme] = createSignal<Theme>("dark");
  const [ready, setReady] = createSignal(false);
  onSettled(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    setReady(true);
  });
  const toggleTheme = () => {
    const next = theme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return <ThemeContext value={{ theme, ready, toggleTheme }}>{props.children}</ThemeContext>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProviderScript() {
  return (
    <script>{`try { document.documentElement.dataset.theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'; } catch {}`}</script>
  );
}
