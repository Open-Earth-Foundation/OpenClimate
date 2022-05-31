const organizations = `
[
    {
      "country": "Australia",
      "organization": "Australian Capital Territory"
    },
    {
      "country": "Australia",
      "organization": "Queensland"
    },
    {
      "country": "Australia",
      "organization": "South Australia"
    },
    {
      "country": "Australia",
      "organization": "State Government of Victoria"
    },
    {
      "country": "Austria",
      "organization": "Land Lower Austria"
    },
    {
      "country": "Austria",
      "organization": "Land Upper Austria"
    },
    {
      "country": "Belgium",
      "organization": "Wallonia"
    },
    {
      "country": "Brazil",
      "organization": "Acre"
    },
    {
      "country": "Brazil",
      "organization": "Alagoas"
    },
    {
      "country": "Brazil",
      "organization": "Amapa"
    },
    {
      "country": "Brazil",
      "organization": "Amazonas (Brazil)"
    },
    {
      "country": "Brazil",
      "organization": "Bahia"
    },
    {
      "country": "Brazil",
      "organization": "Ceara"
    },
    {
      "country": "Brazil",
      "organization": "Distrito Federal (Brasil)"
    },
    {
      "country": "Brazil",
      "organization": "Espirito Santo"
    },
    {
      "country": "Brazil",
      "organization": "Goias"
    },
    {
      "country": "Brazil",
      "organization": "Maranhão"
    },
    {
      "country": "Brazil",
      "organization": "Mato Grosso"
    },
    {
      "country": "Brazil",
      "organization": "Mato Grosso do sul"
    },
    {
      "country": "Brazil",
      "organization": "Minas Gerais"
    },
    {
      "country": "Brazil",
      "organization": "Para"
    },
    {
      "country": "Brazil",
      "organization": "Parana"
    },
    {
      "country": "Brazil",
      "organization": "Paraíba"
    },
    {
      "country": "Brazil",
      "organization": "Pernambuco"
    },
    {
      "country": "Brazil",
      "organization": "Piauí"
    },
    {
      "country": "Brazil",
      "organization": "Rio Grande do Sul"
    },
    {
      "country": "Brazil",
      "organization": "Rio de Janeiro State"
    },
    {
      "country": "Brazil",
      "organization": "Rondonia"
    },
    {
      "country": "Brazil",
      "organization": "Roraima"
    },
    {
      "country": "Brazil",
      "organization": "Santa Catarina"
    },
    {
      "country": "Brazil",
      "organization": "Sao Paulo State"
    },
    {
      "country": "Brazil",
      "organization": "Sergipe"
    },
    {
      "country": "Brazil",
      "organization": "Tocantins"
    },
    {
      "country": "Burkina Faso",
      "organization": "Centre Nord"
    },
    {
      "country": "Canada",
      "organization": "Alberta"
    },
    {
      "country": "Canada",
      "organization": "British Columbia"
    },
    {
      "country": "Canada",
      "organization": "Newfoundland and Labrador"
    },
    {
      "country": "Canada",
      "organization": "Northwest Territories"
    },
    {
      "country": "Canada",
      "organization": "Prince Edward Island"
    },
    {
      "country": "Canada",
      "organization": "Quebec"
    },
    {
      "country": "Colombia",
      "organization": "Caquetá"
    },
    {
      "country": "Colombia",
      "organization": "Nariño"
    },
    {
      "country": "Côte d'Ivoire",
      "organization": "Sud-Comoe"
    },
    {
      "country": "Denmark",
      "organization": "North Denmark Region"
    },
    {
      "country": "Ecuador",
      "organization": "Pastaza"
    },
    {
      "country": "Ecuador",
      "organization": "Santa Elena"
    },
    {
      "country": "Finland",
      "organization": "North Karelia"
    },
    {
      "country": "Finland",
      "organization": "South Ostrobothnia"
    },
    {
      "country": "Finland",
      "organization": "Uusimaa"
    },
    {
      "country": "France",
      "organization": "Grand-Est"
    },
    {
      "country": "France",
      "organization": "Occitanie"
    },
    {
      "country": "France",
      "organization": "Réunion"
    },
    {
      "country": "Germany",
      "organization": "Baden-Württemberg"
    },
    {
      "country": "Germany",
      "organization": "Bavaria"
    },
    {
      "country": "Germany",
      "organization": "Hesse"
    },
    {
      "country": "Germany",
      "organization": "Lower Saxony"
    },
    {
      "country": "Germany",
      "organization": "North Rhine-Westphalia"
    },
    {
      "country": "Germany",
      "organization": "Rhineland-Palatinate"
    },
    {
      "country": "Germany",
      "organization": "Schleswig-Holstein"
    },
    {
      "country": "Germany",
      "organization": "Thuringia"
    },
    {
      "country": "India",
      "organization": "Delhi"
    },
    {
      "country": "India",
      "organization": "Jammu and Kashmir"
    },
    {
      "country": "Indonesia",
      "organization": "Aceh"
    },
    {
      "country": "Indonesia",
      "organization": "Banyuwangi Regency"
    },
    {
      "country": "Indonesia",
      "organization": "Central Kalimantan"
    },
    {
      "country": "Indonesia",
      "organization": "East Kalimantan"
    },
    {
      "country": "Indonesia",
      "organization": "North Kalimantan"
    },
    {
      "country": "Indonesia",
      "organization": "Papua"
    },
    {
      "country": "Indonesia",
      "organization": "West Kalimantan"
    },
    {
      "country": "Indonesia",
      "organization": "West Papua Province"
    },
    {
      "country": "Italy",
      "organization": "Regione Abruzzo"
    },
    {
      "country": "Italy",
      "organization": "Regione Autonoma della Sardegna"
    },
    {
      "country": "Italy",
      "organization": "Regione Lombardia"
    },
    {
      "country": "Italy",
      "organization": "Regione Marche"
    },
    {
      "country": "Italy",
      "organization": "Regione Piemonte"
    },
    {
      "country": "Mexico",
      "organization": "Baja California"
    },
    {
      "country": "Mexico",
      "organization": "Campeche"
    },
    {
      "country": "Mexico",
      "organization": "Chiapas"
    },
    {
      "country": "Mexico",
      "organization": "Colima"
    },
    {
      "country": "Mexico",
      "organization": "Estado de Mexico"
    },
    {
      "country": "Mexico",
      "organization": "Guanajuato"
    },
    {
      "country": "Mexico",
      "organization": "Jalisco"
    },
    {
      "country": "Mexico",
      "organization": "Nuevo León"
    },
    {
      "country": "Mexico",
      "organization": "Oaxaca"
    },
    {
      "country": "Mexico",
      "organization": "Queretaro"
    },
    {
      "country": "Mexico",
      "organization": "Quintana Roo"
    },
    {
      "country": "Mexico",
      "organization": "San Luis Potosi"
    },
    {
      "country": "Mexico",
      "organization": "Sonora"
    },
    {
      "country": "Mexico",
      "organization": "Tabasco"
    },
    {
      "country": "Mexico",
      "organization": "Yucatan"
    },
    {
      "country": "Morocco",
      "organization": "Chefchaouen"
    },
    {
      "country": "Netherlands",
      "organization": "Flevoland Province"
    },
    {
      "country": "New Caledonia",
      "organization": "New Caledonia"
    },
    {
      "country": "New Zealand",
      "organization": "Greater Wellington Regional Council"
    },
    {
      "country": "Nigeria",
      "organization": "Cross River State"
    },
    {
      "country": "Norway",
      "organization": "Innlandet County Council"
    },
    {
      "country": "Peru",
      "organization": "Amazonas"
    },
    {
      "country": "Peru",
      "organization": "Huánuco"
    },
    {
      "country": "Peru",
      "organization": "Loreto"
    },
    {
      "country": "Peru",
      "organization": "Madre de Dios"
    },
    {
      "country": "Peru",
      "organization": "Piura Region"
    },
    {
      "country": "Peru",
      "organization": "San Martín"
    },
    {
      "country": "Peru",
      "organization": "Ucayali"
    },
    {
      "country": "Poland",
      "organization": "Lesser Poland Voivodeship"
    },
    {
      "country": "Poland",
      "organization": "Opole Voivodeship"
    },
    {
      "country": "Portugal",
      "organization": "Azores"
    },
    {
      "country": "Portugal",
      "organization": "Comunidade Intermunicipal do Baixo Alentejo"
    },
    {
      "country": "Portugal",
      "organization": "Comunidade Intermunicipal do Médio Tejo"
    },
    {
      "country": "Portugal",
      "organization": "Madeira"
    },
    {
      "country": "Republic of Korea",
      "organization": "Chungcheongnam-Do"
    },
    {
      "country": "Senegal",
      "organization": "Saint Louis"
    },
    {
      "country": "South Africa",
      "organization": "KwaZulu-Natal"
    },
    {
      "country": "South Africa",
      "organization": "Western Cape"
    },
    {
      "country": "Spain",
      "organization": "Andalucía"
    },
    {
      "country": "Spain",
      "organization": "Cantabria"
    },
    {
      "country": "Spain",
      "organization": "Cataluña"
    },
    {
      "country": "Spain",
      "organization": "Comunidad Foral de Navarra"
    },
    {
      "country": "Spain",
      "organization": "Comunidad de Madrid"
    },
    {
      "country": "Spain",
      "organization": "Galicia"
    },
    {
      "country": "Spain",
      "organization": "Islas Baleares"
    },
    {
      "country": "Spain",
      "organization": "País Vasco"
    },
    {
      "country": "Sweden",
      "organization": "Jämtland County"
    },
    {
      "country": "United Kingdom of Great Britain and Northern Ireland",
      "organization": "Scotland"
    },
    {
      "country": "United Kingdom of Great Britain and Northern Ireland",
      "organization": "Wales"
    },
    {
      "country": "United States of America",
      "organization": "California"
    },
    {
      "country": "United States of America",
      "organization": "Connecticut"
    },
    {
      "country": "United States of America",
      "organization": "Hawaii"
    },
    {
      "country": "United States of America",
      "organization": "Minnesota"
    },
    {
      "country": "United States of America",
      "organization": "New York State"
    },
    {
      "country": "United States of America",
      "organization": "Oregon"
    },
    {
      "country": "United States of America",
      "organization": "Washington"
    }
  ]`;

  export default organizations;