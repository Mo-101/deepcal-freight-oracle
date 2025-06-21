
export interface CargoReadinessRFQ {
  CARGO_READINESS: string;
  ROAD: number;
  FREQUENCY: string;
  "Truck type , Capacity and Dimensions": string;
  "ESTIMATED CARGO PICK-UP DATE AT DOOR": string;
  "ETD": string;
  "ETD_Schedule": string;
  "DESTINATION_NAME": string;
  "DESTINATION_LOCATION": string;
  "ETA": string;
  "FREIGHT RATE PER KG": string;
  "ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS": string;
  "ALL INCLUSIVE FREIGHT COST FOR total cargo": string;
  "DESTINATION_FREE_TIME": string;
  "PAYMENT TERMS (SPECIFY IF DIFFERENT)": string;
  "PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.": string;
  "PROVIDE DETAILS OF TRANSPORT OPERATION FROM": string;
  "PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT": string;
  "VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)": string;
  "IMPORTANT Please indicate currency": string;
  "Name of Authorized Representative": string;
  "Signature": string;
  "Title": string;
  "Date": string;
}

export interface RFQFormField {
  name: keyof CargoReadinessRFQ;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "file";
  required?: boolean;
  placeholder?: string;
}

export const rfqFormFields: RFQFormField[] = [
  { name: "CARGO_READINESS", label: "CARGO READINESS", type: "date", required: true },
  { name: "ROAD", label: "ROAD", type: "number", required: true, placeholder: "e.g. 90000" },
  { name: "FREQUENCY", label: "FREQUENCY", type: "text", required: true },
  { name: "Truck type , Capacity and Dimensions", label: "Truck type , Capacity and Dimensions", type: "textarea", required: true },
  { name: "ESTIMATED CARGO PICK-UP DATE AT DOOR", label: "ESTIMATED CARGO PICK-UP DATE AT DOOR", type: "date", required: true },
  { name: "ETD", label: "ETD", type: "textarea", required: true },
  { name: "ETD_Schedule", label: "ETD Schedule", type: "text", required: true },
  { name: "DESTINATION_NAME", label: "DESTINATION: NAME", type: "text", required: true },
  { name: "DESTINATION_LOCATION", label: "DESTINATION LOCATION", type: "text", required: true },
  { name: "ETA", label: "ETA", type: "text", required: true },
  { name: "FREIGHT RATE PER KG", label: "FREIGHT RATE PER KG", type: "text", required: true },
  { name: "ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS", label: "ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS", type: "text", required: true },
  { name: "ALL INCLUSIVE FREIGHT COST FOR total cargo", label: "ALL INCLUSIVE FREIGHT COST FOR total cargo", type: "text", required: true },
  { name: "DESTINATION_FREE_TIME", label: "DESTINATION FREE TIME", type: "text", required: true },
  { name: "PAYMENT TERMS (SPECIFY IF DIFFERENT)", label: "PAYMENT TERMS (SPECIFY IF DIFFERENT)", type: "textarea", required: true },
  { name: "PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.", label: "PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.", type: "textarea", required: true },
  { name: "PROVIDE DETAILS OF TRANSPORT OPERATION FROM", label: "PROVIDE DETAILS OF TRANSPORT OPERATION FROM", type: "text", required: true },
  { name: "PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT", label: "PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT", type: "text", required: true },
  { name: "VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)", label: "VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)", type: "date", required: true },
  { name: "IMPORTANT Please indicate currency", label: "IMPORTANT Please indicate currency", type: "text", required: true, placeholder: "USD, EUR, KES, etc." },
  { name: "Name of Authorized Representative", label: "Name of Authorized Representative", type: "text", required: true },
  { name: "Signature", label: "Signature", type: "file" },
  { name: "Title", label: "Title", type: "text", required: true },
  { name: "Date", label: "Date", type: "date", required: true }
];
