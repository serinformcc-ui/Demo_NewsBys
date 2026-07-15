import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Flame,
  Globe2,
  ImagePlus,
  Languages,
  LayoutDashboard,
  Lightbulb,
  Link2,
  LockKeyhole,
  LogOut,
  MessageSquareText,
  MousePointerClick,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UploadCloud,
  Users,
  X as CloseIcon,
} from "lucide-react";
import "./styles.css";

type Role = "cm" | "admin";
type Network = "Instagram" | "LinkedIn" | "TikTok" | "Facebook" | "X" | "YouTube" | "Pinterest" | "WhatsApp Business" | "Threads" | "Bluesky";
type PostStatus = "Programado" | "Borrador" | "Publicado";
type Format = "Carrusel" | "Video" | "Post" | "Articulo";
type Goal = "Alcance" | "Engagement" | "Leads" | "Comunidad";

type User = {
  email: string;
  name: string;
  role: Role;
};

type StoredUser = User & {
  password: string;
  createdAt: string;
  source: "seed" | "registered";
};

type SocialAccount = {
  id: string;
  network: Network;
  handle: string;
  audience: number;
  engagement: number;
  reach: number;
  posts: number;
  clicks: number;
  saves: number;
  responseRate: number;
  growth: number;
};

type Client = {
  id: string;
  name: string;
  sector: string;
  language: string;
  tags: string[];
  accounts: SocialAccount[];
};

type ScheduledPost = {
  id: string;
  clientId: string;
  accountId: string;
  day: number;
  time: string;
  title: string;
  status: PostStatus;
  format: Format;
  goal: Goal;
  files: string[];
};

type Article = {
  id: string;
  title: string;
  source: string;
  language: string;
  tag: string;
  summary: string;
  translated: string;
  freshness: string;
  readTime: string;
  body: string[];
  idea: string;
};

type DemoDatabase = {
  version: number;
  users: StoredUser[];
  clients: Client[];
  posts: ScheduledPost[];
  articles: Article[];
  updatedAt: string;
};

const DB_KEY = "newsbys-demo-db";
const DB_VERSION = 2;

const seedUsers: StoredUser[] = [
  { email: "admin.pr@newsbys.demo", password: "AdminPR2026!", name: "Admin PR", role: "admin", createdAt: "2026-07-09T09:00:00.000Z", source: "seed" },
  { email: "cm@newsbys.demo", password: "Demo2026!", name: "Laura CM", role: "cm", createdAt: "2026-07-09T09:05:00.000Z", source: "seed" },
  { email: "admin@newsbys.demo", password: "Admin2026!", name: "Admin Newsbys", role: "admin", createdAt: "2026-07-09T09:10:00.000Z", source: "seed" },
];

const networks: Network[] = [
  "Instagram",
  "LinkedIn",
  "TikTok",
  "Facebook",
  "X",
  "YouTube",
  "Pinterest",
  "WhatsApp Business",
  "Threads",
  "Bluesky",
];

const initialClients: Client[] = [
  {
    id: "serinfor",
    name: "Serinfor",
    sector: "Consultoria tecnologica",
    language: "Espanol",
    tags: ["transformacion digital", "erp", "ciberseguridad"],
    accounts: [
      metricAccount("serinfor-li", "LinkedIn", "Serinfor", 18400, 4.9, 83500, 16),
      metricAccount("serinfor-ig", "Instagram", "@serinfor", 9600, 5.7, 61200, 14),
      metricAccount("serinfor-yt", "YouTube", "Serinfor TV", 5200, 3.4, 38400, 7),
    ],
  },
  {
    id: "serinfor-marketing",
    name: "Serinfor Marketing",
    sector: "Marketing y comunicacion",
    language: "Espanol",
    tags: ["email marketing", "automatizacion", "crm"],
    accounts: [
      metricAccount("sm-ig", "Instagram", "@serinformarketing", 22100, 6.4, 140000, 22),
      metricAccount("sm-tiktok", "TikTok", "@serinformkt", 31600, 7.8, 246000, 28),
      metricAccount("sm-threads", "Threads", "@serinformarketing", 8600, 4.1, 39100, 12),
    ],
  },
  {
    id: "phone-expansion",
    name: "Phone Expansion",
    sector: "Retail telefonia",
    language: "Espanol",
    tags: ["telefonia", "retail", "ofertas"],
    accounts: [
      metricAccount("pe-facebook", "Facebook", "Phone Expansion", 27400, 4.3, 122000, 20),
      metricAccount("pe-ig", "Instagram", "@phoneexpansion", 19800, 6.1, 118500, 18),
      metricAccount("pe-whatsapp", "WhatsApp Business", "Phone Expansion Soporte", 12400, 8.5, 64000, 35),
    ],
  },
  {
    id: "bys",
    name: "Bys",
    sector: "SaaS B2B",
    language: "Espanol",
    tags: ["software", "productividad", "email marketing"],
    accounts: [
      metricAccount("bys-li", "LinkedIn", "Bys", 14200, 5.2, 77200, 15),
      metricAccount("bys-x", "X", "@bysapp", 7800, 3.2, 31400, 19),
      metricAccount("bys-pinterest", "Pinterest", "Bys Ideas", 6100, 4.6, 25500, 9),
      metricAccount("bys-bluesky", "Bluesky", "@bysapp.bsky.social", 4300, 5.9, 22400, 11),
    ],
  },
];

const initialPosts: ScheduledPost[] = [
  post("p1", "serinfor", "serinfor-li", 9, "09:30", "Caso de exito ERP para pymes", "Programado", "Carrusel", "Leads"),
  post("p2", "serinfor", "serinfor-ig", 12, "12:00", "Checklist ciberseguridad basica", "Borrador", "Post", "Comunidad"),
  post("p3", "serinfor-marketing", "sm-tiktok", 10, "18:45", "3 automatizaciones que ahorran tiempo", "Programado", "Video", "Alcance"),
  post("p4", "phone-expansion", "pe-whatsapp", 15, "11:15", "Campana de renovacion de terminales", "Programado", "Post", "Leads"),
  post("p5", "bys", "bys-li", 17, "10:00", "Como medir el rendimiento de una newsletter", "Publicado", "Articulo", "Engagement"),
];

const initialArticles: Article[] = [
  article("a1", "email marketing", "Email automation benchmarks for B2B teams", "Marketing Brew", "EN", "Hoy", "6 min", "Las automatizaciones con mensajes segmentados mejoran la conversion cuando parten de eventos reales del usuario."),
  article("a2", "ciberseguridad", "Las pymes buscan guias simples de seguridad", "Wired Business", "ES", "Ayer", "7 min", "El contenido en formato checklist ayuda a convertir temas tecnicos en acciones comprensibles."),
  article("a3", "retail", "Retailers are turning stores into content studios", "The Business of Fashion", "EN", "Esta semana", "5 min", "Las tiendas fisicas funcionan como pequenos estudios de contenido para redes sociales."),
  article("a4", "automatizacion", "CRM workflows that reduce manual follow-up", "HubSpot Trends", "EN", "Hoy", "4 min", "Los flujos de CRM con disparadores claros reducen tareas repetitivas del equipo comercial."),
  article("a5", "telefonia", "La atencion por mensajeria gana peso en retail", "Think Retail", "ES", "Esta semana", "4 min", "WhatsApp Business se consolida como canal de soporte, preventa y fidelizacion."),
];

const suggestedTopics = ["IA generativa", "UGC", "social commerce", "marca empleadora", "video corto", "automatizacion", "atencion al cliente", "tendencias sectoriales"];
const days = Array.from({ length: 35 }, (_, index) => index + 1);
const browserLanguage = new Intl.DisplayNames(["es"], { type: "language" }).of(navigator.language.split("-")[0]) ?? "Espanol";

function normalizeNetwork(network: string): Network {
  if (network.toLowerCase() === "twitch") return "Bluesky";
  return networks.includes(network as Network) ? network as Network : "Instagram";
}

function normalizeClients(clients: Client[]) {
  return clients.map((client) => ({
    ...client,
    accounts: [
      ...client.accounts.map((account) => ({
        ...account,
        network: normalizeNetwork(account.network),
        handle: account.network.toLowerCase() === "twitch" && account.handle.toLowerCase().includes("twitch") ? account.handle.replace(/twitch/gi, "bluesky") : account.handle,
      })),
      ...(initialClients.find((initialClient) => initialClient.id === client.id)?.accounts.filter((initialAccount) => !client.accounts.some((account) => account.id === initialAccount.id)) ?? []),
    ],
  }));
}

function normalizeUsers(users: StoredUser[]) {
  const merged = [...seedUsers];
  users.forEach((user) => {
    const normalized = { ...user, email: user.email.trim().toLowerCase() };
    const index = merged.findIndex((item) => item.email === normalized.email);
    if (index >= 0) merged[index] = { ...merged[index], ...normalized };
    else merged.push(normalized);
  });
  return merged;
}

function normalizePosts(posts: ScheduledPost[], clients: Client[]) {
  const accountIds = new Set(clients.flatMap((client) => client.accounts.map((account) => account.id)));
  return posts
    .filter((item) => accountIds.has(item.accountId))
    .map((item) => ({
      ...item,
      day: Math.min(31, Math.max(1, Number(item.day) || 1)),
      status: ["Programado", "Borrador", "Publicado"].includes(item.status) ? item.status : "Borrador",
    }));
}

function seedDatabase(): DemoDatabase {
  return {
    version: DB_VERSION,
    users: seedUsers,
    clients: normalizeClients(initialClients),
    posts: initialPosts,
    articles: initialArticles,
    updatedAt: new Date().toISOString(),
  };
}

function readLegacyData() {
  try {
    const clients = localStorage.getItem("newsbys-clients");
    const posts = localStorage.getItem("newsbys-posts");
    return {
      clients: clients ? JSON.parse(clients) as Client[] : initialClients,
      posts: posts ? JSON.parse(posts) as ScheduledPost[] : initialPosts,
    };
  } catch {
    return { clients: initialClients, posts: initialPosts };
  }
}

function normalizeDatabase(database: Partial<DemoDatabase>): DemoDatabase {
  const legacy = readLegacyData();
  const clients = normalizeClients(database.clients ?? legacy.clients);
  return {
    version: DB_VERSION,
    users: normalizeUsers(database.users ?? seedUsers),
    clients,
    posts: normalizePosts(database.posts ?? legacy.posts, clients),
    articles: database.articles?.length ? database.articles : initialArticles,
    updatedAt: new Date().toISOString(),
  };
}

function useDemoDatabase() {
  const [database, setDatabase] = useState<DemoDatabase>(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      const next = raw ? normalizeDatabase(JSON.parse(raw) as Partial<DemoDatabase>) : normalizeDatabase(seedDatabase());
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return next;
    } catch {
      const fallback = seedDatabase();
      localStorage.setItem(DB_KEY, JSON.stringify(fallback));
      return fallback;
    }
  });

  function updateDatabase(next: DemoDatabase | ((current: DemoDatabase) => DemoDatabase)) {
    setDatabase((current) => {
      const resolved = typeof next === "function" ? (next as (current: DemoDatabase) => DemoDatabase)(current) : next;
      const normalized = normalizeDatabase({ ...resolved, updatedAt: new Date().toISOString() });
      localStorage.setItem(DB_KEY, JSON.stringify(normalized));
      return normalized;
    });
  }

  return [database, updateDatabase] as const;
}

function metricAccount(id: string, network: Network, handle: string, audience: number, engagement: number, reach: number, posts: number): SocialAccount {
  return {
    id,
    network,
    handle,
    audience,
    engagement,
    reach,
    posts,
    clicks: Math.round(reach * (0.028 + engagement / 420)),
    saves: Math.round(reach * (0.006 + engagement / 900)),
    responseRate: Math.round(62 + engagement * 4.2),
    growth: Number((1.5 + engagement * 1.15).toFixed(1)),
  };
}

function post(id: string, clientId: string, accountId: string, day: number, time: string, title: string, status: PostStatus, format: Format, goal: Goal): ScheduledPost {
  return { id, clientId, accountId, day, time, title, status, format, goal, files: [] };
}

function article(id: string, tag: string, title: string, source: string, language: string, freshness: string, readTime: string, translated: string): Article {
  return {
    id,
    tag,
    title,
    source,
    language,
    freshness,
    readTime,
    summary: translated,
    translated,
    body: [
      "Los equipos de comunicacion necesitan convertir la tendencia en una accion editorial concreta.",
      "La oportunidad esta en empaquetar la noticia en un formato breve, facil de guardar y adaptado al canal.",
      "Para una demo, este contenido simula el radar de fuentes que luego se conectaria a busquedas reales.",
    ],
    idea: `Crear una pieza sobre ${tag} con gancho practico, ejemplo real y llamada a guardar.`,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function useStoredState<T>(key: string, fallback: T, normalize?: (value: T) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) as T : fallback;
      return normalize ? normalize(parsed) : parsed;
    } catch {
      return normalize ? normalize(fallback) : fallback;
    }
  });

  function update(next: T | ((current: T) => T)) {
    setValue((current) => {
      const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      const normalized = normalize ? normalize(resolved) : resolved;
      localStorage.setItem(key, JSON.stringify(normalized));
      return normalized;
    });
  }

  return [value, update] as const;
}

function App() {
  const [database, setDatabase] = useDemoDatabase();
  const [session, setSession] = useStoredState<User | null>("newsbys-session", null);
  const clients = database.clients;
  const posts = database.posts;
  const articles = database.articles;
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? "serinfor");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(clients[0]?.accounts.map((account) => account.id) ?? []);
  const [activePanel, setActivePanel] = useState<"dashboard" | "descubrimiento" | "admin">("dashboard");
  const [translateArticles, setTranslateArticles] = useState(true);
  const [selectedTag, setSelectedTag] = useState("Todos");
  const [newTag, setNewTag] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [loginError, setLoginError] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
  const [composer, setComposer] = useState({ accountId: clients[0]?.accounts[0]?.id ?? "", title: "", day: "18", time: "10:00", format: "Carrusel" as Format, goal: "Engagement" as Goal });
  const [adminAccount, setAdminAccount] = useState({ clientId: "serinfor", network: "Instagram" as Network, handle: "" });
  const [newClient, setNewClient] = useState({ name: "", sector: "", language: "Espanol" });

  if (!session) {
    return <LoginScreen users={database.users} error={loginError} notice={loginNotice} onLogin={(email, password) => {
      const user = database.users.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
      if (!user) {
        setLoginError("Credenciales demo no validas.");
        setLoginNotice("");
        return;
      }
      setSession({ email: user.email, name: user.name, role: user.role });
      setLoginError("");
      setLoginNotice("");
    }} onRegister={(user) => {
      const email = user.email.trim().toLowerCase();
      if (database.users.some((item) => item.email === email)) {
        setLoginError("Ese email ya existe. Vuelve al login e inicia sesion.");
        setLoginNotice("");
        return false;
      }
      setDatabase((current) => ({
        ...current,
        users: [...current.users, { ...user, email, createdAt: new Date().toISOString(), source: "registered" }],
      }));
      setLoginError("");
      setLoginNotice("Usuario creado. Ahora inicia sesion con tus credenciales.");
      return true;
    }} />;
  }

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0];
  const isAdmin = session.role === "admin";
  const isAdminPr = session.name === "Admin PR";
  const selectedAccounts = selectedClient.accounts.filter((account) => selectedAccountIds.includes(account.id));
  const visibleAccounts = selectedAccounts.length ? selectedAccounts : selectedClient.accounts;
  const clientPosts = posts.filter((item) => item.clientId === selectedClient.id);
  const accountPosts = clientPosts.filter((item) => visibleAccounts.some((account) => account.id === item.accountId));
  const totalReach = visibleAccounts.reduce((sum, account) => sum + account.reach, 0);
  const totalClicks = visibleAccounts.reduce((sum, account) => sum + account.clicks, 0);
  const totalSaves = visibleAccounts.reduce((sum, account) => sum + account.saves, 0);
  const totalPosts = visibleAccounts.reduce((sum, account) => sum + account.posts, 0);
  const avgEngagement = visibleAccounts.reduce((sum, account) => sum + account.engagement, 0) / Math.max(visibleAccounts.length, 1);
  const avgResponse = visibleAccounts.reduce((sum, account) => sum + account.responseRate, 0) / Math.max(visibleAccounts.length, 1);
  const avgGrowth = visibleAccounts.reduce((sum, account) => sum + account.growth, 0) / Math.max(visibleAccounts.length, 1);
  const conversionRate = totalReach > 0 ? (totalClicks / totalReach) * 100 : 0;
  const filteredArticles = articles.filter((item) => selectedClient.tags.includes(item.tag) && (selectedTag === "Todos" || selectedTag === item.tag));
  const missionProgress = Math.min(92, 46 + accountPosts.length * 8 + selectedClient.tags.length * 5);
  const databaseStats = {
    users: database.users.length,
    clients: clients.length,
    accounts: clients.reduce((sum, client) => sum + client.accounts.length, 0),
    posts: posts.length,
  };

  const contentMix = useMemo(() => {
    const formats: Format[] = ["Carrusel", "Video", "Post", "Articulo"];
    return formats.map((format) => ({
      format,
      count: clientPosts.filter((item) => item.format === format).length + (format === "Carrusel" ? 5 : format === "Video" ? 3 : 2),
    }));
  }, [clientPosts]);

  function selectClient(clientId: string) {
    const nextClient = clients.find((client) => client.id === clientId) ?? clients[0];
    setSelectedClientId(nextClient.id);
    setSelectedAccountIds(nextClient.accounts.map((account) => account.id));
    setSelectedTag("Todos");
    setAttachedFiles([]);
    setComposer((current) => ({ ...current, accountId: nextClient.accounts[0]?.id ?? "" }));
    setAdminAccount((current) => ({ ...current, clientId: nextClient.id }));
  }

  function toggleAccount(accountId: string) {
    setSelectedAccountIds((current) => {
      if (current.includes(accountId)) return current.length === 1 ? current : current.filter((id) => id !== accountId);
      return [...current, accountId];
    });
  }

  function addTopic(topic = newTag.trim()) {
    if (!topic) return;
    setDatabase((current) => ({
      ...current,
      clients: current.clients.map((client) => client.id === selectedClient.id && !client.tags.includes(topic) ? { ...client, tags: [...client.tags, topic] } : client),
    }));
    setSelectedTag(topic);
    setNewTag("");
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setAttachedFiles(Array.from(event.target.files ?? []).map((file) => file.name));
  }

  function savePost(status: PostStatus) {
    const account = selectedClient.accounts.find((item) => item.id === composer.accountId) ?? visibleAccounts[0] ?? selectedClient.accounts[0];
    if (!composer.title.trim() || !account) return;
    const nextPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      clientId: selectedClient.id,
      accountId: account.id,
      day: Number(composer.day),
      time: composer.time,
      title: composer.title.trim(),
      status,
      format: composer.format,
      goal: composer.goal,
      files: attachedFiles,
    };
    setDatabase((current) => ({ ...current, posts: [...current.posts, nextPost] }));
    setComposer((current) => ({ ...current, title: "" }));
    setAttachedFiles([]);
  }

  function addAccount() {
    if (!isAdmin || !adminAccount.handle.trim()) return;
    setDatabase((current) => ({
      ...current,
      clients: current.clients.map((client) => {
        if (client.id !== adminAccount.clientId) return client;
        const seed = client.accounts.length + 1;
        return {
          ...client,
          accounts: [...client.accounts, metricAccount(`acc-${Date.now()}`, adminAccount.network, adminAccount.handle.trim(), 3400 + seed * 1900, 3.1 + seed * 0.4, 18000 + seed * 9100, 4 + seed)],
        };
      }),
    }));
    setAdminAccount((current) => ({ ...current, handle: "" }));
  }

function addClient() {
    if (!isAdmin || !newClient.name.trim()) return;
    const id = newClient.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `cliente-${Date.now()}`;
    const client: Client = {
      id: `${id}-${Date.now()}`,
      name: newClient.name.trim(),
      sector: newClient.sector.trim() || "Nuevo cliente",
      language: newClient.language.trim() || "Espanol",
      tags: ["marca", "contenido"],
      accounts: [],
    };
    setDatabase((current) => ({ ...current, clients: [...current.clients, client] }));
    setNewClient({ name: "", sector: "", language: "Espanol" });
    setSelectedClientId(client.id);
    setSelectedAccountIds([]);
    setComposer((current) => ({ ...current, accountId: "" }));
    setAdminAccount((current) => ({ ...current, clientId: client.id }));
    setActivePanel("admin");
  }

  function resetDemoDatabase() {
    const next = seedDatabase();
    setDatabase(next);
    setSession(null);
    setLoginNotice("Base demo reiniciada. Entra de nuevo con Admin PR.");
  }

  return (
    <main className="app-shell">
      <aside className="client-sidebar" aria-label="Clientes">
        <div className="brand-block">
          <div className="brand-mark">NB</div>
          <div>
            <p>Newsbys Demo</p>
            <span>{isAdminPr ? "Admin PR - acceso total" : isAdmin ? "Admin" : "Community Manager"}</span>
          </div>
        </div>

        <div className="role-card">
          <ShieldCheck size={17} />
          <span>{session.name}</span>
          <button type="button" onClick={() => setSession(null)} aria-label="Cerrar sesion"><LogOut size={15} /></button>
        </div>

          <button className="new-client-button" type="button" disabled={!isAdmin} onClick={() => setActivePanel("admin")}>
          <Plus size={16} />
          Cliente
        </button>

        <nav className="client-list">
          {clients.map((client) => (
            <button key={client.id} className={`client-item ${client.id === selectedClient.id ? "active" : ""}`} onClick={() => selectClient(client.id)} type="button">
              <span className="client-avatar">{client.name.slice(0, 2)}</span>
              <span>
                <strong>{client.name}</strong>
                <small>{client.accounts.length} cuentas</small>
              </span>
            </button>
          ))}
        </nav>

        <section className="game-card" aria-label="Progreso semanal">
          <div><Trophy size={18} /><strong>Nivel 4</strong></div>
          <div className="frog-mini" aria-label="Rana estratega"><FrogMascot compact /><strong>Rana estratega</strong></div>
          <span>{isAdminPr ? "Todas las funciones activas" : isAdmin ? "Demo lista para gerencia" : "Estrategia activa"}</span>
          <div className="progress-track"><i style={{ width: `${missionProgress}%` }} /></div>
          <small>{missionProgress}% de la mision semanal</small>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{selectedClient.sector}</p>
            <h1>{selectedClient.name}</h1>
          </div>
          <div className="frog-hero" aria-label="Mascota rana de Newsbys">
            <FrogMascot />
            <span><strong>Rana de guardia</strong><small>Ideas frescas listas para saltar al calendario</small></span>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar"><Search size={18} /></button>
            <button className="primary-button pulse-button" type="button"><Plus size={17} />Programar</button>
          </div>
        </header>

        <section className="account-strip" aria-label="Cuentas conectadas">
          <div className="section-title"><Link2 size={17} /><span>{selectedClient.accounts.length} cuentas conectadas</span></div>
          <div className="account-list">
            {selectedClient.accounts.map((account) => (
              <button type="button" key={account.id} className={`account-chip ${selectedAccountIds.includes(account.id) ? "selected" : ""}`} onClick={() => toggleAccount(account.id)}>
                <NetworkBadge network={account.network} />
                <span>{account.handle}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mission-strip" aria-label="Misiones">
          <article><CheckCircle2 size={18} /><span>Login real de demo</span></article>
          <article><Target size={18} /><span>{isAdminPr ? "Admin PR con acceso total" : isAdmin ? "Permisos admin activos" : "Permisos CM activos"}</span></article>
          <article><Flame size={18} /><span>Datos persistentes</span></article>
        </section>

        <section className="database-strip" aria-label="Estado de base de datos">
          <strong>BBDD local activa</strong>
          <span>{databaseStats.users} usuarios</span>
          <span>{databaseStats.clients} clientes</span>
          <span>{databaseStats.accounts} cuentas</span>
          <span>{databaseStats.posts} publicaciones</span>
        </section>

        <section className="planning-layout">
          <div className="calendar-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">Julio 2026 - {accountPosts.length} registros desde BBDD</p><h2>Calendario editorial</h2></div>
              <button className="ghost-button" type="button"><CalendarDays size={17} />Mes<ChevronDown size={15} /></button>
            </div>

            <div className="calendar-grid">
              {["L", "M", "X", "J", "V", "S", "D"].map((day) => <div className="weekday" key={day}>{day}</div>)}
              {days.map((day) => {
                const dayPosts = accountPosts.filter((item) => item.day === day);
                return (
                  <div className={`day-cell ${day === 9 ? "today" : ""} ${dayPosts.length ? "has-posts" : ""}`} key={day}>
                    <span>{day}</span>
                    {dayPosts.slice(0, 2).map((item) => {
                      const account = selectedClient.accounts.find((candidate) => candidate.id === item.accountId);
                      return <article className={`post-pill ${item.status.toLowerCase()}`} key={item.id}><small>{item.time}</small><strong>{item.title}</strong><em>{account?.network} - {item.format}</em></article>;
                    })}
                    {dayPosts.length > 2 ? <b>+{dayPosts.length - 2}</b> : null}
                  </div>
                );
              })}
            </div>

            <div className="agenda-list">
              {accountPosts.length ? accountPosts.map((item) => {
                const account = selectedClient.accounts.find((candidate) => candidate.id === item.accountId);
                return <article key={item.id} className="agenda-item"><div><strong>{item.day}</strong><small>Jul</small></div><span><b>{item.title}</b><em>{item.time} - {account?.network} - {item.goal}</em></span></article>;
              }) : <article className="empty-agenda"><CalendarDays size={20} /><span>No hay publicaciones guardadas para estas cuentas.</span></article>}
            </div>
          </div>

          <aside className="composer-panel">
            <div className="panel-heading compact"><div><p className="eyebrow">Nueva publicacion</p><h2>Programar contenido</h2></div><Sparkles size={19} /></div>
            <label>Cuenta<select value={composer.accountId} onChange={(event) => setComposer({ ...composer, accountId: event.target.value })}>{selectedClient.accounts.map((account) => <option key={account.id} value={account.id}>{account.network} - {account.handle}</option>)}</select></label>
            <label>Dia<input type="number" min="1" max="31" value={composer.day} onChange={(event) => setComposer({ ...composer, day: event.target.value })} /></label>
            <label>Hora<input type="time" value={composer.time} onChange={(event) => setComposer({ ...composer, time: event.target.value })} /></label>
            <label>Formato<select value={composer.format} onChange={(event) => setComposer({ ...composer, format: event.target.value as Format })}><option>Carrusel</option><option>Video</option><option>Post</option><option>Articulo</option></select></label>
            <label>Objetivo<select value={composer.goal} onChange={(event) => setComposer({ ...composer, goal: event.target.value as Goal })}><option>Alcance</option><option>Engagement</option><option>Leads</option><option>Comunidad</option></select></label>
            <label>Copy<textarea value={composer.title} onChange={(event) => setComposer({ ...composer, title: event.target.value })} placeholder="Escribe el copy de la publicacion..." /></label>
            <label className="upload-drop"><input multiple type="file" accept="image/*,video/*,.pdf" onChange={handleFiles} /><UploadCloud size={20} /><span>Subir imagenes, videos o PDF</span><small>{attachedFiles.length ? `${attachedFiles.length} archivo(s) listo(s)` : "Arrastra o selecciona creatividades"}</small></label>
            {attachedFiles.length ? <div className="file-list">{attachedFiles.map((file) => <span key={file}><Paperclip size={14} />{file}</span>)}</div> : null}
            <div className="composer-actions"><button className="ghost-button" type="button" onClick={() => savePost("Borrador")}><MessageSquareText size={16} />Borrador</button><button className="primary-button" type="button" onClick={() => savePost("Programado")}><Send size={16} />Guardar</button></div>
          </aside>
        </section>

        <nav className="bottom-tabs" aria-label="Analisis y descubrimiento">
          <button className={activePanel === "dashboard" ? "active" : ""} onClick={() => setActivePanel("dashboard")} type="button"><LayoutDashboard size={18} />Dashboard</button>
          <button className={activePanel === "descubrimiento" ? "active" : ""} onClick={() => setActivePanel("descubrimiento")} type="button"><Lightbulb size={18} />Descubrimiento</button>
          {isAdmin ? <button className={activePanel === "admin" ? "active" : ""} onClick={() => setActivePanel("admin")} type="button"><Settings size={18} />Admin</button> : null}
        </nav>

        {activePanel === "dashboard" ? (
          <DashboardPanel visibleAccounts={visibleAccounts} totalReach={totalReach} totalClicks={totalClicks} totalSaves={totalSaves} totalPosts={totalPosts} avgEngagement={avgEngagement} avgResponse={avgResponse} avgGrowth={avgGrowth} conversionRate={conversionRate} contentMix={contentMix} />
        ) : activePanel === "descubrimiento" ? (
          <DiscoveryPanel selectedClient={selectedClient} selectedTag={selectedTag} setSelectedTag={setSelectedTag} newTag={newTag} setNewTag={setNewTag} addTopic={addTopic} filteredArticles={filteredArticles} translateArticles={translateArticles} setTranslateArticles={setTranslateArticles} setSelectedArticle={setSelectedArticle} />
        ) : (
          <AdminPanel clients={clients} networks={networks} databaseStats={databaseStats} newClient={newClient} setNewClient={setNewClient} adminAccount={adminAccount} setAdminAccount={setAdminAccount} addClient={addClient} addAccount={addAccount} resetDemoDatabase={resetDemoDatabase} />
        )}
      </section>

      {selectedArticle ? <ArticleModal article={selectedArticle} translateArticles={translateArticles} onClose={() => setSelectedArticle(null)} /> : null}
    </main>
  );
}

function LoginScreen({ users, error, notice, onLogin, onRegister }: {
  users: StoredUser[];
  error: string;
  notice: string;
  onLogin: (email: string, password: string) => void;
  onRegister: (user: Omit<StoredUser, "createdAt" | "source">) => boolean;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("admin.pr@newsbys.demo");
  const [password, setPassword] = useState("AdminPR2026!");
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", role: "cm" as Role });
  const [registerError, setRegisterError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    onLogin(email, password);
  }
  function submitRegister(event: FormEvent) {
    event.preventDefault();
    if (!registerData.name.trim() || !registerData.email.trim() || registerData.password.length < 6) {
      setRegisterError("Completa nombre, email y una contrasena de al menos 6 caracteres.");
      return;
    }
    const created = onRegister({
      name: registerData.name.trim(),
      email: registerData.email,
      password: registerData.password,
      role: registerData.role,
    });
    if (!created) return;
    setEmail(registerData.email.trim().toLowerCase());
    setPassword("");
    setRegisterData({ name: "", email: "", password: "", role: "cm" });
    setRegisterError("");
    setMode("login");
  }
  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand-block dark">
          <div className="brand-mark">NB</div>
          <div><p>Newsbys Demo</p><span>Acceso gerencia</span></div>
        </div>
        <FrogMascot />
        <h1>Demo privada para validar el proyecto</h1>
        <p>Accede como Admin PR para revisar todas las funcionalidades, o cambia a CM/Admin para validar permisos por rol.</p>
        <div className="login-tabs">
          <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>Registro</button>
        </div>
        {mode === "login" ? (
          <>
            <form onSubmit={submit}>
              <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label>Contrasena<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              {notice ? <strong className="login-notice">{notice}</strong> : null}
              {error ? <strong className="login-error">{error}</strong> : null}
              <button className="primary-button" type="submit"><LockKeyhole size={16} />Entrar</button>
            </form>
            <div className="demo-credentials">
              <button type="button" onClick={() => { setEmail("admin.pr@newsbys.demo"); setPassword("AdminPR2026!"); }}>Usar Admin PR</button>
              <button type="button" onClick={() => { setEmail("cm@newsbys.demo"); setPassword("Demo2026!"); }}>Usar CM</button>
              <button type="button" onClick={() => { setEmail("admin@newsbys.demo"); setPassword("Admin2026!"); }}>Usar Admin</button>
            </div>
            <small className="login-db-note">{users.length} usuarios guardados en BBDD local.</small>
          </>
        ) : (
          <form onSubmit={submitRegister}>
            <label>Nombre<input value={registerData.name} onChange={(event) => setRegisterData({ ...registerData, name: event.target.value })} placeholder="Ej. Maria CM" /></label>
            <label>Email<input value={registerData.email} onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })} placeholder="tu@email.com" /></label>
            <label>Contrasena<input type="password" value={registerData.password} onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })} /></label>
            <label>Rol<select value={registerData.role} onChange={(event) => setRegisterData({ ...registerData, role: event.target.value as Role })}><option value="cm">CM</option><option value="admin">Admin</option></select></label>
            {registerError ? <strong className="login-error">{registerError}</strong> : null}
            {error ? <strong className="login-error">{error}</strong> : null}
            <button className="primary-button" type="submit"><Users size={16} />Crear usuario y volver al login</button>
          </form>
        )}
      </section>
    </main>
  );
}

function DashboardPanel({ visibleAccounts, totalReach, totalClicks, totalSaves, totalPosts, avgEngagement, avgResponse, avgGrowth, conversionRate, contentMix }: {
  visibleAccounts: SocialAccount[];
  totalReach: number;
  totalClicks: number;
  totalSaves: number;
  totalPosts: number;
  avgEngagement: number;
  avgResponse: number;
  avgGrowth: number;
  conversionRate: number;
  contentMix: Array<{ format: string; count: number }>;
}) {
  return (
    <section className="dashboard-panel">
      <Metric title="Alcance total" value={formatNumber(totalReach)} detail="+12,4% vs. periodo anterior" icon={<TrendingUp size={14} />} hero />
      <Metric title="Engagement medio" value={`${avgEngagement.toFixed(1)}%`} detail={`${visibleAccounts.length} cuentas comparadas`} icon={<BarChart3 size={14} />} />
      <Metric title="Conversion a clic" value={`${conversionRate.toFixed(1)}%`} detail={`${formatNumber(totalClicks)} clics registrados`} icon={<MousePointerClick size={14} />} />
      <Metric title="Guardados" value={formatNumber(totalSaves)} detail="Contenido con valor reutilizable" icon={<Award size={14} />} />
      <Metric title="Respuesta comunidad" value={`${avgResponse.toFixed(0)}%`} detail="SLA social saludable" icon={<Clock3 size={14} />} />
      <Metric title="Crecimiento audiencia" value={`+${avgGrowth.toFixed(1)}%`} detail={`${totalPosts} posts analizados`} icon={<Eye size={14} />} />

      <div className="insight-card content-mix">
        <div className="panel-heading compact"><div><p className="eyebrow">Mix editorial</p><h2>Formatos que alimentan la estrategia</h2></div><ImagePlus size={18} /></div>
        {contentMix.map((item) => <div className="mix-row" key={item.format}><span>{item.format}</span><i style={{ width: `${Math.min(item.count * 9, 100)}%` }} /><b>{item.count}</b></div>)}
      </div>
      <div className="insight-card recommendations">
        <div className="panel-heading compact"><div><p className="eyebrow">Recomendaciones</p><h2>Lectura rapida del CM</h2></div><Sparkles size={18} /></div>
        <ul><li>Reforzar carruseles: generan mas guardados y senales de calidad.</li><li>Publicar LinkedIn entre 10:00 y 12:00 para mejorar clics B2B.</li><li>Convertir comentarios frecuentes en piezas de descubrimiento.</li></ul>
      </div>
      <div className="comparison-table">
        <div className="table-head"><span>Cuenta</span><span>Audiencia</span><span>Alcance</span><span>Engagement</span><span>Posts</span><span>Score</span></div>
        {visibleAccounts.map((account) => <div className="table-row" key={account.id}><span><NetworkBadge network={account.network} /> {account.handle}</span><span>{formatNumber(account.audience)}</span><span>{formatNumber(account.reach)}</span><span><i style={{ width: `${Math.min(account.engagement * 10, 100)}%` }} />{account.engagement}%</span><span>{account.posts}</span><span>{Math.round(account.engagement * 9 + account.responseRate / 2)}</span></div>)}
      </div>
    </section>
  );
}

function Metric({ title, value, detail, icon, hero = false }: { title: string; value: string; detail: string; icon: React.ReactNode; hero?: boolean }) {
  return <div className={`metric-card ${hero ? "hero-metric" : ""}`}><span>{title}</span><strong>{value}</strong><small>{icon}{detail}</small></div>;
}

function DiscoveryPanel({ selectedClient, selectedTag, setSelectedTag, newTag, setNewTag, addTopic, filteredArticles, translateArticles, setTranslateArticles, setSelectedArticle }: {
  selectedClient: Client;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  addTopic: (topic?: string) => void;
  filteredArticles: Article[];
  translateArticles: boolean;
  setTranslateArticles: (value: boolean | ((current: boolean) => boolean)) => void;
  setSelectedArticle: (article: Article) => void;
}) {
  return (
    <section className="discovery-panel">
      <div className="discovery-toolbar"><div><p className="eyebrow">Radar editorial</p><h2>Inspiracion para {selectedClient.name}</h2></div><div className="toolbar-controls"><label className="language-select"><Languages size={16} /><select defaultValue={browserLanguage}><option>{browserLanguage}</option><option>Espanol</option><option>Ingles</option><option>Frances</option></select></label><button className={`toggle-button ${translateArticles ? "active" : ""}`} type="button" onClick={() => setTranslateArticles((value) => !value)}><Globe2 size={16} />Traducir</button></div></div>
      <div className="topic-builder"><label>Tematicas del cliente<span><input value={newTag} onChange={(event) => setNewTag(event.target.value)} placeholder="Ej. social commerce" /><button className="primary-button" type="button" onClick={() => addTopic()}><Plus size={16} />Anadir</button></span></label><div className="suggested-topics">{suggestedTopics.map((topic) => <button key={topic} type="button" onClick={() => addTopic(topic)}><Sparkles size={14} />{topic}</button>)}</div></div>
      <div className="tag-row">{["Todos", ...selectedClient.tags].map((tag) => <button className={selectedTag === tag ? "active" : ""} key={tag} onClick={() => setSelectedTag(tag)} type="button">{tag}</button>)}</div>
      <div className="article-grid">{filteredArticles.length ? filteredArticles.map((article) => <article className="article-card" key={article.id}><div><span>{article.source}</span><small>{article.language} - {article.freshness} - {article.readTime}</small></div><h3>{article.title}</h3><p>{translateArticles ? article.translated : article.summary}</p><footer><em>{article.tag}</em><button type="button" onClick={() => setSelectedArticle(article)}>Leer articulo</button></footer></article>) : <article className="empty-discovery"><Lightbulb size={22} /><h3>Radar preparando nuevas fuentes</h3><p>La tematica seleccionada queda guardada para futuras busquedas y recomendaciones.</p></article>}</div>
    </section>
  );
}

function AdminPanel({ clients, networks, databaseStats, newClient, setNewClient, adminAccount, setAdminAccount, addClient, addAccount, resetDemoDatabase }: {
  clients: Client[];
  networks: Network[];
  databaseStats: { users: number; clients: number; accounts: number; posts: number };
  newClient: { name: string; sector: string; language: string };
  setNewClient: (value: { name: string; sector: string; language: string }) => void;
  adminAccount: { clientId: string; network: Network; handle: string };
  setAdminAccount: (value: { clientId: string; network: Network; handle: string }) => void;
  addClient: () => void;
  addAccount: () => void;
  resetDemoDatabase: () => void;
}) {
  return (
    <section className="admin-panel">
      <div className="panel-heading"><div><p className="eyebrow">Admin</p><h2>Vincular redes y revisar clientes</h2></div><Settings size={19} /></div>
      <div className="db-summary">
        <span><Users size={16} />{databaseStats.users} usuarios</span>
        <span>{databaseStats.clients} clientes</span>
        <span>{databaseStats.accounts} cuentas</span>
        <span>{databaseStats.posts} publicaciones</span>
      </div>
      <div className="admin-grid client-grid">
        <label>Nuevo cliente<input value={newClient.name} onChange={(event) => setNewClient({ ...newClient, name: event.target.value })} placeholder="Nombre del cliente" /></label>
        <label>Sector<input value={newClient.sector} onChange={(event) => setNewClient({ ...newClient, sector: event.target.value })} placeholder="Ej. SaaS B2B" /></label>
        <label>Idioma<input value={newClient.language} onChange={(event) => setNewClient({ ...newClient, language: event.target.value })} /></label>
        <button className="primary-button" type="button" onClick={addClient}><Plus size={16} />Crear cliente</button>
      </div>
      <div className="admin-grid">
        <label>Cliente<select value={adminAccount.clientId} onChange={(event) => setAdminAccount({ ...adminAccount, clientId: event.target.value })}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
        <label>Red social<select value={adminAccount.network} onChange={(event) => setAdminAccount({ ...adminAccount, network: event.target.value as Network })}>{networks.map((network) => <option key={network}>{network}</option>)}</select></label>
        <label>Cuenta<input value={adminAccount.handle} onChange={(event) => setAdminAccount({ ...adminAccount, handle: event.target.value })} placeholder="@cuenta o nombre de pagina" /></label>
        <button className="primary-button" type="button" onClick={addAccount}><Plus size={16} />Vincular cuenta</button>
      </div>
      <div className="network-catalog">{networks.map((network) => <span key={network}><NetworkBadge network={network} />{network}</span>)}</div>
      <button className="ghost-button danger-lite" type="button" onClick={resetDemoDatabase}>Reiniciar BBDD demo</button>
    </section>
  );
}

function ArticleModal({ article, translateArticles, onClose }: { article: Article; translateArticles: boolean; onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Articulo"><article className="article-modal"><button className="icon-button close-button" aria-label="Cerrar articulo" type="button" onClick={onClose}><CloseIcon size={18} /></button><span className="modal-source">{article.source} - {article.language} - {article.readTime}</span><h2>{article.title}</h2>{(translateArticles ? [article.translated, ...article.body] : [article.summary, ...article.body]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="idea-box"><Sparkles size={18} /><span>{article.idea}</span></div><button className="primary-button" type="button" onClick={onClose}>Crear idea desde articulo</button></article></div>;
}

function NetworkBadge({ network }: { network: Network }) {
  return <span className={`network-badge ${network.toLowerCase().replace(/\s+/g, "-")}`}>{network.slice(0, 2)}</span>;
}

function FrogMascot({ compact = false }: { compact?: boolean }) {
  return <span className={`frog-mascot ${compact ? "compact" : ""}`} aria-hidden="true"><span className="frog-eye left" /><span className="frog-eye right" /><span className="frog-smile" /></span>;
}

createRoot(document.getElementById("root")!).render(<App />);
