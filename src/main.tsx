import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  Clock3,
  Eye,
  Globe2,
  Languages,
  LayoutDashboard,
  Lightbulb,
  Link2,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import "./styles.css";

type Network = "Instagram" | "LinkedIn" | "TikTok" | "X";

type SocialAccount = {
  id: string;
  network: Network;
  handle: string;
  audience: number;
  engagement: number;
  reach: number;
  posts: number;
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
  status: "Programado" | "Borrador" | "Publicado";
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
};

const clients: Client[] = [
  {
    id: "north",
    name: "North & Co",
    sector: "Retail premium",
    language: "Español",
    tags: ["moda sostenible", "retail", "experiencia cliente"],
    accounts: [
      { id: "ig-north", network: "Instagram", handle: "@northandco", audience: 28400, engagement: 5.8, reach: 183000, posts: 18 },
      { id: "li-north-brand", network: "LinkedIn", handle: "North & Co", audience: 9200, engagement: 3.6, reach: 42000, posts: 9 },
      { id: "li-north-lab", network: "LinkedIn", handle: "North Lab", audience: 4100, engagement: 4.2, reach: 17500, posts: 6 },
    ],
  },
  {
    id: "aurora",
    name: "Aurora Foods",
    sector: "Alimentacion",
    language: "Español",
    tags: ["foodtech", "recetas", "consumo local"],
    accounts: [
      { id: "ig-aurora", network: "Instagram", handle: "@aurorafoods", audience: 36200, engagement: 6.4, reach: 211000, posts: 24 },
      { id: "tt-aurora", network: "TikTok", handle: "@aurorakitchen", audience: 50800, engagement: 8.1, reach: 388000, posts: 31 },
      { id: "li-aurora", network: "LinkedIn", handle: "Aurora Foods", audience: 7800, engagement: 3.1, reach: 26500, posts: 7 },
    ],
  },
  {
    id: "kubo",
    name: "Kubo Legal",
    sector: "Servicios B2B",
    language: "Español",
    tags: ["legaltech", "pymes", "ciberseguridad"],
    accounts: [
      { id: "li-kubo", network: "LinkedIn", handle: "Kubo Legal", audience: 16400, engagement: 4.8, reach: 73500, posts: 14 },
      { id: "x-kubo", network: "X", handle: "@kubolegal", audience: 6800, engagement: 2.7, reach: 31200, posts: 19 },
    ],
  },
];

const scheduledPosts: ScheduledPost[] = [
  { id: "p1", clientId: "north", accountId: "ig-north", day: 8, time: "09:30", title: "Carrusel nueva coleccion", status: "Programado" },
  { id: "p2", clientId: "north", accountId: "li-north-brand", day: 11, time: "12:00", title: "Caso de cliente retail", status: "Borrador" },
  { id: "p3", clientId: "north", accountId: "li-north-lab", day: 15, time: "16:15", title: "Tendencias de tienda fisica", status: "Programado" },
  { id: "p4", clientId: "aurora", accountId: "tt-aurora", day: 9, time: "18:45", title: "Receta rapida de temporada", status: "Programado" },
  { id: "p5", clientId: "kubo", accountId: "li-kubo", day: 17, time: "10:00", title: "Checklist legal para pymes", status: "Publicado" },
];

const articles: Article[] = [
  {
    id: "a1",
    title: "Retailers are turning stores into content studios",
    source: "The Business of Fashion",
    language: "EN",
    tag: "retail",
    summary: "Brands are using physical stores to produce social-first experiences and creator collaborations.",
    translated: "Las marcas estan usando las tiendas fisicas para crear experiencias sociales y colaboraciones con creadores.",
    freshness: "Hoy",
  },
  {
    id: "a2",
    title: "El consumidor premia la trazabilidad en moda sostenible",
    source: "Modaes",
    language: "ES",
    tag: "moda sostenible",
    summary: "Los compradores responden mejor a mensajes concretos sobre materiales, procesos y durabilidad.",
    translated: "Los compradores responden mejor a mensajes concretos sobre materiales, procesos y durabilidad.",
    freshness: "Ayer",
  },
  {
    id: "a3",
    title: "LinkedIn updates brand analytics for multi-page companies",
    source: "Social Media Today",
    language: "EN",
    tag: "experiencia cliente",
    summary: "New comparison views help marketing teams evaluate pages and audience quality across business units.",
    translated: "Las nuevas vistas comparativas ayudan a evaluar paginas y calidad de audiencia entre unidades de negocio.",
    freshness: "Esta semana",
  },
  {
    id: "a4",
    title: "Les marques misent sur les formats courts pedagogiques",
    source: "Les Echos",
    language: "FR",
    tag: "retail",
    summary: "Les formats courts et utiles gagnent du terrain dans la communication des marques de service.",
    translated: "Los formatos cortos y utiles ganan terreno en la comunicacion de marcas de servicios.",
    freshness: "Esta semana",
  },
];

const days = Array.from({ length: 35 }, (_, index) => index + 1);
const browserLanguage = new Intl.DisplayNames(["es"], { type: "language" }).of(navigator.language.split("-")[0]) ?? "Español";

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function App() {
  const [selectedClientId, setSelectedClientId] = useState(clients[0].id);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(clients[0].accounts.map((account) => account.id));
  const [activePanel, setActivePanel] = useState<"dashboard" | "descubrimiento">("dashboard");
  const [translateArticles, setTranslateArticles] = useState(true);
  const [selectedTag, setSelectedTag] = useState("Todos");

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0];
  const visibleAccounts = selectedClient.accounts.filter((account) => selectedAccountIds.includes(account.id));
  const totalReach = visibleAccounts.reduce((sum, account) => sum + account.reach, 0);
  const avgEngagement = visibleAccounts.reduce((sum, account) => sum + account.engagement, 0) / Math.max(visibleAccounts.length, 1);
  const clientPosts = scheduledPosts.filter((post) => post.clientId === selectedClient.id);
  const accountPosts = clientPosts.filter((post) => selectedAccountIds.includes(post.accountId));
  const filteredArticles = articles.filter((article) => {
    const belongsToClient = selectedClient.tags.includes(article.tag);
    return belongsToClient && (selectedTag === "Todos" || article.tag === selectedTag);
  });

  const bestAccount = useMemo(() => {
    return [...visibleAccounts].sort((a, b) => b.engagement * b.reach - a.engagement * a.reach)[0];
  }, [visibleAccounts]);

  function selectClient(clientId: string) {
    const nextClient = clients.find((client) => client.id === clientId) ?? clients[0];
    setSelectedClientId(clientId);
    setSelectedAccountIds(nextClient.accounts.map((account) => account.id));
    setSelectedTag("Todos");
  }

  function toggleAccount(accountId: string) {
    setSelectedAccountIds((current) => {
      if (current.includes(accountId)) {
        return current.length === 1 ? current : current.filter((id) => id !== accountId);
      }
      return [...current, accountId];
    });
  }

  return (
    <main className="app-shell">
      <aside className="client-sidebar" aria-label="Clientes">
        <div className="brand-block">
          <div className="brand-mark">NB</div>
          <div>
            <p>NewsBys</p>
            <span>Social Planner</span>
          </div>
        </div>

        <button className="new-client-button" type="button">
          <Plus size={16} />
          Cliente
        </button>

        <nav className="client-list">
          {clients.map((client) => (
            <button
              key={client.id}
              className={`client-item ${client.id === selectedClient.id ? "active" : ""}`}
              onClick={() => selectClient(client.id)}
              type="button"
            >
              <span className="client-avatar">{client.name.slice(0, 2)}</span>
              <span>
                <strong>{client.name}</strong>
                <small>{client.accounts.length} cuentas</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Users size={16} />
          <span>CM: Laura Martin</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{selectedClient.sector}</p>
            <h1>{selectedClient.name}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar">
              <Search size={18} />
            </button>
            <button className="primary-button" type="button">
              <Plus size={17} />
              Programar
            </button>
          </div>
        </header>

        <section className="account-strip" aria-label="Cuentas conectadas">
          <div className="section-title">
            <Link2 size={17} />
            <span>{selectedClient.accounts.length} cuentas conectadas</span>
          </div>
          <div className="account-list">
            {selectedClient.accounts.map((account) => (
              <button
                type="button"
                key={account.id}
                className={`account-chip ${selectedAccountIds.includes(account.id) ? "selected" : ""}`}
                onClick={() => toggleAccount(account.id)}
              >
                <NetworkBadge network={account.network} />
                <span>{account.handle}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="planning-layout">
          <div className="calendar-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Julio 2026</p>
                <h2>Calendario editorial</h2>
              </div>
              <button className="ghost-button" type="button">
                <CalendarDays size={17} />
                Mes
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="calendar-grid">
              {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                <div className="weekday" key={day}>{day}</div>
              ))}
              {days.map((day) => {
                const posts = accountPosts.filter((post) => post.day === day);
                return (
                  <div className={`day-cell ${day === 8 ? "today" : ""}`} key={day}>
                    <span>{day}</span>
                    {posts.slice(0, 2).map((post) => {
                      const account = selectedClient.accounts.find((item) => item.id === post.accountId);
                      return (
                        <article className={`post-pill ${post.status.toLowerCase()}`} key={post.id}>
                          <small>{post.time}</small>
                          <strong>{post.title}</strong>
                          <em>{account?.network}</em>
                        </article>
                      );
                    })}
                    {posts.length > 2 ? <b>+{posts.length - 2}</b> : null}
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="composer-panel">
            <div className="panel-heading compact">
              <div>
                <p className="eyebrow">Nueva publicacion</p>
                <h2>Programar contenido</h2>
              </div>
              <Sparkles size={19} />
            </div>
            <label>
              Cuenta
              <select>
                {selectedClient.accounts.map((account) => (
                  <option key={account.id}>{account.network} · {account.handle}</option>
                ))}
              </select>
            </label>
            <label>
              Fecha y hora
              <input type="datetime-local" defaultValue="2026-07-08T09:30" />
            </label>
            <label>
              Copy
              <textarea defaultValue="Idea de publicacion inspirada en las tendencias del cliente..." />
            </label>
            <div className="composer-actions">
              <button className="ghost-button" type="button">
                <MessageSquareText size={16} />
                Borrador
              </button>
              <button className="primary-button" type="button">
                <Send size={16} />
                Guardar
              </button>
            </div>
          </aside>
        </section>

        <nav className="bottom-tabs" aria-label="Analisis y descubrimiento">
          <button className={activePanel === "dashboard" ? "active" : ""} onClick={() => setActivePanel("dashboard")} type="button">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className={activePanel === "descubrimiento" ? "active" : ""} onClick={() => setActivePanel("descubrimiento")} type="button">
            <Lightbulb size={18} />
            Descubrimiento
          </button>
        </nav>

        {activePanel === "dashboard" ? (
          <section className="dashboard-panel">
            <div className="metric-card">
              <span>Alcance total</span>
              <strong>{formatNumber(totalReach)}</strong>
              <small><TrendingUp size={14} /> +12,4% vs. periodo anterior</small>
            </div>
            <div className="metric-card">
              <span>Engagement medio</span>
              <strong>{avgEngagement.toFixed(1)}%</strong>
              <small><BarChart3 size={14} /> {visibleAccounts.length} cuentas comparadas</small>
            </div>
            <div className="metric-card">
              <span>Mejor rendimiento</span>
              <strong>{bestAccount?.handle}</strong>
              <small><Eye size={14} /> {bestAccount?.network} lidera la estrategia</small>
            </div>

            <div className="comparison-table">
              <div className="table-head">
                <span>Cuenta</span>
                <span>Audiencia</span>
                <span>Alcance</span>
                <span>Engagement</span>
                <span>Posts</span>
              </div>
              {visibleAccounts.map((account) => (
                <div className="table-row" key={account.id}>
                  <span><NetworkBadge network={account.network} /> {account.handle}</span>
                  <span>{formatNumber(account.audience)}</span>
                  <span>{formatNumber(account.reach)}</span>
                  <span>
                    <i style={{ width: `${Math.min(account.engagement * 10, 100)}%` }} />
                    {account.engagement}%
                  </span>
                  <span>{account.posts}</span>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="discovery-panel">
            <div className="discovery-toolbar">
              <div>
                <p className="eyebrow">Radar editorial</p>
                <h2>Inspiracion para {selectedClient.name}</h2>
              </div>
              <div className="toolbar-controls">
                <label className="language-select">
                  <Languages size={16} />
                  <select defaultValue={browserLanguage}>
                    <option>{browserLanguage}</option>
                    <option>Español</option>
                    <option>Inglés</option>
                    <option>Francés</option>
                  </select>
                </label>
                <button
                  className={`toggle-button ${translateArticles ? "active" : ""}`}
                  type="button"
                  onClick={() => setTranslateArticles((value) => !value)}
                >
                  <Globe2 size={16} />
                  Traducir
                </button>
              </div>
            </div>

            <div className="tag-row">
              {["Todos", ...selectedClient.tags].map((tag) => (
                <button className={selectedTag === tag ? "active" : ""} key={tag} onClick={() => setSelectedTag(tag)} type="button">
                  {tag}
                </button>
              ))}
            </div>

            <div className="article-grid">
              {filteredArticles.map((article) => (
                <article className="article-card" key={article.id}>
                  <div>
                    <span>{article.source}</span>
                    <small>{article.language} · {article.freshness}</small>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{translateArticles ? article.translated : article.summary}</p>
                  <footer>
                    <em>{article.tag}</em>
                    <button type="button">Crear idea</button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function NetworkBadge({ network }: { network: Network }) {
  return <span className={`network-badge ${network.toLowerCase()}`}>{network.slice(0, 2)}</span>;
}

createRoot(document.getElementById("root")!).render(<App />);
