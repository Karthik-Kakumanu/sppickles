import { brand, type OrderCustomer, type WeightOption } from "@/data/site";
import { formatCurrency } from "@/lib/pricing";

type OrderMessageItem = {
  name: string;
  weight: WeightOption;
  quantity: number;
};

export const buildWhatsAppOrderMessage = (
  items: OrderMessageItem[],
  total: number,
  customer: Partial<OrderCustomer>,
) => {
  const lines = [
    "Hi, I want to order:",
    "",
    ...items.map((item) => `${item.name} - ${item.weight} - Qty ${item.quantity}`),
    "",
    `Total: ${formatCurrency(total)}`,
    "",
    `Name: ${customer.name?.trim() || "[Name]"}`,
    `Phone: ${customer.phone?.trim() || "[Phone]"}`,
    `Address: ${customer.address?.trim() || "[Address]"}`,
  ];

  return lines.join("\n");
};

export const buildWhatsAppOrderUrl = (
  items: OrderMessageItem[],
  total: number,
  customer: Partial<OrderCustomer>,
) => `${brand.whatsappUrl}?text=${encodeURIComponent(buildWhatsAppOrderMessage(items, total, customer))}`;
