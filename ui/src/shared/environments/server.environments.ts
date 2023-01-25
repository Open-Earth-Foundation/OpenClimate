const url = (document && document.location) ? document.location.protocol + '//' + document.location.host : 'http://localhost'

export const ServerUrls = {
    api: `${url}/api`,
    reactAppController: url
}