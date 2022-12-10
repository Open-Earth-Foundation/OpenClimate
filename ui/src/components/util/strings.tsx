export const renderHighlightedName = (name: string, input: string) => {
    const firstIndexMatch = name.toLowerCase().indexOf(input.toLowerCase());
    return firstIndexMatch === 0 ? 
        <><b>{name.substring(0, input.length)}</b>{name.substring(input.length)}</>
        : 
        <>{name.substring(0, firstIndexMatch)}<b>{name.substring(firstIndexMatch, firstIndexMatch + input.length)}</b>{name.substring(firstIndexMatch + input.length)}</>
}