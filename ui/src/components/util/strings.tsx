export const renderHighlightedName = (name: string, input: string) => {
  // get rid of accents
  const nameNorm = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const inputNorm = input.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const firstIndexMatch = nameNorm
    .toLowerCase()
    .indexOf(inputNorm.toLowerCase());
  if (firstIndexMatch === -1) {
    return name;
  }
  return firstIndexMatch === 0 ? (
    <>
      <b>{name.substring(0, input.length)}</b>
      {name.substring(input.length)}
    </>
  ) : (
    <>
      {name.substring(0, firstIndexMatch)}
      <b>{name.substring(firstIndexMatch, firstIndexMatch + input.length)}</b>
      {name.substring(firstIndexMatch + input.length)}
    </>
  );
};
