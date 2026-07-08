import React, { ChangeEvent, useMemo, useState } from "react";
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
  MessageSquareText,
  MousePointerClick,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UploadCloud,
  Users,
  X as CloseIcon,
} from "lucide-react";
import "./styles.css";

type Network = "Instagram" | "LinkedIn" | "TikTok" | "X";
type PostStatus = "Programado" | "Borrador" | "Publicado";

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
  format: "Carrusel" | "Video" | "Post" | "Articulo";
  goal: "Alcance" | "Engagement" | "Leads" | "Comunidad";
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

const clients: Client[] = [
  {
    id: "north",
    name: "North & Co",
    sector: "Retail premium",
    language: "Espanol",
    tags: ["moda sostenible", "retail", "experiencia cliente"],
    accounts: [
      { id: "ig-north", network: "Instagram", handle: "@northandco", audience: 28400, engagement: 5.8, reach: 183000, posts: 18, clicks: 6200, saves: 1240, responseRate: 92, growth: 8.6 },
      { id: "li-north-brand", network: "LinkedIn", handle: "North & Co", audience: 9200, engagement: 3.6, reach: 42000, posts: 9, clicks: 1840, saves: 390, responseRate: 76, growth: 4.2 },
      { id: "li-north-lab", network: "LinkedIn", handle: "North Lab", audience: 4100, engagement: 4.2, reach: 17500, posts: 6, clicks: 980, saves: 210, responseRate: 82, growth: 6.7 },
    ],
  },
  {
    id: "aurora",
    name: "Aurora Foods",
    sector: "Alimentacion",
    language: "Espanol",
    tags: ["foodtech", "recetas", "consumo local"],
    accounts: [
      { id: "ig-aurora", network: "Instagram", handle: "@aurorafoods", audience: 36200, engagement: 6.4, reach: 211000, posts: 24, clicks: 9100, saves: 2840, responseRate: 88, growth: 9.1 },
      { id: "tt-aurora", network: "TikTok", handle: "@aurorakitchen", audience: 50800, engagement: 8.1, reach: 388000, posts: 31, clicks: 14200, saves: 4380, responseRate: 81, growth: 13.4 },
      { id: "li-aurora", network: "LinkedIn", handle: "Aurora Foods", audience: 7800, engagement: 3.1, reach: 26500, posts: 7, clicks: 1120, saves: 260, responseRate: 73, growth: 3.9 },
    ],
  },
  {
    id: "kubo",
    name: "Kubo Legal",
    sector: "Servicios B2B",
    language: "Espanol",
    tags: ["legaltech", "pymes", "ciberseguridad"],
    accounts: [
      { id: "li-kubo", network: "LinkedIn", handle: "Kubo Legal", audience: 16400, engagement: 4.8, reach: 73500, posts: 14, clicks: 4100, saves: 760, responseRate: 86, growth: 5.8 },
      { id: "x-kubo", network: "X", handle: "@kubolegal", audience: 6800, engagement: 2.7, reach: 31200, posts: 19, clicks: 1550, saves: 180, responseRate: 69, growth: 2.4 },
    ],
  },
];

const scheduledPosts: ScheduledPost[] = [
  { id: "p1", clientId: "north", accountId: "ig-north", day: 8, time: "09:30", title: "Carrusel nueva coleccion", status: "Programado", format: "Carrusel", goal: "Engagement" },
  { id: "p2", clientId: "north", accountId: "li-north-brand", day: 11, time: "12:00", title: "Caso de cliente retail", status: "Borrador", format: "Articulo", goal: "Leads" },
  { id: "p3", clientId: "north", accountId: "li-north-lab", day: 15, time: "16:15", title: "Tendencias de tienda fisica", status: "Programado", format: "Post", goal: "Comunidad" },
  { id: "p4", clientId: "aurora", accountId: "tt-aurora", day: 9, time: "18:45", title: "Receta rapida de temporada", status: "Programado", format: "Video", goal: "Alcance" },
  { id: "p5", clientId: "kubo", accountId: "li-kubo", day: 17, time: "10:00", title: "Checklist legal para pymes", status: "Publicado", format: "Carrusel", goal: "Leads" },
];

const articles: Article[] = [
  {
    id: "a1",
    title: "Retailers are turning stores into content studios",
    source: "The Business of Fashion",
    language: "EN",
    tag: "retail",
    summary: "Brands are using physical stores to produce social-first experiences and creator collaborations.",
    translated: "Las marcas usan tiendas fisicas para crear experiencias sociales y colaboraciones con creadores.",
    freshness: "Hoy",
    readTime: "6 min",
    body: [
      "Retail teams are treating stores as small production hubs where creators, staff and customers generate usable social content every week.",
      "The most effective examples connect the in-store experience with short educational formats, product trials and behind-the-scenes moments.",
      "For a CM, the opportunity is to turn the store calendar into a content calendar: launches, staff picks, customer questions and micro-events.",
    ],
    idea: "Crear una serie de reels desde tienda con un vendedor explicando una prenda en 30 segundos.",
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
    readTime: "4 min",
    body: [
      "La comunicacion de sostenibilidad funciona mejor cuando evita promesas genericas y muestra datos verificables.",
      "Los contenidos con detalle de materiales, origen y cuidado de producto generan mas guardados que los posts puramente aspiracionales.",
      "Una buena linea editorial puede mezclar producto, educacion y transparencia sin sonar defensiva.",
    ],
    idea: "Publicar un carrusel: origen, material, cuidado y vida util de un producto clave.",
  },
  {
    id: "a3",
    title: "LinkedIn updates brand analytics for multi-page companies",
    source: "Social Media Today",
    language: "EN",
    tag: "experiencia cliente",
    summary: "New comparison views help marketing teams evaluate pages and audience quality across business units.",
    translated: "Nuevas vistas comparativas ayudan a evaluar paginas y calidad de audiencia entre unidades de negocio.",
    freshness: "Esta semana",
    readTime: "5 min",
    body: [
      "LinkedIn is adding more context to brand analytics so teams can compare audience quality, interaction and content cadence.",
      "The signal is useful for companies with several pages because it highlights which topics belong in each channel.",
      "CM teams can use these comparisons to stop duplicating posts and assign a clearer purpose to each account.",
    ],
    idea: "Comparar dos paginas de LinkedIn y convertir la diferencia de audiencia en dos lineas editoriales.",
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
    readTime: "3 min",
    body: [
      "Les marques privilegient des formats courts qui repondent a une question concrete du public.",
      "Ce type de contenu facilite la repetition editoriale sans fatiguer l'audience.",
      "La structure la plus efficace combine une question, une reponse visuelle et une action simple.",
    ],
    idea: "Crear una plantilla semanal de preguntas frecuentes con respuesta visual breve.",
  },
  {
    id: "a5",
    title: "Short-form video keeps leading discovery for food brands",
    source: "HubSpot Trends",
    language: "EN",
    tag: "recetas",
    summary: "Recipe clips with a clear first frame and practical hook are outperforming polished brand videos.",
    translated: "Los clips de recetas con primer plano claro y gancho practico superan a videos de marca demasiado pulidos.",
    freshness: "Hoy",
    readTime: "4 min",
    body: [
      "Food audiences react quickly to utility: what is the recipe, how long does it take and why should I save it?",
      "The strongest posts show the final dish early and use simple steps that can be understood without audio.",
      "Comments often become a source of future content when the brand asks what ingredient people would change.",
    ],
    idea: "Lanzar una serie de recetas de 20 segundos con final visible en el primer segundo.",
  },
  {
    id: "a6",
    title: "SMBs seek practical cyber-security guidance",
    source: "Wired Business",
    language: "EN",
    tag: "ciberseguridad",
    summary: "Small companies are looking for plain-language security checklists instead of technical explainers.",
    translated: "Las pequenas empresas buscan checklists de seguridad en lenguaje claro, no explicaciones tecnicas.",
    freshness: "Ayer",
    readTime: "7 min",
    body: [
      "Cyber-security content for SMBs performs better when it turns complex risk into a short action list.",
      "The best posts avoid fear-led messaging and frame security as operational hygiene.",
      "A legal or consulting brand can own this space by publishing checklists, templates and scenario-based examples.",
    ],
    idea: "Crear un carrusel: 5 acciones de seguridad que una pyme puede revisar en 15 minutos.",
  },
];

const suggestedTopics = [
  "IA generativa",
  "UGC",
  "social commerce",
  "marca empleadora",
  "video corto",
  "automatizacion",
  "atencion al cliente",
  "tendencias sectoriales",
];

const days = Array.from({ length: 35 }, (_, index) => index + 1);
const browserLanguage = new Intl.DisplayNames(["es"], { type: "language" }).of(navigator.language.split("-")[0]) ?? "Espanol";

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function App() {
  const [selectedClientId, setSelectedClientId] = useState(clients[0].id);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(clients[0].accounts.map((account) => account.id));
  const [activePanel, setActivePanel] = useState<"dashboard" | "descubrimiento">("dashboard");
  const [translateArticles, setTranslateArticles] = useState(true);
  const [selectedTag, setSelectedTag] = useState("Todos");
  const [clientTags, setClientTags] = useState<Record<string, string[]>>(
    Object.fromEntries(clients.map((client) => [client.id, client.tags])),
  );
  const [newTag, setNewTag] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0];
  const tagsForClient = clientTags[selectedClient.id] ?? selectedClient.tags;
  const visibleAccounts = selectedClient.accounts.filter((account) => selectedAccountIds.includes(account.id));
  const totalReach = visibleAccounts.reduce((sum, account) => sum + account.reach, 0);
  const totalClicks = visibleAccounts.reduce((sum, account) => sum + account.clicks, 0);
  const totalSaves = visibleAccounts.reduce((sum, account) => sum + account.saves, 0);
  const totalPosts = visibleAccounts.reduce((sum, account) => sum + account.posts, 0);
  const avgEngagement = visibleAccounts.reduce((sum, account) => sum + account.engagement, 0) / Math.max(visibleAccounts.length, 1);
  const avgResponse = visibleAccounts.reduce((sum, account) => sum + account.responseRate, 0) / Math.max(visibleAccounts.length, 1);
  const avgGrowth = visibleAccounts.reduce((sum, account) => sum + account.growth, 0) / Math.max(visibleAccounts.length, 1);
  const clientPosts = scheduledPosts.filter((post) => post.clientId === selectedClient.id);
  const accountPosts = clientPosts.filter((post) => selectedAccountIds.includes(post.accountId));
  const filteredArticles = articles.filter((article) => {
    const belongsToClient = tagsForClient.includes(article.tag);
    return belongsToClient && (selectedTag === "Todos" || article.tag === selectedTag);
  });

  const bestAccount = useMemo(() => {
    return [...visibleAccounts].sort((a, b) => b.engagement * b.reach - a.engagement * a.reach)[0];
  }, [visibleAccounts]);

  const contentMix = useMemo(() => {
    const formats = ["Carrusel", "Video", "Post", "Articulo"];
    return formats.map((format) => ({
      format,
      count: clientPosts.filter((post) => post.format === format).length + (format === "Video" ? 4 : format === "Carrusel" ? 6 : 2),
    }));
  }, [clientPosts]);

  const missionProgress = Math.min(86, 48 + accountPosts.length * 12 + tagsForClient.length * 3);
  const conversionRate = totalReach > 0 ? (totalClicks / totalReach) * 100 : 0;

  function selectClient(clientId: string) {
    const nextClient = clients.find((client) => client.id === clientId) ?? clients[0];
    setSelectedClientId(clientId);
    setSelectedAccountIds(nextClient.accounts.map((account) => account.id));
    setSelectedTag("Todos");
    setAttachedFiles([]);
  }

  function toggleAccount(accountId: string) {
    setSelectedAccountIds((current) => {
      if (current.includes(accountId)) {
        return current.length === 1 ? current : current.filter((id) => id !== accountId);
      }
      return [...current, accountId];
    });
  }

  function addTopic(topic = newTag.trim()) {
    if (!topic) return;
    setClientTags((current) => {
      const currentTags = current[selectedClient.id] ?? [];
      if (currentTags.includes(topic)) return current;
      return { ...current, [selectedClient.id]: [...currentTags, topic] };
    });
    setSelectedTag(topic);
    setNewTag("");
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).map((file) => file.name);
    setAttachedFiles(files);
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

        <section className="game-card" aria-label="Progreso semanal">
          <div>
            <Trophy size={18} />
            <strong>Nivel 4</strong>
          </div>
          <div className="frog-mini" aria-label="Rana estratega">
            <FrogMascot compact />
            <strong>Rana estratega</strong>
          </div>
          <span>Estratega activo</span>
          <div className="progress-track">
            <i style={{ width: `${missionProgress}%` }} />
          </div>
          <small>{missionProgress}% de la mision semanal</small>
        </section>

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
          <div className="frog-hero" aria-label="Mascota rana de NewsBys">
            <FrogMascot />
            <span>
              <strong>Rana de guardia</strong>
              <small>Ideas frescas listas para saltar al calendario</small>
            </span>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar">
              <Search size={18} />
            </button>
            <button className="primary-button pulse-button" type="button">
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

        <section className="mission-strip" aria-label="Misiones">
          <article>
            <CheckCircle2 size={18} />
            <span>3 copies revisados</span>
          </article>
          <article>
            <Target size={18} />
            <span>2 huecos de calendario libres</span>
          </article>
          <article>
            <Flame size={18} />
            <span>Racha de 6 dias</span>
          </article>
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
                  <div className={`day-cell ${day === 8 ? "today" : ""} ${posts.length ? "has-posts" : ""}`} key={day}>
                    <span>{day}</span>
                    {posts.slice(0, 2).map((post) => {
                      const account = selectedClient.accounts.find((item) => item.id === post.accountId);
                      return (
                        <article className={`post-pill ${post.status.toLowerCase()}`} key={post.id}>
                          <small>{post.time}</small>
                          <strong>{post.title}</strong>
                          <em>{account?.network} - {post.format}</em>
                        </article>
                      );
                    })}
                    {posts.length > 2 ? <b>+{posts.length - 2}</b> : null}
                  </div>
                );
              })}
            </div>

            <div className="agenda-list">
              {accountPosts.map((post) => {
                const account = selectedClient.accounts.find((item) => item.id === post.accountId);
                return (
                  <article key={post.id} className="agenda-item">
                    <div>
                      <strong>{post.day}</strong>
                      <small>Jul</small>
                    </div>
                    <span>
                      <b>{post.title}</b>
                      <em>{post.time} - {account?.network} - {post.goal}</em>
                    </span>
                  </article>
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
                  <option key={account.id}>{account.network} - {account.handle}</option>
                ))}
              </select>
            </label>
            <label>
              Fecha y hora
              <input type="datetime-local" defaultValue="2026-07-08T09:30" />
            </label>
            <label>
              Formato
              <select>
                <option>Carrusel</option>
                <option>Video corto</option>
                <option>Post estatico</option>
                <option>Articulo LinkedIn</option>
              </select>
            </label>
            <label>
              Copy
              <textarea defaultValue="Idea de publicacion inspirada en las tendencias del cliente..." />
            </label>
            <label className="upload-drop">
              <input multiple type="file" accept="image/*,video/*,.pdf" onChange={handleFiles} />
              <UploadCloud size={20} />
              <span>Subir imagenes, videos o PDF</span>
              <small>{attachedFiles.length ? `${attachedFiles.length} archivo(s) listo(s)` : "Arrastra o selecciona creatividades"}</small>
            </label>
            {attachedFiles.length ? (
              <div className="file-list">
                {attachedFiles.map((file) => (
                  <span key={file}>
                    <Paperclip size={14} />
                    {file}
                  </span>
                ))}
              </div>
            ) : null}
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
            <div className="metric-card hero-metric">
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
              <span>Conversion a clic</span>
              <strong>{conversionRate.toFixed(1)}%</strong>
              <small><MousePointerClick size={14} /> {formatNumber(totalClicks)} clics registrados</small>
            </div>
            <div className="metric-card">
              <span>Guardados</span>
              <strong>{formatNumber(totalSaves)}</strong>
              <small><Award size={14} /> Contenido con valor reutilizable</small>
            </div>
            <div className="metric-card">
              <span>Respuesta comunidad</span>
              <strong>{avgResponse.toFixed(0)}%</strong>
              <small><Clock3 size={14} /> SLA social saludable</small>
            </div>
            <div className="metric-card">
              <span>Crecimiento audiencia</span>
              <strong>+{avgGrowth.toFixed(1)}%</strong>
              <small><Eye size={14} /> Media de cuentas seleccionadas</small>
            </div>

            <div className="insight-card content-mix">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">Mix editorial</p>
                  <h2>Formatos que alimentan la estrategia</h2>
                </div>
                <ImagePlus size={18} />
              </div>
              {contentMix.map((item) => (
                <div className="mix-row" key={item.format}>
                  <span>{item.format}</span>
                  <i style={{ width: `${Math.min(item.count * 9, 100)}%` }} />
                  <b>{item.count}</b>
                </div>
              ))}
            </div>

            <div className="insight-card recommendations">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">Recomendaciones</p>
                  <h2>Lectura rapida del CM</h2>
                </div>
                <Sparkles size={18} />
              </div>
              <ul>
                <li>Reforzar carruseles: generan mas guardados y senales de calidad.</li>
                <li>Publicar LinkedIn entre 10:00 y 12:00 para mejorar clics B2B.</li>
                <li>Convertir los comentarios frecuentes en piezas de descubrimiento.</li>
              </ul>
            </div>

            <div className="comparison-table">
              <div className="table-head">
                <span>Cuenta</span>
                <span>Audiencia</span>
                <span>Alcance</span>
                <span>Engagement</span>
                <span>Posts</span>
                <span>Score</span>
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
                  <span>{Math.round(account.engagement * 9 + account.responseRate / 2)}</span>
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
                    <option>Espanol</option>
                    <option>Ingles</option>
                    <option>Frances</option>
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

            <div className="topic-builder">
              <label>
                Tematicas del cliente
                <span>
                  <input value={newTag} onChange={(event) => setNewTag(event.target.value)} placeholder="Ej. social commerce" />
                  <button className="primary-button" type="button" onClick={() => addTopic()}>
                    <Plus size={16} />
                    Anadir
                  </button>
                </span>
              </label>
              <div className="suggested-topics">
                {suggestedTopics.map((topic) => (
                  <button key={topic} type="button" onClick={() => addTopic(topic)}>
                    <Sparkles size={14} />
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="tag-row">
              {["Todos", ...tagsForClient].map((tag) => (
                <button className={selectedTag === tag ? "active" : ""} key={tag} onClick={() => setSelectedTag(tag)} type="button">
                  {tag}
                </button>
              ))}
            </div>

            <div className="article-grid">
              {filteredArticles.length ? filteredArticles.map((article) => (
                <article className="article-card" key={article.id}>
                  <div>
                    <span>{article.source}</span>
                    <small>{article.language} - {article.freshness} - {article.readTime}</small>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{translateArticles ? article.translated : article.summary}</p>
                  <footer>
                    <em>{article.tag}</em>
                    <button type="button" onClick={() => setSelectedArticle(article)}>Leer articulo</button>
                  </footer>
                </article>
              )) : (
                <article className="empty-discovery">
                  <Lightbulb size={22} />
                  <h3>Radar preparando nuevas fuentes</h3>
                  <p>La tematica seleccionada queda guardada para futuras busquedas y recomendaciones.</p>
                </article>
              )}
            </div>
          </section>
        )}
      </section>

      {selectedArticle ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Articulo">
          <article className="article-modal">
            <button className="icon-button close-button" aria-label="Cerrar articulo" type="button" onClick={() => setSelectedArticle(null)}>
              <CloseIcon size={18} />
            </button>
            <span className="modal-source">{selectedArticle.source} - {selectedArticle.language} - {selectedArticle.readTime}</span>
            <h2>{selectedArticle.title}</h2>
            {(translateArticles ? [selectedArticle.translated, ...selectedArticle.body] : [selectedArticle.summary, ...selectedArticle.body]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="idea-box">
              <Sparkles size={18} />
              <span>{selectedArticle.idea}</span>
            </div>
            <button className="primary-button" type="button" onClick={() => setSelectedArticle(null)}>
              Crear idea desde articulo
            </button>
          </article>
        </div>
      ) : null}
    </main>
  );
}

function NetworkBadge({ network }: { network: Network }) {
  return <span className={`network-badge ${network.toLowerCase()}`}>{network.slice(0, 2)}</span>;
}

function FrogMascot({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`frog-mascot ${compact ? "compact" : ""}`} aria-hidden="true">
      <span className="frog-eye left" />
      <span className="frog-eye right" />
      <span className="frog-smile" />
    </span>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
