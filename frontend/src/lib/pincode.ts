export interface RegionInfo {
  region: string;
  regionTe: string;
  pincodeRange: string;
  shippingCost: number;
  code: "ap-telangana" | "south-india" | "rest-india";
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
      code: "rest-india",
    };
  }

  if (cleanPincode.startsWith("5")) {
    return {
      region: "AP / Telangana",
      regionTe: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
      pincodeRange: "5xxxx",
      shippingCost: 150,
      code: "ap-telangana",
    };
  }

  if (cleanPincode.startsWith("6")) {
    return {
      region: "South India",
      regionTe: "దక్షిణ భారతదేశం",
      pincodeRange: "6xxxx",
      shippingCost: 200,
      code: "south-india",
    };
  }

  return {
    region: "Rest of India",
    regionTe: "మిగతా భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 250,
    code: "rest-india",
  };
};

export const SHIPPING_TIERS = [
  {
    region: "AP / Telangana",
    regionTe: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
    pincodeRange: "5xxxx",
    shippingCost: 150,
    code: "ap-telangana",
  },
  {
    region: "South India",
    regionTe: "దక్షిణ భారతదేశం",
    pincodeRange: "6xxxx",
    shippingCost: 200,
    code: "south-india",
  },
  {
    region: "Rest of India",
    regionTe: "మిగతా భారతదేశం",
    pincodeRange: "Others",
    shippingCost: 250,
    code: "rest-india",
  },
] as const;
