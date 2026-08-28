import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import contractJson from './contract.json' with { type: 'json' };
import type { Contract } from './contract.d';

export const db = postgres({
  contractJson: contractJson as unknown as Contract,
  url: process.env['DATABASE_URL']!,
});