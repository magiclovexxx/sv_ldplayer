const axios = require('axios').default;

get2fa = async () => {

    //link = "http://facode.tranquoctoan.com:8000/facode/?key=DIJZMUHT6YXRZ2A4DUZBQEYLOFXX3US5"
    link = "HTTP://localhost:1111?key=43U2BUKDVWUQX7PUPZJA24TVEDBRBPKI"
    getDataShopee = await axios.get(link)

    console.log(getDataShopee.data)
}

(async () => {
    await get2fa()

})();
