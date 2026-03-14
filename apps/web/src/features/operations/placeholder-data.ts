export type CustomerStage =
  | "new_lead"
  | "contacted"
  | "booked"
  | "active"
  | "inactive";

export type AppointmentStatus = "pending" | "confirmed" | "completed";

export type CustomerRecord = {
  id: string;
  name: string;
  stage: CustomerStage;
  ownerName: string;
  preferredLanguage: string;
  source: string;
  phone: string;
  email: string;
  neighborhood: string;
  tags: string[];
  lastActivityAt: string;
  lastMessage: string;
  recommendedAction: string;
  summary: string;
};

export type AppointmentRecord = {
  id: string;
  customerId: string;
  service: string;
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  staffName: string;
  channel: string;
  location: string;
  reminderReady: boolean;
  note: string;
};

export type TimelineEventRecord = {
  id: string;
  customerId: string;
  happenedAt: string;
  title: string;
  detail: string;
  kind: "message" | "appointment" | "review" | "task";
};

export const customerRecords: CustomerRecord[] = [
  {
    id: "emma-chen",
    name: "Emma Chen",
    stage: "new_lead",
    ownerName: "Mia",
    preferredLanguage: "English",
    source: "Website form",
    phone: "+86 138 1111 2201",
    email: "emma.chen@example.com",
    neighborhood: "Jing'an",
    tags: ["First visit", "Prefers SMS"],
    lastActivityAt: "2026-03-14T08:35:00+08:00",
    lastMessage:
      "Asked for Saturday availability and whether parking is easy near the studio.",
    recommendedAction: "Send two weekend appointment options and parking note.",
    summary:
      "Interested in a deep tissue session and ready to book if a weekend slot opens.",
  },
  {
    id: "li-wei",
    name: "Li Wei",
    stage: "booked",
    ownerName: "Aaron",
    preferredLanguage: "Chinese",
    source: "WeChat inbound",
    phone: "+86 139 2222 1188",
    email: "li.wei@example.com",
    neighborhood: "Pudong",
    tags: ["Returning", "WeChat"],
    lastActivityAt: "2026-03-14T09:12:00+08:00",
    lastMessage: "Confirmed the 2:00 PM scalp treatment and asked for floor access details.",
    recommendedAction: "Review reminder copy before the noon send window.",
    summary:
      "Returning customer with a confirmed treatment today and a high likelihood of rebooking.",
  },
  {
    id: "olivia-johnson",
    name: "Olivia Johnson",
    stage: "active",
    ownerName: "Mia",
    preferredLanguage: "English",
    source: "Referral",
    phone: "+86 137 3000 4432",
    email: "olivia.johnson@example.com",
    neighborhood: "Xuhui",
    tags: ["Membership", "Email follow-up"],
    lastActivityAt: "2026-03-13T17:20:00+08:00",
    lastMessage:
      "Left a positive note after yesterday's facial and asked about the April package.",
    recommendedAction: "Share package options and invite her to pre-book next month.",
    summary:
      "Strong repeat customer who is comparing upgrade packages after a completed visit.",
  },
  {
    id: "carlos-rivera",
    name: "Carlos Rivera",
    stage: "contacted",
    ownerName: "Nina",
    preferredLanguage: "English",
    source: "Google Maps",
    phone: "+86 136 4100 9008",
    email: "carlos.rivera@example.com",
    neighborhood: "Hongqiao",
    tags: ["Price sensitive"],
    lastActivityAt: "2026-03-12T16:05:00+08:00",
    lastMessage:
      "Asked about first-time pricing for a haircut and has not replied since the quote.",
    recommendedAction: "Follow up once with the entry package and availability window.",
    summary:
      "Warm lead that needs one lightweight follow-up before aging into inactive.",
  },
  {
    id: "sophie-martin",
    name: "Sophie Martin",
    stage: "inactive",
    ownerName: "Aaron",
    preferredLanguage: "French / English",
    source: "Instagram",
    phone: "+86 135 7000 1280",
    email: "sophie.martin@example.com",
    neighborhood: "Former French Concession",
    tags: ["Lapsed", "Review sent"],
    lastActivityAt: "2026-03-08T11:40:00+08:00",
    lastMessage:
      "Thanked the team for the manicure but has not engaged with the rebooking reminder.",
    recommendedAction: "Hold until the next campaign sync; no manual outreach needed today.",
    summary:
      "Recently completed a visit, received a review request, and is now in passive follow-up.",
  },
];

export const appointmentRecords: AppointmentRecord[] = [
  {
    id: "appt-1001",
    customerId: "emma-chen",
    service: "Deep tissue massage",
    startsAt: "2026-03-15T10:00:00+08:00",
    durationMinutes: 60,
    status: "pending",
    staffName: "Ava",
    channel: "Manual hold",
    location: "Jing'an studio",
    reminderReady: false,
    note: "Hold placed while the customer confirms parking details.",
  },
  {
    id: "appt-1002",
    customerId: "li-wei",
    service: "Scalp treatment",
    startsAt: "2026-03-14T14:00:00+08:00",
    durationMinutes: 45,
    status: "confirmed",
    staffName: "Leo",
    channel: "WeChat",
    location: "Pudong room 2",
    reminderReady: true,
    note: "Arrival instructions ready for manual approval.",
  },
  {
    id: "appt-1003",
    customerId: "carlos-rivera",
    service: "Haircut consultation",
    startsAt: "2026-03-16T18:30:00+08:00",
    durationMinutes: 30,
    status: "pending",
    staffName: "Nina",
    channel: "Phone",
    location: "Hongqiao salon",
    reminderReady: false,
    note: "Waiting on the customer to pick between two evening slots.",
  },
  {
    id: "appt-1004",
    customerId: "olivia-johnson",
    service: "Hydration facial",
    startsAt: "2026-03-13T16:00:00+08:00",
    durationMinutes: 75,
    status: "completed",
    staffName: "Ivy",
    channel: "Email",
    location: "Xuhui suite",
    reminderReady: false,
    note: "Completed successfully; package discussion pending.",
  },
  {
    id: "appt-1005",
    customerId: "sophie-martin",
    service: "Manicure",
    startsAt: "2026-03-08T10:30:00+08:00",
    durationMinutes: 50,
    status: "completed",
    staffName: "May",
    channel: "Instagram DM",
    location: "Jing'an studio",
    reminderReady: false,
    note: "Review request already sent.",
  },
  {
    id: "appt-1006",
    customerId: "olivia-johnson",
    service: "Package planning call",
    startsAt: "2026-03-20T11:00:00+08:00",
    durationMinutes: 20,
    status: "confirmed",
    staffName: "Mia",
    channel: "Email",
    location: "Remote",
    reminderReady: true,
    note: "Use the upsell checklist once backend workflow actions exist.",
  },
];

export const timelineEventRecords: TimelineEventRecord[] = [
  {
    id: "evt-101",
    customerId: "emma-chen",
    happenedAt: "2026-03-14T08:35:00+08:00",
    title: "Lead asked about weekend availability",
    detail: "Website form captured service intent plus parking concern.",
    kind: "message",
  },
  {
    id: "evt-102",
    customerId: "emma-chen",
    happenedAt: "2026-03-14T09:00:00+08:00",
    title: "Internal follow-up drafted",
    detail: "Operator prepared a reply with two Saturday options.",
    kind: "task",
  },
  {
    id: "evt-201",
    customerId: "li-wei",
    happenedAt: "2026-03-14T09:12:00+08:00",
    title: "Appointment confirmed",
    detail: "Customer accepted the 2:00 PM slot and asked about access.",
    kind: "appointment",
  },
  {
    id: "evt-202",
    customerId: "li-wei",
    happenedAt: "2026-03-14T09:30:00+08:00",
    title: "Reminder content ready",
    detail: "Reminder copy is staged for manual review before sending.",
    kind: "task",
  },
  {
    id: "evt-301",
    customerId: "olivia-johnson",
    happenedAt: "2026-03-13T17:20:00+08:00",
    title: "Positive post-visit note received",
    detail: "Customer mentioned interest in the April package.",
    kind: "review",
  },
  {
    id: "evt-302",
    customerId: "olivia-johnson",
    happenedAt: "2026-03-13T16:00:00+08:00",
    title: "Facial completed",
    detail: "Treatment completed without issues.",
    kind: "appointment",
  },
  {
    id: "evt-401",
    customerId: "carlos-rivera",
    happenedAt: "2026-03-12T16:05:00+08:00",
    title: "Quote sent",
    detail: "Pricing shared for the first-time haircut package.",
    kind: "message",
  },
  {
    id: "evt-402",
    customerId: "carlos-rivera",
    happenedAt: "2026-03-12T16:45:00+08:00",
    title: "Follow-up task queued",
    detail: "One manual follow-up remains before the lead goes cold.",
    kind: "task",
  },
  {
    id: "evt-501",
    customerId: "sophie-martin",
    happenedAt: "2026-03-08T11:40:00+08:00",
    title: "Review request sent",
    detail: "Manual request delivered after the manicure.",
    kind: "review",
  },
];
