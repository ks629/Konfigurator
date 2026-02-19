import type { PersonaConfig, PersonaId } from '../engine/types';
import { konfiguratorPersona } from './konfigurator';
import { handlowiecPersona } from './handlowiec';
import { contractPersona } from './contract-generator';
import { arkuszPersona } from './arkusz-montazowy';
import { mojpradPersona } from './mojprad';
import { landingPersona } from './landing';

const PERSONAS: Record<string, PersonaConfig> = {
  konfigurator: konfiguratorPersona,
  handlowiec: handlowiecPersona,
  contract: contractPersona,
  arkusz: arkuszPersona,
  mojprad: mojpradPersona,
  landing: landingPersona,
};

export function getPersona(id: PersonaId): PersonaConfig {
  const persona = PERSONAS[id];
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}

export {
  konfiguratorPersona,
  handlowiecPersona,
  contractPersona,
  arkuszPersona,
  mojpradPersona,
  landingPersona,
};
