const padDatePart = (value: number) => String(value).padStart(2, "0");

const formatTimezoneOffset = (date: Date) => {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  return `${sign}${padDatePart(hours)}:${padDatePart(minutes)}`;
};

export const toDateInput = (value: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
};

export const getTodayDateInput = () => {
  const today = new Date();
  return `${today.getFullYear()}-${padDatePart(today.getMonth() + 1)}-${padDatePart(today.getDate())}`;
};

export const isPastDateInput = (value: string, minDate: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return trimmed < minDate;
};

export const toLocalDayBoundaryIsoOrNull = (value: string, boundary: "start" | "end") => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const monthIndex = Number(dateOnlyMatch[2]) - 1;
    const day = Number(dateOnlyMatch[3]);
    const hours = boundary === "start" ? 0 : 23;
    const minutes = boundary === "start" ? 0 : 59;
    const seconds = boundary === "start" ? 0 : 59;
    const milliseconds = boundary === "start" ? 0 : 999;

    const localDate = new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds);

    if (Number.isNaN(localDate.getTime())) {
      return null;
    }

    return `${trimmed}T${padDatePart(hours)}:${padDatePart(minutes)}:${padDatePart(seconds)}.${String(milliseconds).padStart(3, "0")}${formatTimezoneOffset(localDate)}`;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;

  const timezoneOffset = formatTimezoneOffset(date);
  const localYear = date.getFullYear();
  const localMonth = padDatePart(date.getMonth() + 1);
  const localDay = padDatePart(date.getDate());
  const localHours = padDatePart(date.getHours());
  const localMinutes = padDatePart(date.getMinutes());
  const localSeconds = padDatePart(date.getSeconds());
  const localMilliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}:${localSeconds}.${localMilliseconds}${timezoneOffset}`;
};
