import config from '../../config.json'

//простой прокси
export function ServerUrl () {
    if (window.location.hostname === "localhost")
        return config.urlServerDev

    return `${window.location.protocol}\\${window.location.hostname}`
}

/*
window.location.hash: "#2"

window.location.host: "localhost:4200"

window.location.hostname: "localhost"

window.location.href: "http://localhost:4200/landing?query=1#2"

window.location.origin: "http://localhost:4200"

window.location.pathname: "/landing"

window.location.port: "4200"

window.location.protocol: "http:"

window.location.search: "?query=1"
 */