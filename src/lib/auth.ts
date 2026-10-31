import { getLeads, type Lead } from "./site";

export type Role = "client" | "admin" | "staff";

export type ClientProfile = {
  id: string;
  createdAt: string;
  role: Role;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: string;
  medicalConditions: string;
  medications: string;
  allergies: string;
  pregnancy: string;
  goals: string;
  notes: string;
};

export type TreatmentRecord = {
  id: string;
  clientId: string;
  date: string;
  service: string;
  practitioner: string;
  clerk: string;
  area: string;
  notes: string;
  amount: number;
  status: "Completed" | "Scheduled" | "Cancelled";
};

const USERS_KEY = "meltaways.users.v1";
const SESSION_KEY = "meltaways.session.v1";
const TREATMENTS_KEY = "meltaways.treatments.v1";

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fb; } catch { return fb; }
}
function write<T>(k: string, v: T) { localStorage.setItem(k, JSON.stringify(v)); }

export function getUsers(): ClientProfile[] { return read<ClientProfile[]>(USERS_KEY, []); }
export function saveUsers(u: ClientProfile[]) { write(USERS_KEY, u); }

export function getSession(): ClientProfile | null { return read<ClientProfile | null>(SESSION_KEY, null); }
export function setSession(u: ClientProfile | null) {
  if (u) write(SESSION_KEY, u); else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("meltaways:auth"));
}

export function signUpClient(data: Partial<ClientProfile> & { email: string; password: string; fullName: string }): { ok: boolean; error?: string; user?: ClientProfile } {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const user: ClientProfile = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    role: "client",
    email: data.email, password: data.password, fullName: data.fullName,
    phone: data.phone || "", dob: data.dob || "", address: data.address || "",
    emergencyContact: data.emergencyContact || "",
    medicalConditions: data.medicalConditions || "",
    medications: data.medications || "", allergies: data.allergies || "",
    pregnancy: data.pregnancy || "", goals: data.goals || "", notes: data.notes || "",
  };
  saveUsers([user, ...users]);
  setSession(user);
  return { ok: true, user };
}

export function signIn(email: string, password: string, role: Role): { ok: boolean; error?: string } {
  // Demo admin accounts
  if (role === "admin" || role === "staff") {
    const ADMINS = [
      { email: "admin@meltaways.tt", password: "admin123", fullName: "Spa Admin", role: "admin" as Role },
      { email: "staff@meltaways.tt", password: "staff123", fullName: "Staff Member", role: "staff" as Role },
    ];
    const a = ADMINS.find(x => x.email === email.toLowerCase() && x.password === password && x.role === role);
    if (!a) return { ok: false, error: "Invalid staff credentials. Try admin@meltaways.tt / admin123" };
    const user: ClientProfile = {
      id: a.email, createdAt: new Date().toISOString(), role: a.role,
      email: a.email, password: "", fullName: a.fullName, phone: "", dob: "", address: "",
      emergencyContact: "", medicalConditions: "", medications: "", allergies: "",
      pregnancy: "", goals: "", notes: "",
    };
    setSession(user);
    return { ok: true };
  }
  const users = getUsers();
  const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) return { ok: false, error: "Email or password is incorrect." };
  setSession(u);
  return { ok: true };
}

export function signOut() { setSession(null); }

export function updateProfile(patch: Partial<ClientProfile>) {
  const s = getSession();
  if (!s) return;
  const users = getUsers().map(u => u.id === s.id ? { ...u, ...patch } : u);
  saveUsers(users);
  const updated = users.find(u => u.id === s.id)!;
  setSession(updated);
}

export function getTreatments(): TreatmentRecord[] { return read<TreatmentRecord[]>(TREATMENTS_KEY, demoTreatments()); }
export function saveTreatments(t: TreatmentRecord[]) { write(TREATMENTS_KEY, t); }

function demoTreatments(): TreatmentRecord[] {
  const today = new Date();
  const d = (offset: number) => new Date(today.getTime() - offset * 86400000).toISOString().slice(0, 10);
  return [
    { id: "t1", clientId: "demo", date: d(2), service: "Cavitation", practitioner: "Nadia P.", clerk: "Renee K.", area: "Abdomen", notes: "Session 2 of 6. Tolerated well.", amount: 650, status: "Completed" },
    { id: "t2", clientId: "demo", date: d(9), service: "Skin Tightening", practitioner: "Aisha M.", clerk: "Renee K.", area: "Thighs", notes: "Session 1 of 4.", amount: 800, status: "Completed" },
    { id: "t3", clientId: "demo", date: d(0), service: "Lymphatic Drainage", practitioner: "Nadia P.", clerk: "Devon S.", area: "Full body", notes: "Post-treatment recovery.", amount: 450, status: "Completed" },
    { id: "t4", clientId: "demo", date: d(-3), service: "Body Contouring", practitioner: "Aisha M.", clerk: "Renee K.", area: "Waist", notes: "Follow-up scheduled.", amount: 900, status: "Scheduled" },
  ];
}

export function clientTreatments(clientId: string, allLeads: Lead[] = getLeads()): TreatmentRecord[] {
  // Mock: return demo treatments for any signed-in client so the UI is populated.
  void allLeads;
  return getTreatments().map(t => ({ ...t, clientId }));
}
