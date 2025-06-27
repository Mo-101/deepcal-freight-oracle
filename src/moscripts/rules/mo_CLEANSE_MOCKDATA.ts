
import { MoScript } from '../engine';

const canonicalRegistry = [
  'shipments',
  'forwarders', 
  'routes',
  'kpis',
  'mapEvents',
  'oracleFeed'
];

export const mo_CLEANSE_MOCKDATA: MoScript = {
  id: 'mo-data-cleanse-999',
  name: 'Mock Data Eliminator',
  trigger: 'onAppStart',
  inputs: ['dataSources', 'canonicalRegistry'],
  logic: ({ dataSources, canonicalRegistry }) => {
    const cleanSources: Record<string, any> = {};

    for (const key in dataSources) {
      const source = dataSources[key];

      // If source is NOT registered as canonical → remove it
      if (canonicalRegistry.includes(key)) {
        cleanSources[key] = source;
      } else {
        console.warn(`🔥 Purged mock data source: ${key}`);
      }
    }

    return cleanSources;
  },
  voiceLine: () => `🛡️ The Scroll is sealed. All unholy mock echoes have been cast from the temple.`,
  sass: true
};

// Export the canonical registry for use in other parts of the app
export { canonicalRegistry };
