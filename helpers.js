const replaceApos = (str) => {
    return str ? str.split("").map(c => c == "'" ? "''" : c).join("") : ''
}

module.exports = {
    replaceApos
}