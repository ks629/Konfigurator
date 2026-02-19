'use client';

import NexbiProvider from '@/nexbi/components/NexbiProvider';
import NexbiWidget from '@/nexbi/components/NexbiWidget';
import { konfiguratorPersona } from '@/nexbi/personas/konfigurator';

export default function NexbiLoader() {
  return (
    <NexbiProvider config={konfiguratorPersona}>
      <NexbiWidget knowledge={konfiguratorPersona.knowledge} />
    </NexbiProvider>
  );
}
