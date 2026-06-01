import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, DollarSign, CalendarClock, BarChart3, Plane } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { api, fmtUSD } from "@/lib/api";
import { ADMIN } from "@/constants/testIds";

const STATUS_STYLES = {
  pending:   "bg-[#2A2216] text-[#D6A24A] border border-[#8F6E3E]",
  confirmed: "bg-[#0E1F18] text-[#2FBF8F] border border-[#1E6B52]",
  completed: "bg-white/5 text-[#C9D0DB] border border-[#2A3342]",
  cancelled: "bg-[#241214] text-[#E05D5D] border border-[#7A2E35]",
};
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, b] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/bookings" + (filter !== "all" ? `?status=${filter}` : "")),
      ]);
      setStats(s.data);
      setBookings(b.data.items || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("bb_admin_token");
        nav("/admin/login");
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("bb_admin_token")) { nav("/admin/login"); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (conf, status) => {
    try {
      await api.patch(`/admin/bookings/${conf}/status`, { status });
      toast.success(`Updated ${conf} → ${status}`);
      load();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("bb_admin_token");
    nav("/admin/login");
  };

  const KPIS = [
    { label: "Revenue (all)", value: fmtUSD(stats?.revenue || 0), icon: DollarSign, testid: ADMIN.revenueKpi },
    { label: "Bookings", value: stats?.total_bookings ?? 0, icon: BarChart3, testid: ADMIN.bookingsKpi },
    { label: "Average fare", value: fmtUSD(stats?.avg_fare || 0), icon: DollarSign, testid: ADMIN.avgFareKpi },
    { label: "Upcoming pickups", value: stats?.upcoming ?? 0, icon: CalendarClock, testid: ADMIN.upcomingKpi },
  ];

  return (
    <main className="min-h-screen bg-[#07080A]">
      <header className="sticky top-0 z-40 border-b border-[#232A36] bg-[#07080A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md border border-[#3A465B] bg-[#0F1216] flex items-center justify-center">
              <span className="font-serif text-[#B08D57] text-base">BB</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif text-[14px] text-[#E7EBF2]">Bishnu · Admin</div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-[#9AA3B2]">Operations</div>
            </div>
          </div>
          <button onClick={logout}
                  className="btn-lux-secondary inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm"
                  data-testid={ADMIN.logoutBtn}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="lux-kicker">Dashboard</div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#E7EBF2] mt-2">Today's road, at a glance</h1>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="card-lux chrome-rule p-5" data-testid={k.testid}>
                <div className="flex items-center justify-between">
                  <div className="lux-kicker">{k.label}</div>
                  <Icon size={18} className="text-[#B08D57]" />
                </div>
                <div className="font-serif text-3xl text-[#E7EBF2] mt-3">{k.value}</div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="mt-6 card-lux chrome-rule p-6" data-testid={ADMIN.revenueChart}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="lux-kicker">Revenue (last 14 days)</div>
              <div className="font-serif text-xl text-[#E7EBF2] mt-1">Trend</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue_series || []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B08D57" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#B08D57" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#232A36" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="date" stroke="#9AA3B2" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9AA3B2" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0F1216", border: "1px solid #2A3342", color: "#E7EBF2" }}
                         formatter={(v) => fmtUSD(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#B08D57" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings table */}
        <div className="mt-6 card-lux chrome-rule overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-wrap gap-3 items-center justify-between border-b border-[#232A36]">
            <div>
              <div className="lux-kicker">Bookings</div>
              <div className="font-serif text-xl text-[#E7EBF2] mt-1">{bookings.length} record{bookings.length === 1 ? "" : "s"}</div>
            </div>
            <div className="flex gap-2">
              {["all", ...STATUSES].map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs border ${filter === s ? "border-[#B08D57] text-[#B08D57] bg-[#2A2216]" : "border-[#2A3342] text-[#C9D0DB] hover:border-[#3A465B]"}`}
                  data-testid={`admin-filter-${s}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid={ADMIN.bookingsTable}>
              <thead>
                <tr className="text-left text-[#9AA3B2]">
                  <th className="px-5 py-3 font-normal">Conf #</th>
                  <th className="px-5 py-3 font-normal">When</th>
                  <th className="px-5 py-3 font-normal">Client</th>
                  <th className="px-5 py-3 font-normal">Route</th>
                  <th className="px-5 py-3 font-normal">Service</th>
                  <th className="px-5 py-3 font-normal">Total</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-[#9AA3B2]">Loading...</td></tr>
                )}
                {!loading && bookings.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-[#9AA3B2]">No bookings yet.</td></tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.confirmation} className="border-t border-[#232A36] hover:bg-white/[0.025]">
                    <td className="px-5 py-4">
                      <div className="font-mono text-[#B08D57]">{b.confirmation}</div>
                      <div className="text-xs text-[#9AA3B2]">{b.vehicle}</div>
                    </td>
                    <td className="px-5 py-4 text-[#C9D0DB] text-xs">
                      {new Date(b.pickup_time).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#E7EBF2]">{b.customer?.name}</div>
                      <div className="text-xs text-[#9AA3B2]">{b.customer?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-[#C9D0DB] text-xs max-w-[240px]">
                      <div className="truncate">{b.pickup?.address}</div>
                      <div className="truncate text-[#9AA3B2]">→ {b.dropoff?.address || "Open"}</div>
                    </td>
                    <td className="px-5 py-4 text-[#C9D0DB] capitalize">{b.service_type}</td>
                    <td className="px-5 py-4 font-mono text-[#E7EBF2]">{fmtUSD(b.quote?.total || 0)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.confirmation, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}
                        data-testid={ADMIN.statusSelect(b.confirmation)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
