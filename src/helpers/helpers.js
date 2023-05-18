import moment from "moment";

const initialMainTableDate = {
  StartDate: moment().subtract(30, "days").format("DD.MM.YYYY"),
  EndDate: moment().add(30, "days").format("DD.MM.YYYY"),
}

const largerMainTableDate = {
  StartDate: moment().subtract(330, "days").format("DD.MM.YYYY"),
  EndDate: moment().add(30, "days").format("DD.MM.YYYY"),
}

const initialMainTablePagination = {
  PageNumber: 1,
  PageLimit: 10,
}
const initialMainTablePagination50 = {
  PageNumber: 1,
  PageLimit: 50,
}

const monthCount = [
  {
    id: '1'
  },
  {
    id: '2'
  },
  {
    id: '3'
  },
  {
    id: '4'
  },
  {
    id: '5'
  },
  {
    id: '6'
  },
  {
    id: '7'
  },
  {
    id: '8'
  },
  {
    id: '9'
  },
  {
    id: '10'
  },
  {
    id: '11'
  },
  {
    id: '12'
  },
];

const responsive = () => {
  if (window.outerWidth >= 1200) {
    return 'xl'
  } else if (window.outerWidth >= 992) {
    return 'lg';
  } else if (window.outerWidth >= 768) {
    return 'md';
  } else if (window.outerWidth >= 576) {
    return 'sm';
  } else if (window.outerWidth < 576) {
    return 'col';
  }
}

export { monthCount, initialMainTableDate, largerMainTableDate, initialMainTablePagination, initialMainTablePagination50, responsive }