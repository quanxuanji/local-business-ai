export type AuthSessionResponse = {
  sessionToken: string;
  issuedAt: string;
  expiresAt: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
    locale: string;
  };
  user: {
    id: string;
    workspaceId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type DashboardSummaryResponse = {
  workspaceId: string;
  timezone: string;
  locale: string;
  generatedAt: string;
  customers: {
    total: number;
    newLeads: number;
    active: number;
    booked: number;
  };
  appointments: {
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    canceled: number;
    upcoming: number;
    today: number;
  };
  messaging: {
    total: number;
    draft: number;
    sent: number;
    failed: number;
  };
  reviews: {
    total: number;
    requested: number;
    submitted: number;
    averageRating: number | null;
  };
  nextAppointment: {
    id: string;
    customerId: string;
    customerName: string;
    startsAt: string;
    status: string;
    serviceName: string | null;
  } | null;
  recentCustomers: Array<{
    id: string;
    fullName: string;
    status: string;
    createdAt: string;
  }>;
};

export type CustomerOwnerResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type CustomerResponse = {
  id: string;
  workspaceId: string;
  ownerId: string | null;
  firstName: string;
  lastName: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: string;
  preferredLanguage: string;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  owner: CustomerOwnerResponse | null;
  appointmentsCount: number;
};

export type CustomerListResponse = {
  items: CustomerResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    search: string | null;
    ownerId: string | null;
    status: string | null;
    sortBy: string;
    sortOrder: string;
  };
  summary: {
    total: number;
    returned: number;
    countsByStatus: Record<string, number>;
  };
};

export type AppointmentCustomerResponse = {
  id: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
};

export type AppointmentResponse = {
  id: string;
  workspaceId: string;
  customerId: string;
  startsAt: string;
  endsAt: string | null;
  status: string;
  serviceName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: AppointmentCustomerResponse;
};

export type MessageResponse = {
  id: string;
  workspaceId: string;
  customerId: string;
  appointmentId: string | null;
  channel: string;
  direction: string;
  status: string;
  subject: string | null;
  body: string;
  providerMessageId: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string | null;
    fullName: string;
    email: string | null;
    phone: string | null;
  };
};

export type WorkflowRuleResponse = {
  id: string;
  workspaceId: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  config: unknown;
  createdAt: string;
  updatedAt: string;
};

export type AiSummaryResponse = {
  summary: string;
  providerId: string;
};

export type AiRewriteResponse = {
  rewritten: string;
  providerId: string;
};

export type AiNextActionResponse = {
  suggestion: string;
  providerId: string;
};

export type AiLeadIntentResponse = {
  intent: string;
  confidence: string;
  providerId: string;
};

export type ReviewResponse = {
  id: string;
  workspaceId: string;
  customerId: string;
  appointmentId: string | null;
  status: string;
  channel: string;
  rating: number | null;
  comment: string | null;
  externalUrl: string | null;
  requestedAt: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string | null;
    fullName: string;
    email: string | null;
    phone: string | null;
  };
};
