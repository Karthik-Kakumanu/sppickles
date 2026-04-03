export interface RegionInfo {
  region: string;
  regionTe: string;
  pincodeRange: string;
  shippingCost: number;
  shippingRatePerKg: number;
  code: "ap-telangana" | "south-india" | "north-india";
}

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
      shippingCost: 150,
      shippingRatePerKg: 150,
      code: "ap-telangana",
    };
  }

  if (cleanPincode.startsWith("6")) {
    return {
      region: "South India",
      regionTe: "దక్షిణ భారతదేశం",
      pincodeRange: "6xxxx",
      shippingCost: 200,
      shippingRatePerKg: 200,
      code: "south-india",
    };
  }

  return {
    region: "North India",
    regionTe: "ఉత్తర భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 250,
    shippingRatePerKg: 250,
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
    shippingCost: 150,
    shippingRatePerKg: 150,
    code: "ap-telangana",
  },
  {
    region: "South India",
    regionTe: "దక్షిణ భారతదేశం",
    pincodeRange: "6xxxx",
    shippingCost: 200,
    shippingRatePerKg: 200,
    code: "south-india",
  },
  {
    region: "North India",
    regionTe: "ఉత్తర భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 250,
    shippingRatePerKg: 250,
    code: "north-india",
  },
] as const;
