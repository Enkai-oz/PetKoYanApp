import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react"

type Screen = "cover" | "loading" | "auth" | "app"
type AppView = "dashboard" | "passport" | "supplies" | "directory" | "account"

const Icon = ({ name, size = 20 }: { name: string size?: number }) => {
  const paths: Record<string, ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    paw: (
      <>
        <ellipse cx="8" cy="7" rx="2.3" ry="3" />
        <ellipse cx="16" cy="7" rx="2.3" ry="3" />
        <ellipse cx="4.5" cy="12" rx="2" ry="2.7" />
        <ellipse cx="19.5" cy="12" rx="2" ry="2.7" />
        <path d="M7 18c0-3 2.2-5 5-5s5 2 5 5c0 2-1.8 3-5 3s-5-1-5-3Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.6-5 3-7 8-7s7.4 2 8 7" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4.5-1L19 8.5 15.5 5 5 15.5 4 20Z" />
        <path d="m13.8 6.7 3.5 3.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 5.7c-2.5-2.7-6.6-1.5-8.8 1.2-2.2-2.7-6.3-3.9-8.8-1.2C.2 9 2.3 14.2 12 21c9.7-6.8 11.8-12 8.8-15.3Z" />
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    passport: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <circle cx="12" cy="11" r="3" />
        <path d="M9 11h6M12 8v6" />
      </>
    ),
  }
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}) => (
  <button className={`button ${className}`} onClick={onClick} type={type}>
    {children}
  </button>
)

const Logo = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={`logo ${compact ? "logo-compact" : ""}`}
    aria-label="PetKoYan!"
  >
    <span>PetKo</span>
    <span>‘Yan!</span>
  </div>
)

const Cloud = ({ className = "" }: { className?: string }) => (
  <div className={`cloud ${className}`} />
)

const Cover = ({ onOpen }: { onOpen: () => void }) => (
  <main className="cover swirl-bg">
    <Cloud className="cloud-tl" />
    <Cloud className="cloud-tr" />
    <Cloud className="cloud-bl" />
    <Cloud className="cloud-br" />
    <div className="cover-content">
      <span className="eyebrow">A tiny journal for very big love</span>
      <Logo />
      <p>Health notes, happy places, and everything your best friend needs.</p>
      <Button className="sticker-button" onClick={onOpen}>
        <span>Open Journal</span>
        <span className="book-mark" aria-hidden="true">
          ▤
        </span>
      </Button>
    </div>
    <span className="floating-sticker sticker-one">
      <Icon name="paw" size={28} />
    </span>
    <span className="floating-sticker sticker-two">Best friend</span>
    <span className="cover-note">Made for pet parents</span>
  </main>
)

const Loading = ({ progress }: { progress: number }) => (
  <main className="loading-page peach-swirl">
    <div className="loading-cloud">
      <span className="mini-paw paw-a">
        <Icon name="paw" size={24} />
      </span>
      <span className="mini-paw paw-b">
        <Icon name="paw" size={18} />
      </span>
      <img
        src="/assets/petko-dog.gif"
        alt="A playful orange dog wagging its tail"
      />
      <Logo compact />
      <p>Loading your pet journal...</p>
      <div className="progress-track" aria-label={`Loading ${progress}%`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-label">{progress}%</span>
    </div>
  </main>
)

const Auth = ({ onSubmit }: { onSubmit: (username: string) => void }) => {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [username, setUsername] = useState("mika.pets")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(username)
  }
  return (
    <main className="auth-page swirl-bg">
      <div className="auth-shell">
        <section className="auth-intro">
          <Logo />
          <h2>One journal for every kind of pet.</h2>
          <div className="auth-dog-sticker">
            <img src="/assets/default-pet.svg" alt="PetKoYan pet mascot" />
          </div>
          <span className="tape tape-teal">Welcome, pet parent!</span>
        </section>
        <section className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Authentication">
            <Button
              className={tab === "login" ? "active" : ""}
              onClick={() => setTab("login")}
            >
              Log In
            </Button>
            <Button
              className={tab === "signup" ? "active" : ""}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </Button>
          </div>
          <div className="auth-heading">
            <span className="paw-seal">
              <Icon name="paw" />
            </span>
            <div>
              <span className="kicker">
                {tab === "login" ? "Account access" : "New account"}
              </span>
              <h3>{tab === "login" ? "Log in" : "Create account"}</h3>
            </div>
          </div>
          <form onSubmit={submit}>
            {tab === "signup" && (
              <label className="field">
                <span>Owner name</span>
                <span className="input-wrap">
                  <Icon name="user" />
                  <input defaultValue="Mika Santos" placeholder="Your name" />
                </span>
              </label>
            )}
            <label className="field">
              <span>Username</span>
              <span className="input-wrap">
                <Icon name="user" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </span>
            </label>
            <label className="field">
              <span>Email address</span>
              <span className="input-wrap">
                <Icon name="mail" />
                <input
                  type="email"
                  defaultValue="mika@petmail.ph"
                  placeholder="you@example.com"
                />
              </span>
            </label>
            <label className="field">
              <span>Password</span>
              <span className="input-wrap">
                <Icon name="lock" />
                <input
                  type="password"
                  defaultValue="petkoyan"
                  placeholder="At least 8 characters"
                />
              </span>
            </label>
            <div className="auth-options">
              <label>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <button type="button" className="text-button">
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="primary-cta">
              {tab === "login"
                ? `Log In as @${username || "username"}`
                : `Create @${username || "username"}`}{" "}
              <Icon name="paw" />
            </Button>
          </form>
          <div className="divider">
            <span>or continue with</span>
          </div>
          <div className="social-row">
            <Button className="social">
              <strong>G</strong> Google
            </Button>
            <Button className="social">
              <strong>f</strong> Facebook
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}

const Calendar = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = Array.from({ length: 35 }, (_, i) => i - 3)
  return (
    <section className="paper-card calendar-card">
      <div className="calendar-top">
        <span className="month-tag">2026</span>
        <div>
          <span>October</span>
          <small>care calendar</small>
        </div>
        <Icon name="calendar" />
      </div>
      <div className="calendar-grid">
        {days.map((day, i) => (
          <b key={`${day}-${i}`}>{day}</b>
        ))}
        {dates.map((date, i) => (
          <span
            className={
              date === 14
                ? "selected-day"
                : date < 1 || date > 31
                  ? "muted-day"
                  : ""
            }
            key={i}
          >
            {date > 0 && date < 32 ? date : ""}
          </span>
        ))}
      </div>
      <div className="calendar-note">
        <span /> Oct 14 · Grooming at 2:30 PM
      </div>
    </section>
  )
}

const VaccineRecord = () => (
  <section className="paper-card vaccine-card">
    <div className="section-title">
      <div>
        <span className="kicker">health notes</span>
        <h3>Vaccination Record</h3>
      </div>
      <span className="round-icon">
        <Icon name="heart" />
      </span>
    </div>
    <div className="vaccine-list">
      <div>
        <span className="vax-icon">R</span>
        <p>
          <strong>Anti-Rabies</strong>
          <small>Apr 01, 2026 · Dr. Cruz</small>
        </p>
        <span className="status completed">Completed</span>
      </div>
      <div>
        <span className="vax-icon teal">5</span>
        <p>
          <strong>5-in-1 Booster</strong>
          <small>Oct 18, 2026 · PawCare</small>
        </p>
        <span className="status upcoming">Upcoming</span>
      </div>
      <div>
        <span className="vax-icon yellow">K</span>
        <p>
          <strong>Kennel Cough</strong>
          <small>Dec 04, 2026 · PawCare</small>
        </p>
        <span className="status upcoming">Upcoming</span>
      </div>
    </div>
    <Button className="outline-button">View all medical notes</Button>
  </section>
)

type PassportProps = {
  petName: string
  setPetName: (name: string) => void
  owner: string
  setOwner: (name: string) => void
  petPhoto: string
  setPetPhoto: (photo: string) => void
}

const Passport = ({
  petName,
  setPetName,
  owner,
  setOwner,
  petPhoto,
  setPetPhoto,
}: PassportProps) => {
  const [editing, setEditing] = useState(false)
  const uploadPetPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setPetPhoto(URL.createObjectURL(file))
  }
  return (
    <div className="dashboard-grid">
      <section className="passport-column">
        <div className="page-heading">
          <div>
            <span className="kicker light">pet passport · PH 0426</span>
            <h1>Hello, {owner.split(" ")[0]}!</h1>
          </div>
          <span className="date-stamp">
            MON
            <br />
            <strong>12</strong>
            <br />
            OCT
          </span>
        </div>
        <article className="passport-card">
          <span className="paw-clip">
            <Icon name="paw" size={34} />
          </span>
          <span className="tape tape-coral">VERY GOOD PET</span>
          <div className="photo-side">
            <div className="polaroid">
              <img src={petPhoto} alt={`${petName}'s profile`} />
              <label className="photo-upload">
                <Icon name="edit" size={16} />
                Change photo
                <input type="file" accept="image/*" onChange={uploadPetPhoto} />
              </label>
            </div>
            <div className="adoption-stamp">
              <Icon name="heart" />
              <span>
                Adopted
                <br />
                <strong>04 · 01 · 25</strong>
              </span>
            </div>
          </div>
          <div className="pet-details">
            <span className="micro-label">OFFICIAL PET PASSPORT</span>
            {editing ? (
              <div className="editing-fields">
                <label>
                  Pet name
                  <input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                  />
                </label>
                <label>
                  Owner
                  <input
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                </label>
              </div>
            ) : (
              <>
                <h2>
                  {petName}
                  <span>she/her</span>
                </h2>
                <p className="subtitle">Chief snack inspector</p>
              </>
            )}
            <div className="detail-grid">
              <div>
                <span>Birthday</span>
                <strong>July 28, 2023</strong>
              </div>
              <div>
                <span>Breed</span>
                <strong>Shiba mix</strong>
              </div>
              <div>
                <span>Pet parent</span>
                <strong className="editable-value">
                  {owner}
                  <button
                    type="button"
                    className="inline-edit"
                    onClick={() => setEditing(true)}
                    aria-label="Edit owner name"
                  >
                    <Icon name="edit" size={13} />
                  </button>
                </strong>
              </div>
              <div>
                <span>Current weight</span>
                <strong>
                  9.4 kg <small>+0.2</small>
                </strong>
              </div>
            </div>
            <div className="allergies">
              <span>Allergy watch</span>
              <div>
                <em>Chicken</em>
                <em>Dust mites</em>
                <em className="safe">No medication</em>
              </div>
            </div>
            <div className="weight-line">
              <span>Weight journey</span>
              <div>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <small>8.8 kg — 9.4 kg</small>
            </div>
            <Button
              className="edit-button"
              onClick={() => setEditing(!editing)}
            >
              <Icon name={editing ? "check" : "edit"} />{" "}
              {editing ? "Save Pet Details" : "Edit Pet Details"}
            </Button>
          </div>
        </article>
      </section>
      <aside className="right-column">
        <Calendar />
        <VaccineRecord />
      </aside>
    </div>
  )
}

type Supply = {
  id: number
  name: string
  note: string
  checked: boolean
  color: string
}
const initialSupplies: Supply[] = [
  {
    id: 1,
    name: "Salmon kibble",
    note: "2 kg bag · low stock",
    checked: false,
    color: "coral",
  },
  {
    id: 2,
    name: "Dental chews",
    note: "Chicken-free, please",
    checked: true,
    color: "sage",
  },
  {
    id: 3,
    name: "Poop bags",
    note: "Lavender · 4 rolls",
    checked: false,
    color: "teal",
  },
  {
    id: 4,
    name: "Paw balm",
    note: "For tiny dry toe beans",
    checked: true,
    color: "yellow",
  },
]

type SuppliesProps = {
  items: Supply[]
  setItems: Dispatch<SetStateAction<Supply[]>>
  petName: string
}

const Supplies = ({ items, setItems, petName }: SuppliesProps) => {
  const [newItem, setNewItem] = useState("")
  const addItem = () => {
    if (!newItem.trim()) return
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItem,
        note: "Just added to the list",
        checked: false,
        color: "coral",
      },
    ])
    setNewItem("")
  }
  const toggle = (id: number) =>
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    )
  return (
    <div className="feature-page">
      <div className="feature-heading">
        <h1>Supply Checklist</h1>
      </div>
      <div className="supplies-layout">
        <section className="shopping-note">
          <span className="note-tape" />
          <div className="note-title">
            <div>
              <span>Today’s list</span>
              <h2>{petName}’s Supply List</h2>
            </div>
            <span className="list-count">
              {items.filter((i) => i.checked).length}/{items.length}
            </span>
          </div>
          <div className="supply-list">
            {items.map((item) => (
              <button
                className={`supply-item ${item.checked ? "checked" : ""}`}
                key={item.id}
                onClick={() => toggle(item.id)}
              >
                <span className={`check-pill ${item.color}`}>
                  <Icon name={item.checked ? "check" : "plus"} />
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.note}</small>
                </span>
                <span className="supply-status">
                  {item.checked ? "packed" : "to buy"}
                </span>
              </button>
            ))}
          </div>
          <div className="add-item-row">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Add a new supply..."
            />
            <Button onClick={addItem}>
              <Icon name="plus" /> Add Item
            </Button>
          </div>
        </section>
        <aside className="supply-summary">
          <div className="basket-icon">
            <Icon name="bag" size={42} />
          </div>
          <h3>{items.filter((i) => !i.checked).length} items left</h3>
          <div className="mini-progress">
            <span
              style={{
                width: `${(items.filter((i) => i.checked).length / items.length) * 100}%`,
              }}
            />
          </div>
          <div className="tip-card">
            <strong>Allergy reminder</strong>
            <p>Avoid products containing chicken.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

const venues = [
  {
    type: "Emergency Vet",
    name: "PawCare Animal Clinic",
    distance: "0.8 km",
    info: "Open all day · Walk-ins welcome",
    status: "24/7 Open",
    icon: "heart",
    color: "sage",
  },
  {
    type: "Pet-friendly Café",
    name: "Barkada Brew",
    distance: "1.2 km",
    info: "Outdoor seating · Water bowls",
    status: "Pet-Friendly",
    icon: "paw",
    color: "yellow",
  },
  {
    type: "Grooming Salon",
    name: "Fluff & Fold",
    distance: "2.4 km",
    info: "Open until 7 PM · Booking required",
    status: "Open Today",
    icon: "edit",
    color: "coral",
  },
  {
    type: "Weekend Park",
    name: "Ayala Triangle Gardens",
    distance: "3.1 km",
    info: "Leash required · Wide green lawn",
    status: "Pet-Friendly",
    icon: "location",
    color: "teal",
  },
]

const Directory = () => (
  <div className="feature-page">
    <div className="directory-heading">
      <div>
        <h1>Pet-friendly Places</h1>
      </div>
      <div className="directory-search">
        <Icon name="search" />
        <input placeholder="Search clinics, parks, cafés..." />
      </div>
    </div>
    <div className="directory-layout">
      <section className="venue-grid">
        {venues.map((venue, i) => (
          <article className="venue-card" key={venue.name}>
            <div className={`venue-illustration ${venue.color}`}>
              <span className="venue-number">0{i + 1}</span>
              <Icon name={venue.icon} size={46} />
              <span className="doodle-dots">· · ·</span>
            </div>
            <div className="venue-body">
              <div className="venue-meta">
                <span>{venue.type}</span>
                <span>{venue.distance}</span>
              </div>
              <h3>{venue.name}</h3>
              <p>{venue.info}</p>
              <div>
                <span
                  className={`status ${
                    venue.status === "24/7 Open" ? "completed" : "upcoming"
                  }`}
                >
                  {venue.status}
                </span>
                <Button className="circle-button">
                  <Icon name="location" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <aside className="map-card">
        <div className="map-lines" />
        <span className="map-pin pin-one">
          <Icon name="paw" />
        </span>
        <span className="map-pin pin-two">
          <Icon name="heart" />
        </span>
        <span className="map-pin pin-three">
          <Icon name="location" />
        </span>
        <div className="map-label">
          <strong>Makati</strong>
          <span>4 places nearby</span>
        </div>
      </aside>
    </div>
  </div>
)

type AccountProps = {
  owner: string
  setOwner: (name: string) => void
  username: string
  setUsername: (name: string) => void
  ownerPhoto: string
  setOwnerPhoto: (photo: string) => void
}

const Account = ({
  owner,
  setOwner,
  username,
  setUsername,
  ownerPhoto,
  setOwnerPhoto,
}: AccountProps) => {
  const uploadOwnerPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setOwnerPhoto(URL.createObjectURL(file))
  }
  return (
    <div className="account-page">
      <div className="feature-heading">
        <h1>Account</h1>
      </div>
      <section className="account-card">
        <div className="account-photo">
          <img src={ownerPhoto} alt={`${owner}'s profile`} />
          <label className="photo-upload">
            <Icon name="edit" size={16} />
            Change photo
            <input type="file" accept="image/*" onChange={uploadOwnerPhoto} />
          </label>
        </div>
        <div className="account-fields">
          <span className="kicker">Pet parent information</span>
          <h2>{owner}</h2>
          <label className="field">
            <span>Owner name</span>
            <span className="input-wrap">
              <Icon name="user" />
              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
              />
            </span>
          </label>
          <label className="field">
            <span>Username</span>
            <span className="input-wrap">
              <Icon name="paw" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </span>
          </label>
          <label className="field">
            <span>Email address</span>
            <span className="input-wrap">
              <Icon name="mail" />
              <input defaultValue="mika@petmail.ph" type="email" />
            </span>
          </label>
          <Button className="primary-cta">
            <Icon name="check" /> Save account
          </Button>
        </div>
      </section>
    </div>
  )
}

type DashboardProps = {
  setView: (view: AppView) => void
  petName: string
  petPhoto: string
  items: Supply[]
}

const Dashboard = ({ setView, petName, petPhoto, items }: DashboardProps) => (
  <div className="overview-page">
    <div className="feature-heading">
      <h1>Dashboard</h1>
    </div>
    <div className="overview-grid">
      <button className="overview-passport" onClick={() => setView("passport")}>
        <span className="paw-clip">
          <Icon name="paw" size={30} />
        </span>
        <img src={petPhoto} alt={`${petName}'s profile`} />
        <div>
          <span className="kicker">Pet Passport</span>
          <h2>{petName}</h2>
          <dl>
            <div>
              <dt>Breed</dt>
              <dd>Shiba mix</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>9.4 kg</dd>
            </div>
            <div>
              <dt>Allergies</dt>
              <dd>Chicken</dd>
            </div>
          </dl>
          <span className="open-link">Open Pet Passport →</span>
        </div>
      </button>
      <Calendar />
      <button
        className="overview-supplies paper-card"
        onClick={() => setView("supplies")}
      >
        <span className="round-icon">
          <Icon name="bag" />
        </span>
        <div>
          <span className="kicker">Supply List</span>
          <h3>{items.filter((item) => !item.checked).length} items left</h3>
          <div className="overview-list">
            {items.slice(0, 3).map((item) => (
              <span key={item.id}>
                <Icon name={item.checked ? "check" : "plus"} size={15} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </button>
      <VaccineRecord />
    </div>
  </div>
)

const AppShell = ({
  initialUsername,
  onLogout,
}: {
  initialUsername: string
  onLogout: () => void
}) => {
  const [view, setView] = useState<AppView>("dashboard")
  const [username, setUsername] = useState(initialUsername)
  const [owner, setOwner] = useState("Mika Santos")
  const [petName, setPetName] = useState("Mochi")
  const [petPhoto, setPetPhoto] = useState("/assets/default-pet.svg")
  const [ownerPhoto, setOwnerPhoto] = useState("/assets/default-owner.svg")
  const [items, setItems] = useState(initialSupplies)
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "heart" },
    { id: "passport", label: "Pet Passport", icon: "passport" },
    { id: "supplies", label: "Supply List", icon: "bag" },
    { id: "directory", label: "Directory", icon: "location" },
    { id: "account", label: "Account", icon: "user" },
  ] as const
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Logo compact />
        <nav>
          <span className="nav-label">MY JOURNAL</span>
          {nav.map((item) => (
            <Button
              className={view === item.id ? "active" : ""}
              onClick={() => setView(item.id)}
              key={item.id}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="mini-paw">
            <Icon name="paw" />
          </span>
          <strong>All caught up!</strong>
          <p>{petName}’s records are up to date.</p>
        </div>
        <Button className="logout" onClick={onLogout}>
          Log out
        </Button>
      </aside>
      <section className="main-panel">
        <header className="topbar">
          <div className="global-search">
            <Icon name="search" />
            <input
              aria-label="Search journal"
              placeholder="Search Mochi’s journal..."
            />
            <Button>
              <Icon name="close" size={17} />
            </Button>
          </div>
          <div className="profile-badge">
            <img src={ownerPhoto} alt={`${owner}'s profile`} />
            <div>
              <span>Pet parent</span>
              <strong>@{username}</strong>
            </div>
            <span className="online-dot" />
          </div>
        </header>
        <div className="content-area">
          {view === "dashboard" && (
            <Dashboard
              setView={setView}
              petName={petName}
              petPhoto={petPhoto}
              items={items}
            />
          )}
          {view === "passport" && (
            <Passport
              petName={petName}
              setPetName={setPetName}
              owner={owner}
              setOwner={setOwner}
              petPhoto={petPhoto}
              setPetPhoto={setPetPhoto}
            />
          )}
          {view === "supplies" && (
            <Supplies items={items} setItems={setItems} petName={petName} />
          )}
          {view === "directory" && <Directory />}
          {view === "account" && (
            <Account
              owner={owner}
              setOwner={setOwner}
              username={username}
              setUsername={setUsername}
              ownerPhoto={ownerPhoto}
              setOwnerPhoto={setOwnerPhoto}
            />
          )}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("cover")
  const [progress, setProgress] = useState(0)
  const [username, setUsername] = useState("mika.pets")
  useEffect(() => {
    if (screen !== "loading") return
    const timer = window.setInterval(
      () =>
        setProgress((value) => {
          if (value >= 100) {
            window.clearInterval(timer)
            window.setTimeout(() => setScreen("auth"), 350)
            return 100
          }
          return Math.min(100, value + 4)
        }),
      70,
    )
    return () => window.clearInterval(timer)
  }, [screen])
  return screen === "cover" ? (
    <Cover onOpen={() => setScreen("loading")} />
  ) : screen === "loading" ? (
    <Loading progress={progress} />
  ) : screen === "auth" ? (
    <Auth
      onSubmit={(newUsername) => {
        setUsername(newUsername)
        setScreen("app")
      }}
    />
  ) : (
    <AppShell initialUsername={username} onLogout={() => setScreen("auth")} />
  )
}
