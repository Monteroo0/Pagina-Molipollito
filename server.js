const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_TU_CLAVE_SECRETA_DE_STRIPE'); // Reemplaza con tu clave secreta de Stripe
const app = express();

app.use(express.json());
app.use(express.static('public')); // Sirve el frontend desde la carpeta 'public'

// Ruta para pago en efectivo
app.post('/pay-cash', (req, res) => {
    const { total } = req.body;
    // Aquí puedes guardar el pedido en la base de datos con estado "pago pendiente"
    console.log(`Pedido registrado para pago en efectivo: $${total}`);
    res.json({ message: 'Pedido registrado. Paga al recibir.' });
});

// Ruta para pago con tarjeta
app.post('/pay-card', async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // En centavos
            currency: 'usd',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true
        });

        if (paymentIntent.status === 'succeeded') {
            // Aquí puedes guardar el pedido en la base de datos con estado "pagado"
            console.log(`Pago exitoso: $${amount / 100}`);
            res.json({ message: 'Pago exitoso. ¡Gracias por tu pedido!' });
        }
    } catch (error) {
        console.error('Error en el pago:', error);
        res.status(500).json({ message: 'Error al procesar el pago.' });
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));