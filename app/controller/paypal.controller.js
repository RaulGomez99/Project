const paypal = require('paypal-rest-sdk');
require('dotenv').config();

module.exports = {
    payment,
    success,
    cancel
}

paypal.configure(configuration());

function configuration(){
    return {
        mode: process.env.ENVIROMENT,
        client_id:      (process.env.ENVIROMENT=="live") ? process.env.PAYPAL_CLIENT_ID : process.env.PAYPAL_SANDBOX_CLIENT_ID,
        client_secret : (process.env.ENVIROMENT=="live") ? process.env.PAYPAL_CLIENT_SECRET : process.env.PAYPAL_SANDBOX_CLIENT_SECRET
    }
}

function payment(req,res){
    paypal.payment.create(generatePaymentJson(), (err, payment) => {
        if(!err){
            for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                  res.redirect(payment.links[i].href);
                }
              }
        }else console.log(err.response.details);
    })
}

function generatePaymentJson(){
    return {
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": process.env.URL+"/api/paypal/success",
            "cancel_url": process.env.URL+"/api/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Easy swiss Tournament Premiun un mes",
                    "price": "10.00",
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {"currency": "EUR","total": "10.00"},
            "description": "Easy swiss Tournament Premiun un mes"
        }]
    };
}

function success (req,res){
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId; 
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{"amount": {"currency": "EUR","total": "10.00"}}]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            res.send('Success');
        }
    });
}

function cancel (req, res){
    res.send('Cancelled');
}
