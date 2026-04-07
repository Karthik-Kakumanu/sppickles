export interface RegionInfo {
  region: string;
  regionTe: string;
  pincodeRange: string;
  shippingCost: number;
  shippingRatePerKg: number;
  code: "ap-telangana" | "south-india" | "north-india";
}

const SOUTH_INDIA_STATES = new Set([
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Telangana",
  "Puducherry",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
]);

export const validatePincode = (pincode: string): boolean => /^\d{6}$/.test(pincode.trim());

export const getRegionByPincode = (pincode: string): RegionInfo => {
  const cleanPincode = pincode.trim();

  if (!validatePincode(cleanPincode)) {
    return {
      region: "Invalid pincode",
      regionTe: "తప్పు పిన్ కోడ్",
      pincodeRange: "",
      shippingCost: 0,
      shippingRatePerKg: 0,
      code: "north-india",
    };
  }

  if (cleanPincode.startsWith("5")) {
    return {
      region: "AP / Telangana",
      regionTe: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
      pincodeRange: "5xxxx",
      shippingCost: 100,
      shippingRatePerKg: 100,
      code: "ap-telangana",
    };
  }

  if (cleanPincode.startsWith("6")) {
    return {
      region: "South India",
      regionTe: "దక్షిణ భారతదేశం",
      pincodeRange: "6xxxx",
      shippingCost: 150,
      shippingRatePerKg: 150,
      code: "south-india",
    };
  }

  return {
    region: "North India",
    regionTe: "ఉత్తర భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 200,
    shippingRatePerKg: 200,
    code: "north-india",
  };
};

export const getRegionByState = (state: string): RegionInfo => {
  const cleanState = state.trim();

  if (!cleanState) {
    return {
      region: "State not selected",
      regionTe: "రాష్ట్రం ఎంచుకోలేదు",
      pincodeRange: "",
      shippingCost: 0,
      shippingRatePerKg: 0,
      code: "north-india",
    };
  }

  if (cleanState === "Andhra Pradesh" || cleanState === "Telangana") {
    return {
      region: "AP / Telangana",
      regionTe: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
      pincodeRange: "State based",
      shippingCost: 100,
      shippingRatePerKg: 100,
      code: "ap-telangana",
    };
  }

  if (SOUTH_INDIA_STATES.has(cleanState)) {
    return {
      region: "South India",
      regionTe: "దక్షిణ భారతదేశం",
      pincodeRange: "State based",
      shippingCost: 150,
      shippingRatePerKg: 150,
      code: "south-india",
    };
  }

  return {
    region: "North India",
    regionTe: "ఉత్తర భారతదేశం",
    pincodeRange: "State based",
    shippingCost: 200,
    shippingRatePerKg: 200,
    code: "north-india",
  };
};

export const calculateShippingByWeight = (shippingRatePerKg: number, totalWeightKg: number) => {
  if (shippingRatePerKg <= 0 || totalWeightKg <= 0) {
    return 0;
  }

  // Base slab pricing: up to 1kg is a fixed regional shipping charge.
  if (totalWeightKg <= 1) {
    return shippingRatePerKg;
  }

  return Math.round(shippingRatePerKg * totalWeightKg);
};

export const SHIPPING_TIERS = [
  {
    region: "AP / Telangana",
    regionTe: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
    pincodeRange: "5xxxx",
    shippingCost: 100,
    shippingRatePerKg: 100,
    code: "ap-telangana",
  },
  {
    region: "South India",
    regionTe: "దక్షిణ భారతదేశం",
    pincodeRange: "6xxxx",
    shippingCost: 150,
    shippingRatePerKg: 150,
    code: "south-india",
  },
  {
    region: "North India",
    regionTe: "ఉత్తర భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 200,
    shippingRatePerKg: 200,
    code: "north-india",
  },
] as const;
