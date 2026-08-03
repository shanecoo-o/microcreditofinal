import {
  Banknote,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Coins,
  Download,
  FileSignature,
  FileText,
  Gauge,
  HandCoins,
  LayoutDashboard,
  LayoutGrid,
  PhoneCall,
  Receipt,
  RefreshCcw,
  Scale,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCircle2,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";

type IconType = React.ComponentType<{ className?: string }>;

/** Ícone por rota do backoffice e portal. */
export const NAV_ICONS: Record<string, IconType> = {
  default: FileText,

  "/app/admin/dashboard": BarChart3,
  "/app/admin/operations": LayoutGrid,
  "/app/admin/loan-requests": ClipboardList,
  "/app/admin/appointments": CalendarClock,
  "/app/admin/clients": UsersRound,
  "/app/admin/analyses": Gauge,
  "/app/admin/approvals": ClipboardCheck,

  "/app/admin/loans": HandCoins,
  "/app/admin/guarantees": ShieldCheck,
  "/app/admin/guarantors": Users,
  "/app/admin/contracts": FileSignature,

  "/app/admin/disbursements": Banknote,
  "/app/admin/payments": Receipt,
  "/app/admin/installments": Coins,
  "/app/admin/reconciliation": Scale,
  "/app/admin/collections": PhoneCall,
  "/app/admin/restructurings": RefreshCcw,

  "/app/admin/reports": BarChart3,
  "/app/admin/exports": Download,

  "/app/admin/users": Users,
  "/app/admin/roles": ShieldCheck,
  "/app/admin/products": ClipboardList,
  "/app/admin/branches": Building2,
  "/app/admin/settings": Settings,
  "/app/admin/audit": ScrollText,

  "/app/dashboard": LayoutDashboard,
  "/app/loans": HandCoins,
  "/app/wallet": Wallet,
  "/app/transactions": Receipt,
  "/app/notifications": Bell,
  "/app/profile": UserCircle2,
};
