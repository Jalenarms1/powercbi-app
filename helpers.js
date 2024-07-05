const replaceApos = (str) => {
    return str .split("").map(c => c == "'" ? "''" : c).join("")
}

module.exports = {
    replaceApos
}