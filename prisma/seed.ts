import { PrismaClient, Role, ShipmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type SeedTrackingEvent = {
  status: ShipmentStatus;
  message: string;
  location: string;
  occurredAt: Date;
};

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function cents(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shippers = [
  'Acme Retail',
  'BlueRiver Foods',
  'Northwind Traders',
  'Contoso Manufacturing',
  'Globex Corp',
];

const carriers = ['DHL', 'FedEx', 'UPS', 'Maersk', 'XPO Logistics'];

const locations = [
  'San Jose, CA',
  'Dallas, TX',
  'Chicago, IL',
  'Atlanta, GA',
  'Newark, NJ',
  'Seattle, WA',
  'Los Angeles, CA',
  'Miami, FL',
];

const statuses: ShipmentStatus[] = [
  ShipmentStatus.created,
  ShipmentStatus.booked,
  ShipmentStatus.in_transit,
  ShipmentStatus.delivered,
];

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const employeePasswordHash = await bcrypt.hash('employee123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tms.dev' },
    update: { passwordHash: adminPasswordHash, role: Role.admin },
    create: {
      email: 'admin@tms.dev',
      passwordHash: adminPasswordHash,
      role: Role.admin,
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee@tms.dev' },
    update: { passwordHash: employeePasswordHash, role: Role.employee },
    create: {
      email: 'employee@tms.dev',
      passwordHash: employeePasswordHash,
      role: Role.employee,
    },
  });

  const existing = await prisma.shipment.count();
  if (existing > 0) return;

  const now = new Date();

  for (let i = 1; i <= 60; i++) {
    const shipperName = shippers[i % shippers.length];
    const carrierName = carriers[i % carriers.length];
    const pickupLocation = locations[i % locations.length];
    const deliveryLocation = locations[(i + 3) % locations.length];

    const pickupDate = addDays(now, -(i % 20));
    const tentativeDelivery = addDays(pickupDate, 3 + (i % 8));

    const status = statuses[i % statuses.length];
    const deliveredDate =
      status === ShipmentStatus.delivered ? tentativeDelivery : null;

    const referenceNumber = `SHP-${String(i).padStart(5, '0')}`;

    const shipment = await prisma.shipment.create({
      data: {
        referenceNumber,
        shipperName,
        carrierName,
        pickupLocation,
        deliveryLocation,
        pickupDate,
        deliveryDate: deliveredDate,
        status,
        rateCents: cents(25000, 450000),
        currency: 'USD',
        flagged: i % 11 === 0,
      },
    });

    const baseEvents: SeedTrackingEvent[] = [
      {
        status: ShipmentStatus.created,
        message: 'Shipment created',
        location: pickupLocation,
        occurredAt: addDays(pickupDate, 0),
      },
      {
        status: ShipmentStatus.booked,
        message: 'Carrier booked',
        location: pickupLocation,
        occurredAt: addDays(pickupDate, 1),
      },
      {
        status: ShipmentStatus.in_transit,
        message: 'In transit',
        location: pickupLocation,
        occurredAt: addDays(pickupDate, 2),
      },
    ];

    if (status === ShipmentStatus.delivered && deliveredDate) {
      baseEvents.push({
        status: ShipmentStatus.delivered,
        message: 'Delivered',
        location: deliveryLocation,
        occurredAt: deliveredDate,
      });
    }

    await prisma.trackingEvent.createMany({
      data: baseEvents.map((e) => ({ ...e, shipmentId: shipment.id })),
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
