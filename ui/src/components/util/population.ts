export function showPopulationParent(type: string) {
  switch (type) {
    case "Country":
      return "Earth";
    case "Region/Province":
      return "Country";
    case "City":
    case "Company":
      return "Region";
  }
}
