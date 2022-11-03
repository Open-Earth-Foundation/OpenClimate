export function readableEmissions(value:number) {
    if (value < 500) {
        return `${value}T`
    } else if (value < 500000) {
        return `${(value/1000.0).toPrecision(3)}kT`
    } else if (value < 500000000) {
        return `${(value/1000000.0).toPrecision(3)}MT`
    } else {
        return `${(value/1000000000.0).toPrecision(3)}GT`
    }
}
