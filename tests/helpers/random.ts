import { randomUUID } from 'node:crypto';

export function randomString() {
	return randomUUID();
}