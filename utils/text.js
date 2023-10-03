import dayjs from "dayjs";

import idLocale from "dayjs/locale/id";

dayjs.locale("id");

export const formatRupiah = (nominal) => {
  return "Rp" + nominal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
};

export const formatNumber = (value, locale = "id") => {
  return Intl.NumberFormat(locale).format(value).replace(/\s/g, "");
};

export const formatCurrency = (value, locale, currencyCode, fractionDigits) => {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
  })
    .format(value)
    .replace(/\s/g, "");
};

export const formatDate = (date, format = "DD MMMM YYYY") => {
  if (!date) {
    return "-";
  }

  return dayjs(date).format(format);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getMonthShortName = (month) => {
  return dayjs()
    .month(month - 1)
    .format("MMM");
};

export const generateArrayOfYears = () => {
  var max = dayjs().year();
  var min = max - 4;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }

  return years;
};

export const generateArrayOfMonths = () => {
  const months = [];
  for (var i = 0; i < 12; i++) {
    months.push({
      month: i,
      name: dayjs().month(i).format("MMMM"),
    });
  }

  return months;
};
