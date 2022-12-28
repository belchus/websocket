
const socket = io.connect()

const productsForm = document.getElementById('productsForm')
const productsList = document.getElementById('productsList')

productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    newProduct = { product: productsForm[0].value, price: productsForm[1].value, thumbnail: productsForm[2].value }
    socket.emit('newProduct', newProduct)
    productsForm.reset()
})


socket.on('productsTable', data => {
    fetch('views/datos.handlebars')
    .then(res => res.text())
    .then(htmlCode => {
        const productos = data.length
        const misProd = data
        const template = Handlebars.compile(htmlCode)
        const productsTemplate = template({ productos, misProd })

        productsList.innerHTML = productsTemplate
    })
})



const messagesForm = document.getElementById('messagesForm')
const userEmail = document.getElementById('userEmail')
const messageContent = document.getElementById('messageContent')
const messagesContainer = document.getElementById('messagesContainer')
const msgBtn = document.getElementsByClassName('msgBtn')


messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (validateUserEmail()) {
        nuevoMsn = { author: userEmail.value, body: messagesForm[0].value }
        socket.emit('nuevoMsn', nuevoMsn)
        messagesForm.reset()
    } else {
        messageContent.value = 'Por favor ingrese un email válido'
    }

})

userEmail.addEventListener('click', () => {
    messageContent.style.color = 'black'
    messageContent.value = ''
})

socket.on('allMessages', data => {
    const msgMapping = data.map(message => {
        return `<div>
                    <b style="color: black">${message.author}</b>
                    <span>[ ${message.date} ]</span>
                    <i style="color: white">=>  ${message.body}</i>
                </div>`
    })
    messagesContainer.innerHTML = msgMapping.join(' ')
})

// Función validadora de email
const validateUserEmail = () => {
    const emailPattern =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    let validEmail
    emailPattern.test(userEmail.value) ? validEmail = true : validEmail = false
    return validEmail
}