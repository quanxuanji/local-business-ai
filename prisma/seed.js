const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "downtown-dental" },
    update: {
      name: "Downtown Dental",
      timezone: "America/Los_Angeles",
      locale: "en",
    },
    create: {
      id: "ws_downtown_dental",
      name: "Downtown Dental",
      slug: "downtown-dental",
      timezone: "America/Los_Angeles",
      locale: "en",
    },
  });

  const owner = await prisma.user.upsert({
    where: {
      workspaceId_email: {
        workspaceId: workspace.id,
        email: "owner@downtowndental.test",
      },
    },
    update: {
      name: "Maya Chen",
      role: "owner",
    },
    create: {
      id: "user_owner_maya_chen",
      workspaceId: workspace.id,
      email: "owner@downtowndental.test",
      name: "Maya Chen",
      role: "owner",
    },
  });

  const customers = [
    {
      id: "cust_sophia_lee",
      firstName: "Sophia",
      lastName: "Lee",
      email: "sophia.lee@example.com",
      phone: "+14155550101",
      status: "NEW_LEAD",
      preferredLanguage: "EN",
      source: "website_form",
      notes: "Requested first-time cleaning appointment.",
    },
    {
      id: "cust_daniel_kim",
      firstName: "Daniel",
      lastName: "Kim",
      email: "daniel.kim@example.com",
      phone: "+14155550102",
      status: "BOOKED",
      preferredLanguage: "EN",
      source: "google_business_profile",
      notes: "Booked whitening consultation for next week.",
    },
    {
      id: "cust_lina_zhang",
      firstName: "Lina",
      lastName: "Zhang",
      email: "lina.zhang@example.com",
      phone: "+14155550103",
      status: "ACTIVE",
      preferredLanguage: "ZH",
      source: "referral",
      notes: "Returning patient. Prefers Chinese message templates.",
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {
        workspaceId: workspace.id,
        ownerId: owner.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        preferredLanguage: customer.preferredLanguage,
        source: customer.source,
        notes: customer.notes,
      },
      create: {
        ...customer,
        workspaceId: workspace.id,
        ownerId: owner.id,
      },
    });
  }

  const appointments = [
    {
      id: "appt_daniel_consultation",
      customerId: "cust_daniel_kim",
      startsAt: new Date("2026-03-18T17:00:00.000Z"),
      endsAt: new Date("2026-03-18T17:30:00.000Z"),
      status: "CONFIRMED",
      serviceName: "Whitening Consultation",
      notes: "Send reminder 24h before appointment.",
    },
    {
      id: "appt_lina_follow_up",
      customerId: "cust_lina_zhang",
      startsAt: new Date("2026-03-10T18:00:00.000Z"),
      endsAt: new Date("2026-03-10T18:45:00.000Z"),
      status: "COMPLETED",
      serviceName: "Follow-up Checkup",
      notes: "Eligible for review request.",
    },
  ];

  for (const appointment of appointments) {
    await prisma.appointment.upsert({
      where: { id: appointment.id },
      update: {
        workspaceId: workspace.id,
        customerId: appointment.customerId,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        status: appointment.status,
        serviceName: appointment.serviceName,
        notes: appointment.notes,
      },
      create: {
        ...appointment,
        workspaceId: workspace.id,
      },
    });
  }

  const messages = [
    {
      id: "msg_sophia_lead_follow_up",
      customerId: "cust_sophia_lee",
      appointmentId: null,
      channel: "SMS",
      direction: "OUTBOUND",
      status: "DRAFT",
      subject: null,
      body: "Hi Sophia, thanks for reaching out. We can help you book your first cleaning this week.",
      providerMessageId: null,
      scheduledAt: null,
      sentAt: null,
    },
    {
      id: "msg_daniel_reminder",
      customerId: "cust_daniel_kim",
      appointmentId: "appt_daniel_consultation",
      channel: "EMAIL",
      direction: "OUTBOUND",
      status: "QUEUED",
      subject: "Your consultation is coming up",
      body: "Reminder: your whitening consultation is scheduled for Wednesday at 10:00 AM.",
      providerMessageId: null,
      scheduledAt: new Date("2026-03-17T17:00:00.000Z"),
      sentAt: null,
    },
  ];

  for (const message of messages) {
    await prisma.message.upsert({
      where: { id: message.id },
      update: {
        workspaceId: workspace.id,
        customerId: message.customerId,
        appointmentId: message.appointmentId,
        channel: message.channel,
        direction: message.direction,
        status: message.status,
        subject: message.subject,
        body: message.body,
        providerMessageId: message.providerMessageId,
        scheduledAt: message.scheduledAt,
        sentAt: message.sentAt,
      },
      create: {
        ...message,
        workspaceId: workspace.id,
      },
    });
  }

  const workflowRules = [
    {
      id: "wf_new_lead_follow_up",
      name: "Follow up new leads within 24 hours",
      trigger: "LEAD_NOT_CONTACTED_24H",
      action: "SEND_MESSAGE",
      isActive: true,
      config: {
        channel: "sms",
        templateKey: "lead_follow_up_v1",
      },
    },
    {
      id: "wf_post_visit_review_request",
      name: "Request review after completed appointment",
      trigger: "APPOINTMENT_COMPLETED",
      action: "REQUEST_REVIEW",
      isActive: true,
      config: {
        channel: "email",
        delayHours: 2,
      },
    },
  ];

  for (const workflowRule of workflowRules) {
    await prisma.workflowRule.upsert({
      where: { id: workflowRule.id },
      update: {
        workspaceId: workspace.id,
        name: workflowRule.name,
        trigger: workflowRule.trigger,
        action: workflowRule.action,
        isActive: workflowRule.isActive,
        config: workflowRule.config,
      },
      create: {
        ...workflowRule,
        workspaceId: workspace.id,
      },
    });
  }

  await prisma.task.upsert({
    where: { id: "task_sophia_first_contact" },
    update: {
      workspaceId: workspace.id,
      customerId: "cust_sophia_lee",
      workflowRuleId: "wf_new_lead_follow_up",
      assigneeId: owner.id,
      title: "Call Sophia about first cleaning availability",
      description: "Reach out if the draft SMS is not sent by end of day.",
      status: "OPEN",
      dueAt: new Date("2026-03-15T00:00:00.000Z"),
    },
    create: {
      id: "task_sophia_first_contact",
      workspaceId: workspace.id,
      customerId: "cust_sophia_lee",
      workflowRuleId: "wf_new_lead_follow_up",
      assigneeId: owner.id,
      title: "Call Sophia about first cleaning availability",
      description: "Reach out if the draft SMS is not sent by end of day.",
      status: "OPEN",
      dueAt: new Date("2026-03-15T00:00:00.000Z"),
    },
  });

  await prisma.review.upsert({
    where: { id: "review_lina_follow_up" },
    update: {
      workspaceId: workspace.id,
      customerId: "cust_lina_zhang",
      appointmentId: "appt_lina_follow_up",
      status: "SUBMITTED",
      channel: "EMAIL",
      rating: 5,
      comment: "Friendly staff and quick visit.",
      externalUrl: "https://example.com/reviews/lina-zhang",
      requestedAt: new Date("2026-03-10T20:00:00.000Z"),
      submittedAt: new Date("2026-03-11T03:00:00.000Z"),
    },
    create: {
      id: "review_lina_follow_up",
      workspaceId: workspace.id,
      customerId: "cust_lina_zhang",
      appointmentId: "appt_lina_follow_up",
      status: "SUBMITTED",
      channel: "EMAIL",
      rating: 5,
      comment: "Friendly staff and quick visit.",
      externalUrl: "https://example.com/reviews/lina-zhang",
      requestedAt: new Date("2026-03-10T20:00:00.000Z"),
      submittedAt: new Date("2026-03-11T03:00:00.000Z"),
    },
  });

  console.log("Seeded MVP workspace data:", {
    workspace: workspace.slug,
    users: 1,
    customers: customers.length,
    appointments: appointments.length,
    messages: messages.length,
    workflowRules: workflowRules.length,
    tasks: 1,
    reviews: 1,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
