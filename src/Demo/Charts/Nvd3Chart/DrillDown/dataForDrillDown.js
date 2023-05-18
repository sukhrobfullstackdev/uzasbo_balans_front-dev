const data = [
  { arg: "Toshkent", val: 3007613498, parentID: "" },
  { arg: "Andijon", val: 493603615, parentID: "" },
  { arg: "Farg'ona", val: 438575293, parentID: "" },
  { arg: "Namangan", val: 381331438, parentID: "" },
  { arg: "Guliston", val: 331126555, parentID: "" },
  { arg: "Jizzax", val: 331126557, parentID: "" },
  { arg: "Navoiy", val: 321126955, parentID: "" },
  { arg: "Samarqand", val: 335126155, parentID: "" },
  { arg: "Surxondaryo", val: 391129555, parentID: "" },
  { arg: "Qashqadaryo", val: 431126555, parentID: "" },
  { arg: "Buxoro", val: 331127555, parentID: "" },
  { arg: "Xorazm", val: 335126555, parentID: "" },
  { arg: "Qoraqalpog'iston", val: 541126555, parentID: "" },
  // Districts

  // Tashkent 
  { arg: "Yunusobod", val: 201562056.25, parentID: "Toshkent" },
  { arg: "Olmazor", val: 90487396, parentID: "Toshkent" },
  { arg: "Sirg'ali", val: 77433744, parentID: "Toshkent" },
  { arg: "Yakkasaroy", val: 33848242, parentID: "Toshkent" },
  { arg: "Bektemir", val: 181562056.25, parentID: "Toshkent" },
  { arg: "Mirobod", val: 8487396, parentID: "Toshkent" },
  { arg: "Mirzo Ulug‘bek", val: 77433744, parentID: "Toshkent" },
  { arg: "Uchtepa", val: 33848242, parentID: "Toshkent" },
  { arg: "Shayxontohur", val: 151562056.25, parentID: "Toshkent" },
  { arg: "Yashnobod", val: 88487396, parentID: "Toshkent" },
  { arg: "Chilonzor", val: 99433744, parentID: "Toshkent" },

  //Yashnobod
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Chilonzor" },
  { arg: "Maktab", val: 1806407, parentID: "Chilonzor" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Chilonzor" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Chilonzor" },
  { arg: "Pensiya", val: 10006407, parentID: "Chilonzor" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Chilonzor" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Chilonzor" },


  //Yashnobod
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Yashnobod" },
  { arg: "Maktab", val: 1806407, parentID: "Yashnobod" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Yashnobod" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Yashnobod" },
  { arg: "Pensiya", val: 10006407, parentID: "Yashnobod" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Yashnobod" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Yashnobod" },

  //Shayxontohur
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Shayxontohur" },
  { arg: "Maktab", val: 1806407, parentID: "Shayxontohur" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Shayxontohur" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Shayxontohur" },
  { arg: "Pensiya", val: 10006407, parentID: "Shayxontohur" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Shayxontohur" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Shayxontohur" },

  //Uchtepa
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Uchtepa" },
  { arg: "Maktab", val: 1806407, parentID: "Uchtepa" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Uchtepa" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Uchtepa" },
  { arg: "Pensiya", val: 10006407, parentID: "Uchtepa" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Uchtepa" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Uchtepa" },



  //Yunsabot
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Yunusobod" },
  { arg: "Maktab", val: 1806407, parentID: "Yunusobod" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Yunusobod" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Yunusobod" },
  { arg: "Pensiya", val: 10006407, parentID: "Yunusobod" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Yunusobod" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Yunusobod" },

  // Olmazor
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Olmazor" },
  { arg: "Maktab", val: 1806407, parentID: "Olmazor" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Olmazor" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Olmazor" },
  { arg: "Pensiya", val: 10006407, parentID: "Olmazor" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Olmazor" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Olmazor" },

  //Sirg'ali
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Sirg'ali" },
  { arg: "Maktab", val: 1806407, parentID: "Sirg'ali" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Sirg'ali" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Sirg'ali" },
  { arg: "Pensiya", val: 10006407, parentID: "Sirg'ali" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Sirg'ali" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Sirg'ali" },

  //Yakkasaroy
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Yakkasaroy" },
  { arg: "Maktab", val: 1806407, parentID: "Yakkasaroy" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Yakkasaroy" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Yakkasaroy" },
  { arg: "Pensiya", val: 10006407, parentID: "Yakkasaroy" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Yakkasaroy" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Yakkasaroy" },

  // Bektemir
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Bektemir" },
  { arg: "Maktab", val: 1806407, parentID: "Bektemir" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Bektemir" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Bektemir" },
  { arg: "Pensiya", val: 10006407, parentID: "Bektemir" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Bektemir" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Bektemir" },

  //Mirobod
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Mirobod" },
  { arg: "Maktab", val: 1806407, parentID: "Mirobod" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Mirobod" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Mirobod" },
  { arg: "Pensiya", val: 10006407, parentID: "Mirobod" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Mirobod" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Mirobod" },

  //Mirzo Ulug‘bek
  { arg: "Hokimiyat", val: 9006407.25, parentID: "Mirzo Ulug‘bek" },
  { arg: "Maktab", val: 1806407, parentID: "Mirzo Ulug‘bek" },
  { arg: "Bog'cha", val: 8006407.25, parentID: "Mirzo Ulug‘bek" },
  { arg: "Prokatura", val: 15006407.2, parentID: "Mirzo Ulug‘bek" },
  { arg: "Pensiya", val: 10006407, parentID: "Mirzo Ulug‘bek" },
  { arg: "Uzarxiv", val: 9006407.25, parentID: "Mirzo Ulug‘bek" },
  { arg: "Oliy majlis", val: 18006407.25, parentID: "Mirzo Ulug‘bek" },


  // { arg: "China", val: 1380083000, parentID: "Asia" },
  // { arg: "India", val: 1306687000, parentID: "Asia" },
  // { arg: "Pakistan", val: 193885498, parentID: "Asia" },
  // { arg: "Japan", val: 126958000, parentID: "Asia" },
  // { arg: "Russia", val: 146804372, parentID: "Europe" },
  // { arg: "Germany", val: 82175684, parentID: "Europe" },
  // { arg: "Turkey", val: 79463663, parentID: "Europe" },
  // { arg: "France", val: 66736000, parentID: "Europe" },
  // { arg: "United Kingdom", val: 63395574, parentID: "Europe" },
  // { arg: "United States", val: 325310275, parentID: "North America" },
  // { arg: "Mexico", val: 121005815, parentID: "North America" },
  // { arg: "Canada", val: 36048521, parentID: "North America" },
  // { arg: "Cuba", val: 11239004, parentID: "North America" },
  // { arg: "Brazil", val: 205737996, parentID: "South America" },
  // { arg: "Colombia", val: 48400388, parentID: "South America" },
  // { arg: "Venezuela", val: 30761000, parentID: "South America" },
  // { arg: "Peru", val: 28220764, parentID: "South America" },
  // { arg: "Chile", val: 18006407, parentID: "South America" },
  // Organizations

];

export default {
  filterData(name) {
    return data.filter((item) => item.parentID === name);
  }
};
