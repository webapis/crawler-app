function mapPrice(price) {


    try {
        const trimPrice = price.replace('TL', '').replace('$', '').trim()//.replace(/[a-z]/gi, '') 

        switch (true) {

            case /^\d\d\d[,]\d\d$/.test(trimPrice)://299,99

                return parseFloat(trimPrice.replace(',', '.'))
            case /^\d\d\d[,]\d$/.test(trimPrice)://299,9

                return parseFloat(trimPrice.replace(',', '.'))
            case /^\d\d\d[.]\d$/.test(trimPrice)://299.9
                return parseFloat(trimPrice)
            case /^\d\d\d[.]\d\d$/.test(trimPrice)://299.99

                return parseFloat(trimPrice)
            case /^\d\d\d\d[.]\d\d$/.test(trimPrice)://1499.99

                return parseFloat(trimPrice)
            case /^\d\d\d\d[.]\d$/.test(trimPrice)://1499.9
                return parseFloat(trimPrice)
            case /^\d\d\d\d[,]\d$/.test(trimPrice)://1499,9
                return parseFloat(trimPrice.replace(',', '.'))
            case /^\d\d\d\d[,]\d\d$/.test(trimPrice)://1499,99

                return parseFloat(trimPrice.replace(',', '.'))
            case /^\d[.]\d\d\d[,]\d\d$/.test(trimPrice)://1.449,90
                return parseFloat(trimPrice.replace('.', '').replace(',', '.'))

            case /^\d[.]\d\d\d$/.test(trimPrice)://1.449

                return parseFloat(trimPrice.replace('.', ''))
            case /^\d\d\d\d$/.test(trimPrice)://4299

                return parseFloat(trimPrice)
            case /^\d[,]\d\d\d[.]\d\d$/.test(trimPrice)://3,950.00

                return parseFloat(trimPrice.replace(',', ''))
            case /^\d\d\d$/.test(trimPrice)://999

                return parseFloat(trimPrice)
            case /^\d\d[,]\d\d$/.test(trimPrice)://81,00

                return parseFloat(trimPrice.replace(',', '.'))
            case /^\d\d[.]\d\d$/.test(trimPrice)://81.00

                return parseFloat(trimPrice)
            case /^\d\d[.]\d$/.test(trimPrice)://99.9

                return parseFloat(trimPrice)


            case /^\d\d[,]\d$/.test(trimPrice)://99,9

                return parseFloat(trimPrice.replace(',', '.'))

            case /^\d\d$/.test(trimPrice)://99

                return parseFloat(trimPrice)
            case /^\d\d[.]\d\d\d[,]\d\d$/.test(trimPrice)://14.918,00

                return parseFloat(trimPrice.replace('.', '').replace(',', '.'))
                case /^\d\d\d[.]\d\d\d[,]\d\d$/.test(trimPrice)://189.950,00

                return parseFloat(trimPrice.replace('.', '').replace(',', '.'))
            case /^\d\d\d\d\d$/.test(trimPrice)://11499

                return parseFloat(trimPrice)
            case /^\d\d[.]\d\d\d$/.test(trimPrice)://14.918

                return parseFloat(trimPrice.replace('.', ''))
            case /^\d\d[,]\d\d\d$/.test(trimPrice)://14,918

                return parseFloat(trimPrice.replace(',', ''))
            default:

                return parseFloat(0)
        }
    } catch (error) {

        console.log('price----', price)
        throw error
    }

}

export default mapPrice