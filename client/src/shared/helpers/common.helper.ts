const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
function EnumToArray(enumme: any) {
    return Object.keys(enumme)
        .filter(StringIsNumber)
        .map(key => enumme[key]);
}

export const CommonHelper = {
    StringIsNumber,
    EnumToArray
};