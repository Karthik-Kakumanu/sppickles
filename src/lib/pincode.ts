export interface RegionInfo {
  region: string;
  shippingCost: number;
  code: "starts-with-5" | "starts-with-6" | "others";
}

export const validatePincode = (pincode: string): boolean => /^\d{6}$/.test(pincode.trim());

export const getRegionByPincode = (pincode: string): RegionInfo => {
  const cleanPincode = pincode.trim();

  if (!validatePincode(cleanPincode)) {
    return {
      region: "Invalid pincode",
      shippingCost: 0,
      code: "others",
    };
  }

  if (cleanPincode.startsWith("5")) {
    return {
      region: "Starts with 5",
      shippingCost: 150,
      code: "starts-with-5",
    };
  }

  if (cleanPincode.startsWith("6")) {
    return {
      region: "Starts with 6",
      shippingCost: 200,
      code: "starts-with-6",
    };
  }

  return {
    region: "Other pincodes",
    shippingCost: 250,
    code: "others",
  };
};
