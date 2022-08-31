
export function getFormattedValue(value: number, decimalFactor = 2, decimalPoint = '.', separator = ','): string {
    // TODO: Explore the possibility of using Intl.NumberFormat browser functionality instead.
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);
    const factor = decimalFactor && parseInt(`1${'0'.repeat(decimalFactor)}`, 10);
    const fractionValue = decimalFactor ? (absValue % factor).toFixed(0) : '';
    const fractionValueFactored = fractionValue.length < decimalFactor ? `${'0'.repeat(decimalFactor - fractionValue.length)}${fractionValue}` : fractionValue;
    const integralValue = decimalFactor ? ((absValue / factor) - (parseInt(fractionValue, 10) / factor)).toString() : absValue.toString();
    const firstSeparatorLength = integralValue.length > 3 ? integralValue.length % 3 : 0;
    const firstValueString = firstSeparatorLength ? `${integralValue.substring(0, firstSeparatorLength)}${separator}` : '';
    const separatedValueString = integralValue.substring(firstSeparatorLength).replace(/(\d{3})(?=\d)/g, `$1${separator}`);
    const remainderValueString = decimalFactor ? `${decimalPoint}${fractionValueFactored}` : '';

    return `${sign}${firstValueString}${separatedValueString}${remainderValueString}`;
}
