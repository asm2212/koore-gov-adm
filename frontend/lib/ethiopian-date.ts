// lib/ethiopian-date.ts

export const getEthiopianDateParts = (date: Date) => {
  try {
    const fmt = new Intl.DateTimeFormat("am-ET-u-ca-ethiopic", {
      timeZone: "Africa/Addis_Ababa",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const parts = fmt.formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    return { day, month, year };
  } catch {
    return { day: "--", month: "Unknown", year: "----" };
  }
};

export const getEatHMS = (date: Date) => {
  try {
    const t = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Addis_Ababa",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);

    const h24 = Number(t.find((p) => p.type === "hour")?.value ?? "0");
    const min = t.find((p) => p.type === "minute")?.value ?? "00";
    const sec = t.find((p) => p.type === "second")?.value ?? "00";

    const etHour = ((h24 + 6) % 12) || 12;
    const hh = String(etHour).padStart(2, "0");

    return { hh, min, sec };
  } catch {
    return { hh: "--", min: "--", sec: "--" };
  }
};

export const formatEthiopianDateTime = (date: Date): string => {
  const { day, month, year } = getEthiopianDateParts(date);
  const { hh, min } = getEatHMS(date);
  return `${hh}:${min} | ${month} ${day}, ${year}`;
};

export const formatSmartTime = (createdAt: string): { relative: string; ethiopian: string } => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) {
    return { relative: "Just now", ethiopian: formatEthiopianDateTime(created) };
  }
  if (diffInMinutes < 60) {
    return { relative: `${diffInMinutes} min ago`, ethiopian: formatEthiopianDateTime(created) };
  }
  if (diffInHours < 24) {
    return { relative: `${diffInHours} hr ago`, ethiopian: formatEthiopianDateTime(created) };
  }

  return {
    relative: "",
    ethiopian: formatEthiopianDateTime(created),
  };
};