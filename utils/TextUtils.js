import { roundTo } from "./Math"

const NumberFormat = Java.type("java.text.NumberFormat")
const Locale = Java.type("java.util.Locale")
// The following formatter uses the games language
//const formatter = NumberFormat.getInstance(Locale.forLanguageTag(Client.getMinecraft()./*getLanguageManager()*/func_135016_M()./*getCurrentLanguage()*/func_135041_c()./*getLanguageCode()*/func_135034_a().replace("_", "-")))
const formatter = NumberFormat.getInstance(Locale.US)
/**
 * Format number according to game language
 * @returns {string} Formatted number as string
 */
export function formatNumber(number) {
    return formatter.format(number)
}



export function formatNumberAbbr(number) {
    if (number < 1_000) return number + ""
    if (number < 1_000_000) return roundTo(number/1_000, 1) + "k"
    if (number < 1_000_000_000) return roundTo(number/1_000_000, 2) + "m"
    return formatNumber(roundTo(number/1_000_000_000, 2)) + "b"
}



// Literally just the default addColor but with &z
const Pattern = Java.type("java.util.regex.Pattern")
const pattern = Pattern.compile("(?<!\\\\)&(?=[0-9a-fk-orz])")
/**
 * Replace '&' color/format codes with '§' codes (includes '&z')
 * @returns {string}
 */
export function addColor(text) {
    return pattern.matcher(text).replaceAll("§")
}