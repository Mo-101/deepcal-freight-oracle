
import { MoScript } from '../engine';

export const mo_OFAC_SENTINEL: MoScript = {
  id: 'mo-ofac-sentinel',
  name: 'OFAC Sanctions Checker',
  trigger: 'onBeforeSaveShipment',
  inputs: ['shipment'],
  logic: ({ shipment }) => {
    // Replace logic with real sanctioned carrier/country checks as needed
    return {
      flagged: shipment.carrier === 'Blacklisted Ltd.',
      message: shipment.carrier === 'Blacklisted Ltd.'
        ? 'OFAC violation: Carrier is under sanctions.'
        : 'Carrier cleared for trade.',
    };
  },
  voiceLine: (res) => res.message,
  sass: true,
};
