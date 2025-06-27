
import { ShipmentData } from '@/types/shipment';
import { parse } from 'papaparse';

export interface ShipmentRecord {
    request_reference: string;
    origin_country?: string;
    destination_country?: string;
    weight_kg?: number;
    volume_cbm?: number;
    item_category?: string;
    [key: string]: any;
}

export class CSVDataEngine {
    private static instance: CSVDataEngine;
    private dataLoaded: boolean = false;
    private dataStale: boolean = false;
    private lastLoadTime: number | null = null;
    private readonly MAX_DATA_AGE = 60 * 60 * 1000; // 1 hour
    private shipments: ShipmentRecord[] = [];
    private lineageMeta: any = null;

    private constructor() { }

    public static getInstance(): CSVDataEngine {
        if (!CSVDataEngine.instance) {
            CSVDataEngine.instance = new CSVDataEngine();
        }
        return CSVDataEngine.instance;
    }

    public isDataLoaded(): boolean {
        return this.dataLoaded;
    }

    public isDataStale(): boolean {
        return this.dataStale;
    }

    public getLineageMeta(): any {
        return this.lineageMeta;
    }

    public async loadCSVData(csvFilePath: string): Promise<ShipmentRecord[]> {
        try {
            const response = await fetch(csvFilePath);
            const csvText = await response.text();

            const result = parse<ShipmentRecord>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                transformHeader: header => header.trim(),
                transform: value => value.trim()
            });

            if (result.errors.length > 0) {
                console.error('CSV Parsing Errors:', result.errors);
                throw new Error('Failed to parse CSV data.');
            }

            this.lineageMeta = {
                source: csvFilePath,
                records: result.data.length,
                sha256: 'embedded',
            };

            return result.data as ShipmentRecord[];
        } catch (error) {
            console.error('Error loading or parsing CSV:', error);
            throw error;
        }
    }

    private async autoDetectEmbeddedData(): Promise<ShipmentRecord[]> {
        try {
            // Use the correct path to the embedded CSV file
            const response = await fetch('/embedded_shipments.csv');
            const csvText = await response.text();
            
            const result = parse<ShipmentRecord>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                transformHeader: header => header.trim(),
                transform: value => value.trim()
            });

            if (result.errors.length > 0) {
                console.error('CSV Parsing Errors:', result.errors);
                throw new Error('Failed to parse embedded CSV data.');
            }

            // Calculate SHA-256 hash
            const textEncoder = new TextEncoder();
            const data = textEncoder.encode(csvText);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            this.lineageMeta = {
                source: 'embedded',
                records: result.data.length,
                sha256: hashHex,
            };

            return result.data as ShipmentRecord[];
        } catch (error) {
            console.error('Error loading or parsing embedded CSV:', error);
            throw error;
        }
    }

    public async autoLoadEmbeddedData(): Promise<void> {
        try {
            const data = await this.autoDetectEmbeddedData();
            this.shipments = data;
            this.dataLoaded = true;
            this.dataStale = false;
            this.lastLoadTime = Date.now();
            console.log(`[CSVDataEngine] Loaded ${data.length} records from embedded data.`);
        } catch (error) {
            console.error('Auto-load failed:', error);
            throw error;
        }
    }

    public async forceReloadEmbeddedData(): Promise<void> {
        try {
            const data = await this.autoDetectEmbeddedData();
            this.shipments = data;
            this.dataLoaded = true;
            this.dataStale = false;
            this.lastLoadTime = Date.now();
            console.warn('[CSVDataEngine] Forced reload of embedded data.');
        } catch (error) {
            console.error('Forced reload failed:', error);
            throw error;
        }
    }

    public listShipments(): ShipmentRecord[] {
        if (!this.dataLoaded) {
            console.warn('Data not loaded, returning empty array.');
            return [];
        }
        return this.shipments;
    }

    /**
     * Get comprehensive statistics for a specific route
     */
    getRouteStatistics(originCountry: string, destinationCountry: string) {
        if (!this.shipments.length) return null;

        const routeShipments = this.shipments.filter(s =>
            s.origin_country === originCountry && s.destination_country === destinationCountry
        );

        const forwarderUsage = routeShipments.reduce((acc, s) => {
            const forwarder = s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded;
            if (forwarder) {
                acc[forwarder] = (acc[forwarder] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const totalWeight = routeShipments.reduce((sum, s) => sum + (Number(s.weight_kg) || 0), 0);
        const totalCost = routeShipments.reduce((sum, s) => sum + (Number(s['carrier+cost']) || 0), 0);

        return {
            totalShipments: routeShipments.length,
            totalWeight,
            totalCost,
            avgCostPerKg: totalWeight > 0 ? totalCost / totalWeight : 0,
            forwarderUsage,
            deliverySuccess: routeShipments.filter(s => s.delivery_status === 'Delivered').length,
            categories: [...new Set(routeShipments.map(s => s.item_category).filter(Boolean))]
        };
    }

    /**
     * Get destination statistics
     */
    getDestinationStatistics(destinationCountry: string) {
        if (!this.shipments.length) return null;

        const destinationShipments = this.shipments.filter(s =>
            s.destination_country === destinationCountry
        );

        const origins = [...new Set(destinationShipments.map(s => s.origin_country).filter(Boolean))];
        const forwarders = [...new Set(destinationShipments.map(s =>
            s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded
        ).filter(Boolean))];

        return {
            totalShipments: destinationShipments.length,
            uniqueOrigins: origins.length,
            uniqueForwarders: forwarders.length,
            origins,
            forwarders
        };
    }

    /**
     * Get global network statistics
     */
    getNetworkStatistics() {
        if (!this.shipments.length) return null;

        const countries = new Set();
        const routes = new Set();
        const forwarders = new Set();

        this.shipments.forEach(s => {
            if (s.origin_country) countries.add(s.origin_country);
            if (s.destination_country) countries.add(s.destination_country);
            if (s.origin_country && s.destination_country) {
                routes.add(`${s.origin_country}-${s.destination_country}`);
            }
            const forwarder = s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded;
            if (forwarder) forwarders.add(forwarder);
        });

        return {
            totalShipments: this.shipments.length,
            uniqueCountries: countries.size,
            uniqueRoutes: routes.size,
            uniqueForwarders: forwarders.size,
            totalWeight: this.shipments.reduce((sum, s) => sum + (Number(s.weight_kg) || 0), 0),
            totalValue: this.shipments.reduce((sum, s) => sum + (Number(s['carrier+cost']) || 0), 0)
        };
    }
}

export const csvDataEngine = CSVDataEngine.getInstance();
